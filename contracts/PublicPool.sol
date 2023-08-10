// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IEAS, AttestationRequest, AttestationRequestData, Attestation} from "eas-contracts/IEAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "eas-contracts/Common.sol";

contract PublicPool is ERC20 {
    using Math for uint256;

    IERC20 private immutable _asset;
    uint8 private immutable _underlyingDecimals;

    IEAS private immutable _eas;

    bytes32 public constant DEPOSIT_SCHEMA_ID =
        keccak256(
            abi.encodePacked(
                "string category,uint256 stake,uinty256 shares,uint64 endDate,uint64 value",
                address(0),
                false
            )
        );

    bytes32 public constant REDEEM_SCHEMA_ID =
        keccak256(
            abi.encodePacked("string type, string proofUrl", address(0), false)
        );

    bytes32 public constant TASK_FAILED_SCHEMA_ID =
        keccak256(abi.encodePacked("string type", address(0), false));

    struct DepositData {
        string category;
        uint64 endDate;
        uint64 value;
    }

    constructor(
        IERC20 underlyingAsset,
        IEAS eas
    ) ERC20("PublicHabitPool", "PHP") {
        _asset = underlyingAsset;
        _underlyingDecimals = ERC20(address(underlyingAsset)).decimals();
        _eas = eas;
    }

    function asset() external view returns (IERC20) {
        return _asset;
    }

    function decimals() public view override returns (uint8) {
        return _underlyingDecimals;
    }

    function totalAssets() public view returns (uint256) {
        return _asset.balanceOf(address(this));
    }

    function deposit(
        uint256 assets,
        DepositData calldata depositData
    ) external returns (bytes32) {
        uint256 shares = previewDeposit(assets);
        _asset.transferFrom(msg.sender, address(this), assets);
        _mint(msg.sender, shares);
        return
            _eas.attest(
                AttestationRequest({
                    schema: DEPOSIT_SCHEMA_ID,
                    data: AttestationRequestData({
                        recipient: msg.sender,
                        expirationTime: NO_EXPIRATION_TIME,
                        revocable: false,
                        refUID: EMPTY_UID,
                        value: 0,
                        data: abi.encode(
                            depositData.category,
                            assets,
                            shares,
                            depositData.endDate,
                            depositData.value
                        )
                    })
                })
            );
    }

    function redeem(
        bytes32 attestationId,
        string calldata proofUrl
    ) external returns (bytes32) {
        Attestation memory attestation = _eas.getAttestation(attestationId);

        require(
            attestation.schema == DEPOSIT_SCHEMA_ID,
            "PP: invalid attestation"
        );

        (, , uint256 shares, uint64 endDate, ) = abi.decode(
            attestation.data,
            (string, uint256, uint256, uint64, uint64)
        );

        require(block.timestamp <= endDate, "PP: only before endDate");
        require(attestation.recipient == msg.sender, "PP: only recipient");

        uint256 assets = previewRedeem(shares);
        _burn(msg.sender, shares);
        _asset.transfer(msg.sender, assets);

        return
            _eas.attest(
                AttestationRequest({
                    schema: REDEEM_SCHEMA_ID,
                    data: AttestationRequestData({
                        recipient: msg.sender,
                        expirationTime: NO_EXPIRATION_TIME,
                        revocable: false,
                        refUID: attestationId,
                        value: 0,
                        data: abi.encode("Redeem", proofUrl)
                    })
                })
            );
    }

    function taskFailed(bytes32 attestationId) external returns (bytes32) {
        Attestation memory attestation = _eas.getAttestation(attestationId);

        require(
            attestation.schema == DEPOSIT_SCHEMA_ID,
            "PP: invalid attestation"
        );

        (, , uint256 shares, uint64 endDate, ) = abi.decode(
            attestation.data,
            (string, uint256, uint256, uint64, uint64)
        );

        require(block.timestamp > endDate, "PP: only after endDate");

        _burn(attestation.recipient, shares);

        return
            _eas.attest(
                AttestationRequest({
                    schema: TASK_FAILED_SCHEMA_ID,
                    data: AttestationRequestData({
                        recipient: attestation.recipient,
                        expirationTime: NO_EXPIRATION_TIME,
                        revocable: false,
                        refUID: attestationId,
                        value: 0,
                        data: abi.encode("TaskFailed")
                    })
                })
            );
    }

    function previewRedeem(uint256 shares) public view returns (uint256) {
        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            return shares;
        }
        return shares.mulDiv(totalAssets(), _totalSupply, Math.Rounding.Down);
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        uint256 _totalAssets = totalAssets();
        if (_totalAssets == 0) {
            return assets;
        }
        return assets.mulDiv(totalSupply(), _totalAssets, Math.Rounding.Down);
    }
}

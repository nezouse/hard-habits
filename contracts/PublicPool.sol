// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "eas-contracts/IEAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "eas-contracts/Common.sol";

contract PublicPool is ERC20 {
    using Math for uint256;

    IERC20 private immutable _asset;
    uint8 private immutable _underlyingDecimals;

    IEAS private immutable _eas;

    bytes32 public constant DEPOSIT_SCHEMA_ID = keccak256(
        abi.encodePacked("string category,uint256 stake,uinty256 shares,uint64 endDate,uint64 value", address(0), false)
    );

    constructor(IERC20 underlyingAsset, IEAS eas) ERC20("PublicHabitPool", "PHP") {
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

    function deposit(uint256 assets) external returns (bytes32) {
        uint256 shares = previewDeposit(assets);
        _asset.transferFrom(msg.sender, address(this), assets);
        _mint(msg.sender, shares);
        return _eas.attest(
            AttestationRequest({
                schema: DEPOSIT_SCHEMA_ID,
                data: AttestationRequestData({
                    recipient: msg.sender,
                    expirationTime: NO_EXPIRATION_TIME,
                    revocable: false,
                    refUID: EMPTY_UID,
                    value: 0,
                    data: abi.encode("Steps", assets, shares, 0, 0)
                })
            })
        );
    }

    function redeem(uint256 shares) external {
        uint256 assets = previewRedeem(shares);
        _burn(msg.sender, shares);
        _asset.transfer(msg.sender, assets);
    }

    function taskFailed(uint256 amount) external {
        _burn(msg.sender, amount);
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

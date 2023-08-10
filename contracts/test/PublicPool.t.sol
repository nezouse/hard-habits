// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "../PublicPool.sol";
import "../USDC.sol";

import {EAS} from "eas-contracts/EAS.sol";
import {Attestation} from "eas-contracts/IEAS.sol";
import {SchemaRegistry} from "eas-contracts/SchemaRegistry.sol";
import {ISchemaResolver} from "eas-contracts/resolver/ISchemaResolver.sol";

contract PublicPoolTest is Test {
    PublicPool public pool;
    USDC public usdc;
    SchemaRegistry public registry;
    EAS public eas;

    PublicPool.DepositData public defaultDepositData =
        PublicPool.DepositData("test", 1, 0);

    function setUp() public {
        registry = new SchemaRegistry();
        registry.register(
            "string category,uint256 stake,uinty256 shares,uint64 endDate,uint64 value",
            ISchemaResolver(address(0)),
            false
        );
        registry.register(
            "string type, string proofUrl",
            ISchemaResolver(address(0)),
            false
        );
        registry.register("string type", ISchemaResolver(address(0)), false);

        eas = new EAS(registry);

        usdc = new USDC();
        pool = new PublicPool(usdc, eas);
    }

    function testConstructor() public {
        assertEq(pool.name(), "PublicHabitPool");
        assertEq(pool.symbol(), "PHP");
        assertEq(pool.decimals(), 6);
        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 0);
        assertEq(address(pool.asset()), address(usdc));
    }

    function testDeposit() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);

        pool.deposit(1000000, defaultDepositData);

        assertEq(pool.totalSupply(), 1000000);
        assertEq(pool.totalAssets(), 1000000);
        assertEq(usdc.balanceOf(address(pool)), 1000000);
        assertEq(usdc.balanceOf(address(this)), 0);
    }

    function testRedeem() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 depositId = pool.deposit(1000000, defaultDepositData);
        pool.redeem(depositId, "");

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 0);
        assertEq(usdc.balanceOf(address(pool)), 0);
        assertEq(usdc.balanceOf(address(this)), 1000000);
    }

    function testTaskFailed() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 depositId = pool.deposit(1000000, defaultDepositData);
        vm.warp(block.timestamp + 1);
        pool.taskFailed(depositId);

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 1000000);
        assertEq(pool.balanceOf(address(this)), 0);
    }

    function testRedeemAfterFailed() public {
        PublicPool.DepositData memory depositData = PublicPool.DepositData(
            "Steps",
            uint64(block.timestamp + 10),
            64
        );

        uint256 amount = 1000000;
        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        bytes32 depositId = pool.deposit(amount, depositData);

        address prankAddress = 0x0000000000000000000000000000000000000001;
        usdc.mint(prankAddress, amount);

        vm.startPrank(prankAddress);
        usdc.approve(address(pool), amount);
        bytes32 deposit2Id = pool.deposit(amount, defaultDepositData);
        vm.warp(block.timestamp + 1);
        pool.taskFailed(deposit2Id);
        vm.stopPrank();

        pool.redeem(depositId, "");

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 0);
        assertEq(usdc.balanceOf(address(this)), 2 * amount);
    }

    function testDepositAfterFailed() public {
        uint256 amount = 1000000;
        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        pool.deposit(amount, defaultDepositData);

        address prankAddress = 0x0000000000000000000000000000000000000001;
        usdc.mint(prankAddress, amount);

        vm.startPrank(prankAddress);
        usdc.approve(address(pool), amount);
        bytes32 depositId = pool.deposit(amount, defaultDepositData);
        vm.warp(block.timestamp + 1);
        pool.taskFailed(depositId);
        vm.stopPrank();

        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        pool.deposit(amount, defaultDepositData);

        assertEq(pool.totalSupply(), (amount * 3) / 2);
        assertEq(pool.balanceOf(address(this)), (amount * 3) / 2);
        assertEq(pool.totalAssets(), 3 * amount);
    }

    function testDepositCreatesAttestation() public {
        PublicPool.DepositData memory depositData = PublicPool.DepositData(
            "Steps",
            uint64(block.timestamp + 10),
            64
        );

        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 id = pool.deposit(1000000, depositData);

        Attestation memory attestation = eas.getAttestation(id);
        assertEq(attestation.schema, pool.DEPOSIT_SCHEMA_ID());
        assertEq(attestation.recipient, address(this));
        assertEq(attestation.revocable, false);

        (
            string memory category,
            uint256 stake,
            uint256 shares,
            uint64 endDate,
            uint64 value
        ) = abi.decode(
                attestation.data,
                (string, uint256, uint256, uint64, uint64)
            );

        assertEq(category, depositData.category);
        assertEq(stake, 1000000);
        assertEq(shares, 1000000);
        assertEq(endDate, depositData.endDate);
        assertEq(value, depositData.value);
    }

    function testReedemRevertsWithWrongSchema() public {
        vm.expectRevert(bytes("PP: invalid attestation"));
        pool.redeem(bytes32(uint256(1)), "");
    }

    function testReedemRevertsAfterEndDate() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 id = pool.deposit(1000000, defaultDepositData);

        vm.warp(block.timestamp + 1000);

        vm.expectRevert(bytes("PP: only before endDate"));
        pool.redeem(id, "");
    }

    function testReedemRevertsIfNotRecipient() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 id = pool.deposit(1000000, defaultDepositData);

        vm.expectRevert(bytes("PP: only recipient"));
        vm.prank(address(1));
        pool.redeem(id, "");
    }

    function testTaskFailedBurnsSharesFromRecipient() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 depositId = pool.deposit(1000000, defaultDepositData);
        vm.warp(block.timestamp + 1);
        vm.prank(address(1));
        pool.taskFailed(depositId);

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 1000000);
        assertEq(pool.balanceOf(address(this)), 0);
    }

    function testRedeemCreatesAttestation() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 depositId = pool.deposit(1000000, defaultDepositData);

        bytes32 redeemId = pool.redeem(depositId, "url");

        Attestation memory attestation = eas.getAttestation(redeemId);
        assertEq(attestation.schema, pool.REDEEM_SCHEMA_ID());
        assertEq(attestation.recipient, address(this));
        assertEq(attestation.revocable, false);

        (string memory category, string memory proofUrl) = abi.decode(
            attestation.data,
            (string, string)
        );

        assertEq(category, "Redeem");
        assertEq(proofUrl, "url");
    }

    function testTaskFailedCreatesAttestation() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 depositId = pool.deposit(1000000, defaultDepositData);

        vm.warp(block.timestamp + 1);
        bytes32 failedId = pool.taskFailed(depositId);

        Attestation memory attestation = eas.getAttestation(failedId);
        assertEq(attestation.schema, pool.TASK_FAILED_SCHEMA_ID());
        assertEq(attestation.recipient, address(this));
        assertEq(attestation.revocable, false);

        string memory category = abi.decode(attestation.data, (string));

        assertEq(category, "TaskFailed");
    }
}

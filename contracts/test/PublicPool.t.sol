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
    bytes32 public schemaId;

    function setUp() public {
        registry = new SchemaRegistry();
        schemaId = registry.register(
            "string category,uint256 stake,uinty256 shares,uint64 endDate,uint64 value",
            ISchemaResolver(address(0)),
            false
        );

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

        pool.deposit(1000000);

        assertEq(pool.totalSupply(), 1000000);
        assertEq(pool.totalAssets(), 1000000);
        assertEq(usdc.balanceOf(address(pool)), 1000000);
        assertEq(usdc.balanceOf(address(this)), 0);
    }

    function testRedeem() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        pool.deposit(1000000);
        pool.redeem(1000000);

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 0);
        assertEq(usdc.balanceOf(address(pool)), 0);
        assertEq(usdc.balanceOf(address(this)), 1000000);
    }

    function testTaskFailed() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        pool.deposit(1000000);
        pool.taskFailed(1000000);

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 1000000);
        assertEq(pool.balanceOf(address(this)), 0);
    }

    function testRedeemAfterFailed() public {
        uint256 amount = 1000000;
        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        pool.deposit(amount);

        address prankAddress = 0x0000000000000000000000000000000000000001;
        usdc.mint(prankAddress, amount);

        vm.startPrank(prankAddress);
        usdc.approve(address(pool), amount);
        pool.deposit(amount);
        pool.taskFailed(amount);
        vm.stopPrank();

        pool.redeem(amount);

        assertEq(pool.totalSupply(), 0);
        assertEq(pool.totalAssets(), 0);
        assertEq(usdc.balanceOf(address(this)), 2 * amount);
    }

    function testDepositAfterFailed() public {
        uint256 amount = 1000000;
        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        pool.deposit(amount);

        address prankAddress = 0x0000000000000000000000000000000000000001;
        usdc.mint(prankAddress, amount);

        vm.startPrank(prankAddress);
        usdc.approve(address(pool), amount);
        pool.deposit(amount);
        pool.taskFailed(amount);
        vm.stopPrank();

        usdc.mint(address(this), amount);
        usdc.approve(address(pool), amount);
        pool.deposit(amount);

        assertEq(pool.totalSupply(), (amount * 3) / 2);
        assertEq(pool.balanceOf(address(this)), (amount * 3) / 2);
        assertEq(pool.totalAssets(), 3 * amount);
    }

    function testDepositCreatesAttestation() public {
        usdc.mint(address(this), 1000000);
        usdc.approve(address(pool), 1000000);
        bytes32 id = pool.deposit(1000000);

        Attestation memory attestation = eas.getAttestation(id);
        assertEq(attestation.schema, schemaId);
        assertEq(attestation.recipient, address(this));
        assertEq(attestation.revocable, false);

        (string memory category, uint256 stake, uint256 shares, uint64 endDate, uint64 value) =
            abi.decode(attestation.data, (string, uint256, uint256, uint64, uint64));

        assertEq(category, "Steps");
        assertEq(stake, 1000000);
        assertEq(shares, 1000000);
        assertEq(endDate, 0);
        assertEq(value, 0);
    }
}

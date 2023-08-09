// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "../PublicPool.sol";
import "../USDC.sol";

contract PublicPoolTest is Test {
    PublicPool public pool;
    USDC public usdc;

    function setUp() public {
        usdc = new USDC();
        pool = new PublicPool(usdc);
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
}

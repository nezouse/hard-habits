// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {PublicPool} from "../PublicPool.sol";

contract DeployPublicPool is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Optimism goerli only for now
        new PublicPool(
            0x5f1C3c9D42F531975EdB397fD4a34754cc8D3b71,
            0x4200000000000000000000000000000000000021
        );

        vm.stopBroadcast();
    }
}

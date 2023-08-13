// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {PublicPool} from "../PublicPool.sol";
import {SchemaRegistry} from "eas-contracts/SchemaRegistry.sol";
import {ISchemaResolver} from "eas-contracts/resolver/ISchemaResolver.sol";

contract DeployPublicPool is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Optimism goerli only for now
        PublicPool pool = new PublicPool(
            0x5f1C3c9D42F531975EdB397fD4a34754cc8D3b71,
            0x4200000000000000000000000000000000000021
        );

        SchemaRegistry registry = SchemaRegistry(
            0x4200000000000000000000000000000000000020
        );
        if (registry.getSchema(pool.DEPOSIT_SCHEMA_ID()).uid == bytes32(0)) {
            registry.register(
                "string category,uint256 stake,uint256 shares,uint64 endDate,uint64 value",
                ISchemaResolver(address(0)),
                false
            );
        }
        if (registry.getSchema(pool.REDEEM_SCHEMA_ID()).uid == bytes32(0)) {
            registry.register(
                "string type,string proofUrl,uint256 valueRedeemed,uint64 redeemDate",
                ISchemaResolver(address(0)),
                false
            );
        }
        if (
            registry.getSchema(pool.TASK_FAILED_SCHEMA_ID()).uid == bytes32(0)
        ) {
            registry.register(
                "string type,uint64 burnDate",
                ISchemaResolver(address(0)),
                false
            );
        }

        vm.stopBroadcast();
    }
}

/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query userAttestationsQuery {\n    attestations(\n      where: {\n        recipient: { equals: \"0x7F6733Ce45570105b60B4c49C029f8d4acC2A751\" }\n      }\n    ) {\n      id\n      decodedDataJson\n    }\n  }\n": types.UserAttestationsQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query userAttestationsQuery {\n    attestations(\n      where: {\n        recipient: { equals: \"0x7F6733Ce45570105b60B4c49C029f8d4acC2A751\" }\n      }\n    ) {\n      id\n      decodedDataJson\n    }\n  }\n"): typeof import('./graphql').UserAttestationsQueryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

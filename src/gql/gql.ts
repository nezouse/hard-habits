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
    "\n  fragment AttestationFragment on Attestation {\n    id\n    recipient\n    schemaId\n    refUID\n    decodedDataJson\n  }\n": types.AttestationFragmentFragmentDoc,
    "\n  query allAttestationsQuery($attester: String) {\n    attestations(\n      where: { attester: { equals: $attester } }\n      orderBy: { timeCreated: desc }\n    ) {\n      ...AttestationFragment\n    }\n  }\n": types.AllAttestationsQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AttestationFragment on Attestation {\n    id\n    recipient\n    schemaId\n    refUID\n    decodedDataJson\n  }\n"): typeof import('./graphql').AttestationFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allAttestationsQuery($attester: String) {\n    attestations(\n      where: { attester: { equals: $attester } }\n      orderBy: { timeCreated: desc }\n    ) {\n      ...AttestationFragment\n    }\n  }\n"): typeof import('./graphql').AllAttestationsQueryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

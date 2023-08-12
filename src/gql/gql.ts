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
    "\n  query userAttestationsQuery($recipient: String) {\n    attestations(where: { recipient: { equals: $recipient } }) {\n      id\n      revoked\n      decodedDataJson\n      data\n    }\n  }\n": types.UserAttestationsQueryDocument,
    "\n  query attestationQuery($id: String!) {\n    attestation(where: { id: $id }) {\n      id\n      revoked\n      decodedDataJson\n    }\n  }\n": types.AttestationQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query userAttestationsQuery($recipient: String) {\n    attestations(where: { recipient: { equals: $recipient } }) {\n      id\n      revoked\n      decodedDataJson\n      data\n    }\n  }\n"): typeof import('./graphql').UserAttestationsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query attestationQuery($id: String!) {\n    attestation(where: { id: $id }) {\n      id\n      revoked\n      decodedDataJson\n    }\n  }\n"): typeof import('./graphql').AttestationQueryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

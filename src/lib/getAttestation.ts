import { graphql } from "@/gql";
import { gqlRequest } from "@/lib/gqlRequest";

const easscanGraphqlEndpoint =
  "https://optimism-goerli-bedrock.easscan.org/graphql";

export async function getAttestation(id: string) {
  const response = await gqlRequest(
    easscanGraphqlEndpoint,
    userAttestationDocument,
    { id }
  );

  if (!response.attestation) throw new Error("Attestation not found");

  return response.attestation;
}

export async function getUserAttestations(recipient: string) {
  const response = await gqlRequest(
    easscanGraphqlEndpoint,
    userAttestationsDocument,
    { recipient }
  );

  return response.attestations.map((attestation) =>
    parseAttestation(attestation)
  );
}

export function parseAttestation(attestation: Attestation) {
  return {
    id: attestation.id,
    data: JSON.parse(attestation.decodedDataJson)
      .map(({ name, value }: { name: any; value: any }) => ({
        [name]: value.value,
      }))
      .reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {}),
  };
}

export type Attestation = Awaited<ReturnType<typeof getAttestation>>;

export const attestationFragment = graphql(/* GraphQL */ `
  fragment AttestationFragment on Attestation {
    id
    decodedDataJson
  }
`);

const userAttestationDocument = graphql(/* GraphQL */ `
  query attestationQuery($id: String!) {
    attestation(where: { id: $id }) {
      ...AttestationFragment
    }
  }
`);

const userAttestationsDocument = graphql(/* GraphQL */ `
  query userAttestationsQuery($recipient: String) {
    attestations(where: { recipient: { equals: $recipient } }) {
      ...AttestationFragment
    }
  }
`);

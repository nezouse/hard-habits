import { graphql } from "@/gql";
import { gqlRequest } from "@/lib/gqlRequest";

export async function getAttestation(id: string) {
  const response = await gqlRequest(
    "https://optimism-goerli-bedrock.easscan.org/graphql",
    userAttestationDocument,
    { id }
  );

  if (!response.attestation) throw new Error("Attestation not found");

  return response.attestation;
}

export type Attestation = Awaited<ReturnType<typeof getAttestation>>;

const userAttestationDocument = graphql(/* GraphQL */ `
  query attestationQuery($id: String!) {
    attestation(where: { id: $id }) {
      id
      revoked
      decodedDataJson
    }
  }
`);

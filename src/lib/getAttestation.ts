import { addresses } from "@/config/addresses";
import { graphql } from "@/gql";
import { AttestationFragmentFragment } from "@/gql/graphql";
import { gqlRequest } from "@/lib/gqlRequest";

const easscanGraphqlEndpoint =
  "https://optimism-goerli-bedrock.easscan.org/graphql";

const depositSchema =
  "0xc92e07a2a609e534e900bbfa91dc11dbf2ebcd370a3c9179b9af87a2927031ce";

const redeemSchema =
  "0x2a673dee79c08ec2cc6400c4a9b90afb40ea5cda866b10c496c51a00278ac194";

const failedSchema =
  "0x188558989ff0328a0ce42c40af5c229eafeff9eb47360d9226c041dcfdc5f850";

export async function getAttestation(id: string) {
  const attestations = await getAllAttestations();
  const attestation = attestations.find((attestation) => attestation.id === id);

  if (!attestation) {
    throw new Error("Attestation not found");
  }

  return attestation;
}

export async function getUserAttestations(recipient: string) {
  const attestations = await getAllAttestations();
  return attestations.filter(
    (attestation) => attestation.recipient === recipient
  );
}

export async function getAllAttestations() {
  const response = await gqlRequest(
    easscanGraphqlEndpoint,
    allAttestationsDocument,
    { attester: addresses.publicPool[420] }
  );

  const allAttestations = response.attestations.map((attestation) =>
    parseAttestation(attestation)
  );

  const depositAttestations = allAttestations.filter(
    (attestation) => attestation.schema === depositSchema
  );

  const redeemAttestations = allAttestations.filter(
    (attestation) => attestation.schema === redeemSchema
  );

  const failedAttestations = allAttestations.filter(
    (attestation) => attestation.schema === failedSchema
  );

  const mappedAttestations = depositAttestations.map((depositAttestation) => {
    const redeemAttestation = redeemAttestations.find(
      (redeemAttestation) => redeemAttestation.refId === depositAttestation.id
    );

    const failedAttestation = failedAttestations.find(
      (failedAttestation) => failedAttestation.refId === depositAttestation.id
    );

    const status = failedAttestation
      ? "failed"
      : redeemAttestation
      ? "redeemed"
      : "inProgress";

    return {
      ...depositAttestation,
      proofUrl: redeemAttestation?.data.proofUrl,
      status,
      valueRedeemed: redeemAttestation?.data.valueRedeemed,
    } as const;
  });

  return mappedAttestations;
}

function parseAttestation(attestation: AttestationFragmentFragment) {
  return {
    id: attestation.id,
    recipient: attestation.recipient,
    schema: attestation.schemaId,
    refId: attestation.refUID,
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
    recipient
    schemaId
    refUID
    decodedDataJson
  }
`);

const allAttestationsDocument = graphql(/* GraphQL */ `
  query allAttestationsQuery($attester: String) {
    attestations(
      where: { attester: { equals: $attester } }
      orderBy: { timeCreated: desc }
    ) {
      ...AttestationFragment
    }
  }
`);

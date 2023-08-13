import { Attestation } from "@/app/publicPool/complete/[attestationId]/getAttestation";

export function parseAttestation(attestation: Attestation) {
  return {
    id: attestation.id,
    revoked: attestation.revoked,
    ...JSON.parse(attestation.decodedDataJson)
      .map(({ name, value }: { name: any; value: any }) => ({
        [name]: value.value,
      }))
      .reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {}),
  };
}

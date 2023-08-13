import { RedeemForm } from "./Form";
import { getAttestation } from "./getAttestation";

interface PageProps {
  params: {
    attestationId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const attestation = await getAttestation(params.attestationId);
  return <RedeemForm attestation={attestation} />;
}
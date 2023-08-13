import { RedeemForm } from "./Form";
import { getAttestation } from "@/lib/getAttestation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    attestationId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const attestation = await getAttestation(params.attestationId);
  return <RedeemForm attestation={attestation} />;
}

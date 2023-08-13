import { getAllAttestations } from "@/lib/getAttestation";

export default async function Page() {
  const attestations = await getAllAttestations();
  return (
    <div>
      <div>Feed</div>
      <pre>{JSON.stringify(attestations, null, 2)}</pre>
    </div>
  );
}

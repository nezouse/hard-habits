import { HabitCard } from "@/components/HabitCard";
import { getAllAttestations } from "@/lib/getAttestation";

export default async function Page() {
  const attestations = await getAllAttestations();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4">All posts</div>
      <div className="flex flex-wrap justify-center gap-4">
        {attestations.map((attestation) => (
          <HabitCard key={attestation.id} attestation={attestation} />
        ))}
      </div>
    </div>
  );
}

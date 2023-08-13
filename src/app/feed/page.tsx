import { HabitCard } from "@/components/HabitCard";
import { getAllAttestations } from "@/lib/getAttestation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const attestations = await getAllAttestations();
  return (
    <div className="mx-auto max-w-5xl p-9">
      <div className="mb-4 text-3xl">All posts</div>
      <div>Don't stalk people too hard</div>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {attestations.map((attestation) => (
          <HabitCard key={attestation.id} attestation={attestation} />
        ))}
      </div>
    </div>
  );
}

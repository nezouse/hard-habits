import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserAttestations } from "@/lib/getAttestation";
import { format } from "date-fns";
import Link from "next/link";
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import { AttestationLink } from "@/lib/getAttestationLink";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    account: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getUserAttestations(params.account);

  const steps = data.reduce((acc, attestation) => {
    if (attestation.status === "redeemed") {
      return acc + Number.parseInt(attestation.data.value.hex, 16);
    }
    return acc;
  }, 0);

  const challengesDone = data.filter(
    (attestation) => attestation.status === "redeemed"
  ).length;

  const moneyEarned = data.reduce((acc, attestation) => {
    if (attestation.status === "redeemed") {
      return acc + Number.parseInt(attestation.data.stake.hex, 16);
    }
    return acc;
  }, 0);

  return (
    <div className="my-2 mx-8">
      <div className="px-4 py-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid grid-cols-3 row-gap-8">
          <div className="text-center md:border-r">
            <h6 className="text-2xl font-bold lg:text-5xl xl:text-6xl">
              {steps}
            </h6>
            <p className="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
              Steps done
            </p>
          </div>
          <div className="text-center md:border-r">
            <h6 className="text-2xl font-bold lg:text-5xl xl:text-6xl">
              {moneyEarned / 10 ** 6}
            </h6>
            <p className="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
              USD earned
            </p>
          </div>
          <div className="text-center">
            <h6 className="text-2xl font-bold lg:text-5xl xl:text-6xl">
              {challengesDone}
            </h6>
            <p className="text-sm font-medium tracking-widest text-gray-800 uppercase lg:text-base">
              {`challenge${challengesDone !== 1 ? "s" : ""} finished`}
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Stake</TableHead>
            <TableHead>End date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((attestation) => (
            <TableRow key={attestation.id}>
              <TableCell>
                <AttestationLink chainId={420} attestationId={attestation.id}>
                  {attestation.id.substring(0, 6)}...
                </AttestationLink>
              </TableCell>
              <TableCell className="capitalize">
                {attestation.data.category}
              </TableCell>
              <TableCell>
                {Number.parseInt(attestation.data.value.hex, 16)}
              </TableCell>
              <TableCell>
                ${Number.parseInt(attestation.data.stake.hex, 16) / 10 ** 6}
              </TableCell>
              <TableCell>
                {format(
                  new Date(
                    Number.parseInt(attestation.data.endDate.hex, 16) * 1000
                  ),
                  "PPP"
                )}
              </TableCell>
              <TableCell>
                {attestation.status === "inProgress" && (
                  <Button asChild variant="outline">
                    <Link href={`/publicPool/complete/${attestation.id}`}>
                      Mark as completed
                    </Link>
                  </Button>
                )}
                {attestation.status === "redeemed" && (
                  <div className="flex gap-1 h-9 items-center px-3">
                    <BadgeCheckIcon className="h-5 w-5" />
                    Completed
                  </div>
                )}
                {attestation.status === "failed" && (
                  <div className="flex gap-1 h-9 items-center px-3">
                    <BadgeXIcon className="h-5 w-5" />
                    Failed
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

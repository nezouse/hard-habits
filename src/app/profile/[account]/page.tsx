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
import { BadgeCheckIcon } from "lucide-react";
import { AttestationLink } from "@/lib/getAttestationLink";

interface PageProps {
  params: {
    account: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getUserAttestations(params.account);

  return (
    <div className="m-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Value</TableHead>
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
                {format(
                  new Date(
                    Number.parseInt(attestation.data.endDate.hex, 16) * 1000
                  ),
                  "PPP"
                )}
              </TableCell>
              <TableCell>
                {attestation.status === "inProgress" && (
                  <Button asChild>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

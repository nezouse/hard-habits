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

interface PageProps {
  params: {
    account: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getUserAttestations(params.account);

  return (
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
            <TableCell>{attestation.id.substring(0, 6)}...</TableCell>
            <TableCell>{attestation.data.category}</TableCell>
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
              <Button asChild>
                <Link href={`/publicPool/complete/${attestation.id}`}>
                  Mark as completed
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

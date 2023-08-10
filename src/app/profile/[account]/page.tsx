import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { graphql } from "@/gql";
import { gqlRequest } from "@/lib/gqlRequest";
import { format } from "date-fns";
import Link from "next/link";

interface PageProps {
  params: {
    account: string;
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getData(params.account);

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
        {data.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.id.substring(0, 6)}...</TableCell>
            <TableCell>{data.category}</TableCell>
            <TableCell>{Number.parseInt(data.value.hex, 16)}</TableCell>
            <TableCell>
              {format(
                new Date(Number.parseInt(data.endDate.hex, 16) * 1000),
                "PPP"
              )}
            </TableCell>
            <TableCell>
              <Button asChild>
                <Link href="/publicPool/complete">Mark as completed</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const userAttestationsDocument = graphql(/* GraphQL */ `
  query userAttestationsQuery($recipient: String) {
    attestations(where: { recipient: { equals: $recipient } }) {
      id
      revoked
      decodedDataJson
      data
    }
  }
`);

async function getData(recipient: string) {
  const response = await gqlRequest(
    "https://optimism-goerli-bedrock.easscan.org/graphql",
    userAttestationsDocument,
    { recipient }
  );

  return response.attestations.map(({ id, decodedDataJson }) => ({
    id,
    ...JSON.parse(decodedDataJson)
      .map(({ name, value }: { name: any; value: any }) => ({
        [name]: value.value,
      }))
      .reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {}),
  }));
}

import { graphql } from "@/gql";
import { gqlRequest } from "@/lib/gqlRequest";

export default async function Page() {
  const data = await getData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

const userAttestationsDocument = graphql(/* GraphQL */ `
  query userAttestationsQuery {
    attestations(
      where: {
        recipient: { equals: "0x7F6733Ce45570105b60B4c49C029f8d4acC2A751" }
      }
    ) {
      id
      decodedDataJson
    }
  }
`);

async function getData() {
  const response = await gqlRequest(
    "https://optimism-goerli-bedrock.easscan.org/graphql",
    userAttestationsDocument,
    {}
  );

  return response.attestations.map(({ id, decodedDataJson }) => ({
    id,
    data: JSON.parse(decodedDataJson),
  }));
}

import { TypedDocumentString } from "@/gql/graphql";

export async function gqlRequest<T, V>(
  url: string,
  document: TypedDocumentString<T, V>,
  variables: V
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: document,
      variables,
    }),
  });
  const json = await response.json();
  return json.data;
}

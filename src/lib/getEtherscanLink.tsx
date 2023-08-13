import * as chains from "wagmi/chains";

export const getAddressExplorerUrl = (chainId: number, address: string) => {
  const chain = Object.values(chains).find(
    (chain) => "id" in chain && chain.id === chainId
  );

  if (!chain) {
    throw new Error(`No chain found for chainId ${chainId}`);
  }

  // @ts-ignore
  return `${chain.blockExplorers.default.url}/address/${address}`;
};

interface AddressExplorerLinkProps {
  chainId: number;
  address: string;
}

export function AddressExplorerLink({
  chainId,
  address,
}: AddressExplorerLinkProps) {
  const href = getAddressExplorerUrl(chainId, address);
  return (
    <a href={href} target="_blank">
      {address.substring(0, 6)}...{address.substring(address.length - 4)}
    </a>
  );
}

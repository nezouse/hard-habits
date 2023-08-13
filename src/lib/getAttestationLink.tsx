const attestationUrls: Record<number, string> = {
  420: "https://optimism-goerli-bedrock.easscan.org/attestation/view/",
};

interface AttestationLinkProps {
  chainId: number;
  attestationId: string;
  children: React.ReactNode;
}

export function AttestationLink({
  chainId,
  attestationId,
  children,
}: AttestationLinkProps) {
  const href = attestationUrls[chainId] + attestationId;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

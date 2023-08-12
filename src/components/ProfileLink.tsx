"use client";

import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";

export function ProfileLink() {
  const { address } = useAccount();

  if (!address) {
    return (
      <Button variant="link" disabled>
        Your profile
      </Button>
    );
  }

  return (
    <Button variant="link" asChild>
      <Link href={`/profile/${address}`}>Your profile</Link>
    </Button>
  );
}

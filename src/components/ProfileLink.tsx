"use client";

import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";

export function ProfileLink() {
  const { address } = useAccount();

  if (!address) {
    return (
      <Button variant="link" disabled className="text-yellow-950">
        Your profile
      </Button>
    );
  }

  return (
    <Button variant="link" asChild className="text-yellow-950">
      <Link href={`/profile/${address}`}>Your profile</Link>
    </Button>
  );
}

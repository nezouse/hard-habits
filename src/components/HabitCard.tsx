"use client";

import type { Attestation } from "@/lib/getAttestation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";
import Placeholder from "@/images/placeholderImage.jpg";
import { TxButton } from "./TxButton";
import { usePublicPoolTaskFailed } from "@/generated";
import { addresses } from "@/config/addresses";
import { AddressExplorerLink } from "@/lib/getEtherscanLink";
import { AttestationLink } from "@/lib/getAttestationLink";

interface HabitCardProps {
  attestation: Attestation;
}

export function HabitCard({ attestation }: HabitCardProps) {
  return (
    <Card className="w-fit flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          <AttestationLink
            chainId={420}
            attestationId={attestation.id}
          >{`I will do ${parseInt(
            attestation.data.value.hex,
            16
          )} steps!`}</AttestationLink>
        </CardTitle>
        <CardDescription>
          By{" "}
          <AddressExplorerLink chainId={420} address={attestation.recipient} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={attestation.proofUrl ? attestation.proofUrl : Placeholder}
          width={250}
          height={250}
          alt=""
          className="mx-auto"
        />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <FooterContent attestation={attestation} />
      </CardFooter>
    </Card>
  );
}

interface FooterContentProps {
  attestation: Attestation;
}

function FooterContent({ attestation }: FooterContentProps) {
  const { address: account } = useAccount();

  switch (attestation.status) {
    case "inProgress": {
      return (
        <>
          {new Date() >
          new Date(Number.parseInt(attestation.data.endDate.hex, 16) * 1000) ? (
            <>
              <div>Time for that one already passed</div>
              <BurnButton attestationId={attestation.id} />
            </>
          ) : (
            <>
              <div className="mx-auto">
                {`Must be finished by ${format(
                  new Date(
                    Number.parseInt(attestation.data.endDate.hex, 16) * 1000
                  ),
                  "PPP"
                )}`}
              </div>
              {account &&
                isAddressEqual(
                  account,
                  attestation.recipient as `0x${string}`
                ) && (
                  <Button asChild className="mx-auto w-40">
                    <Link href={`/publicPool/complete/${attestation.id}`}>
                      Complete now
                    </Link>
                  </Button>
                )}
            </>
          )}
        </>
      );
    }
    case "redeemed": {
      return (
        <div className="flex items-center gap-1">
          <BadgeCheckIcon className="h-5 w-5" /> Task sucessfully finished
        </div>
      );
    }
    case "failed": {
      return (
        <div className="flex items-center gap-1">
          <BadgeXIcon className="h-5 w-5" /> Task failed
        </div>
      );
    }
  }
}

interface BurnButtonProps {
  attestationId: string;
}

function BurnButton({ attestationId }: BurnButtonProps) {
  const { write, data, status } = usePublicPoolTaskFailed({
    address: addresses.publicPool[420],
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write({ args: [attestationId as `0x${string}`] });
      }}
    >
      <TxButton sendTx={write} txData={data} status={status} label="Burn it" />
    </form>
  );
}

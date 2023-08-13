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
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";
import Placeholder from "@/images/placeholderImage.jpg";
import { TxButton } from "./TxButton";
import { usePublicPoolTaskFailed } from "@/generated";
import { addresses } from "@/config/addresses";

interface HabitCardProps {
  attestation: Attestation;
}

export function HabitCard({ attestation }: HabitCardProps) {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>{`I will do ${parseInt(
          attestation.data.value.hex,
          16
        )} steps!`}</CardTitle>
        <CardDescription>By {attestation.recipient}</CardDescription>
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
              {isAddressEqual(
                account!,
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
          <CheckCircledIcon className="h-5 w-5" /> Task sucessfully finished
        </div>
      );
    }
    case "failed": {
      return (
        <div className="flex items-center gap-1">
          <CrossCircledIcon className="h-5 w-5" /> Task failed
        </div>
      );
    }
  }
}

interface BurnButtonProps {
  attestationId: string;
}

function BurnButton({ attestationId }: BurnButtonProps) {
  const { write, data } = usePublicPoolTaskFailed({
    address: addresses.publicPool[420],
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write({ args: [attestationId as `0x${string}`] });
      }}
    >
      <TxButton sendTx={write} txData={data} label="Burn it" />
    </form>
  );
}

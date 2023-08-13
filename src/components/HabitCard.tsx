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
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";
import Placeholder from "@/images/placeholderImage.jpg";

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
      <CardFooter className="flex-col gap-4">
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
          <div className="mx-auto">
            {`Must be finished by ${format(
              new Date(
                Number.parseInt(attestation.data.endDate.hex, 16) * 1000
              ),
              "PPP"
            )}`}
          </div>
          {isAddressEqual(account!, attestation.recipient as `0x${string}`) && (
            <Button asChild className="mx-auto w-40">
              <Link href={`/publicPool/complete/${attestation.id}`}>
                Complete now
              </Link>
            </Button>
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
  }
}

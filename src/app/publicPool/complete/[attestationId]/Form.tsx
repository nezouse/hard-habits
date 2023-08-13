"use client";

import "@uploadthing/react/styles.css";

import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholderImage.jpg";

import type { Attestation } from "./getAttestation";
import { parseAttestation } from "@/lib/parseAttestation";
import { usePublicPoolRedeem } from "@/generated";
import { addresses } from "@/config/addresses";
import { TxButton } from "@/components/TxButton";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  attestationId: z.string(),
  imageUrl: z.string().url(),
});
type formSchema = z.infer<typeof formSchema>;

interface FormProps {
  attestation: Attestation;
}

export function RedeemForm({ attestation }: FormProps) {
  const { data, write, error } = usePublicPoolRedeem({
    address: addresses.publicPool[420],
  });

  console.log(error, data);
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attestationId: attestation.id,
    },
  });
  const fileUrl = form.watch("imageUrl");

  const attestationData = parseAttestation(attestation);

  console.log(form.formState.errors);
  console.log(form.watch());
  console.log(form.formState.isValid);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ attestationId, imageUrl }) => {
            console.log("submiteted");
            write({ args: [attestationId as `0x${string}`, imageUrl] });
          })}
        >
          <div>Mark as completed {attestation.id}</div>
          <div>Category: {attestationData.category}</div>
          <div>Value: {parseInt(attestationData.value.hex, 16)}</div>
          <div>Amount: {parseInt(attestationData.stake.hex, 16) / 10 ** 6}</div>

          <div className="flex flex-col items-center gap-4 w-fit border p-4 rounded-lg">
            <Image
              src={fileUrl ? fileUrl : PlaceholderImage}
              width={200}
              height={200}
              alt=""
            />

            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                form.setValue("imageUrl", res?.[0].url || "", {
                  shouldValidate: true,
                });
              }}
            />
          </div>
          <TxButton label="Reedem" sendTx={write} txData={data} />
        </form>
      </Form>
    </div>
  );
}

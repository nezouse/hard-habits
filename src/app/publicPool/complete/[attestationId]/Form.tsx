"use client";

import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholderImage.jpg";

import type { Attestation } from "@/lib/getAttestation";
import { usePublicPoolRedeem, usePublicPoolPreviewRedeem } from "@/generated";
import { addresses } from "@/config/addresses";
import { TxButton } from "@/components/TxButton";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  attestationId: z.string(),
  imageUrl: z.string().url(),
});
type formSchema = z.infer<typeof formSchema>;

interface FormProps {
  attestation: Attestation;
}

export function RedeemForm({ attestation }: FormProps) {
  const { data, write, status } = usePublicPoolRedeem({
    address: addresses.publicPool[420],
  });
  const router = useRouter();

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attestationId: attestation.id,
    },
  });
  const fileUrl = form.watch("imageUrl");

  const { data: previewData } = usePublicPoolPreviewRedeem({
    address: addresses.publicPool[420],
    args: [attestation.data.stake.hex],
  });

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
          <div>Category: {attestation.data.category}</div>
          <div>Value: {parseInt(attestation.data.value.hex, 16)} steps</div>
          <div>
            Amount: ${parseInt(attestation.data.stake.hex, 16) / 10 ** 6}
          </div>
          <div>
            You will get back $
            {parseInt(previewData?.toString() ?? "0") / 10 ** 6}
          </div>

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
          <TxButton
            label="Reedem"
            sendTx={write}
            status={status}
            txData={data}
            onSuccess={() => {
              router.push("/feed");
            }}
          />
        </form>
      </Form>
    </div>
  );
}

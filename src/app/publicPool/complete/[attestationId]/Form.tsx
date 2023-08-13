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
import { AttestationLink } from "@/lib/getAttestationLink";

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
    <div className="p-9">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ attestationId, imageUrl }) => {
            console.log("submiteted");
            write({ args: [attestationId as `0x${string}`, imageUrl] });
          })}
        >
          <div className="flex gap-12 mx-auto justify-center flex-wrap">
            <div className="flex flex-col gap-4">
              <div>
                <AttestationLink chainId={420} attestationId={attestation.id}>
                  Mark as completed {attestation.id.substring(0, 6)}
                </AttestationLink>
              </div>
              <div>
                You were supposed to do{" "}
                {parseInt(attestation.data.value.hex, 16)}{" "}
                {attestation.data.category}
              </div>
              <div>
                You staked {parseInt(attestation.data.stake.hex, 16) / 10 ** 6}$
                for your success
              </div>
              <div>
                You will get back $
                {parseInt(previewData?.toString() ?? "0") / 10 ** 6}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-fit border p-4 rounded-lg">
              <Image
                src={fileUrl ? fileUrl : PlaceholderImage}
                width={300}
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
          </div>
          <div className="flex justify-center mt-12">
            <TxButton
              label="Reedem"
              sendTx={write}
              status={status}
              txData={data}
              onSuccess={() => {
                router.push("/feed");
              }}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

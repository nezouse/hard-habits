"use client";

import "@uploadthing/react/styles.css";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholderImage.jpg";
import { Button } from "@/components/ui/button";
import type { Attestation } from "./getAttestation";

interface FormProps {
  attestation: Attestation;
}

export function Form({ attestation }: FormProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  return (
    <div>
      <div>Mark as completed {attestation.id}</div>

      <div className=" flex flex-col items-center gap-4 w-fit border p-4 rounded-lg">
        <Image
          src={fileUrl ? fileUrl : PlaceholderImage}
          width={200}
          height={200}
          alt=""
        />

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            setFileUrl(res?.[0].url || null);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
      <Button>Submit</Button>
    </div>
  );
}

import { useQueryClient, useWaitForTransaction } from "wagmi";
import { WriteContractResult } from "wagmi/actions";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

export interface TxButtonProps {
  label: string;
  status: "error" | "loading" | "success" | "idle";
  sendTx: () => void;
  txData: WriteContractResult | undefined;
  onSuccess?: () => void;
}

export function TxButton({ txData, label, status, onSuccess }: TxButtonProps) {
  const queryClient = useQueryClient();
  const { status: waitStatus } = useWaitForTransaction({
    hash: txData?.hash,
    async onSuccess() {
      await queryClient.invalidateQueries();
      onSuccess?.();
    },
  });

  const isLoading = status === "loading" || waitStatus === "loading";

  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />}
      {label}
    </Button>
  );
}

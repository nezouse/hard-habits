import { useQueryClient, useWaitForTransaction } from "wagmi";
import { WriteContractResult } from "wagmi/actions";
import { Button } from "./ui/button";

export interface TxButtonProps {
  label: string;
  sendTx: () => void;
  txData: WriteContractResult | undefined;
}

export function TxButton({ txData, label }: TxButtonProps) {
  const queryClient = useQueryClient();
  useWaitForTransaction({
    hash: txData?.hash,
    async onSuccess() {
      await queryClient.invalidateQueries();
    },
  });

  return <Button type="submit">{label}</Button>;
}

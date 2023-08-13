"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount } from "wagmi";
import {
  useErc20Allowance,
  useErc20Approve,
  usePublicPoolDeposit,
} from "@/generated";
import { addresses } from "@/config/addresses";
import { TxButton, TxButtonProps } from "@/components/TxButton";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: "steps",
    text: "Steps",
  },
] as const;

const formSchema = z.object({
  category: z.string(),
  amount: z.coerce.number().min(1, { message: "Please do at least a step :)" }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  value: z.coerce.number(),
});
type formSchema = z.infer<typeof formSchema>;

export default function Page() {
  const { address: account } = useAccount();
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  const { data: allowance = 0n } = useErc20Allowance({
    address: addresses.usdc[420],
    args: [account!, addresses.publicPool[420]],
  });

  const {
    data: approveData,
    write: sendApprove,
    status: approveStatus,
  } = useErc20Approve({
    address: addresses.usdc[420],
  });

  const {
    data: depositData,
    write: sendDeposit,
    status: depositStatus,
  } = usePublicPoolDeposit({
    address: addresses.publicPool[420],
  });

  const depositAmount = BigInt(form.watch("value") || "0") * 10n ** 6n;

  const txProps: TxButtonProps =
    allowance < depositAmount || allowance === 0n
      ? {
          label: "Approve",
          status: approveStatus,
          sendTx: form.handleSubmit(() =>
            sendApprove({ args: [addresses.publicPool[420], depositAmount] })
          ),
          txData: approveData,
        }
      : {
          label: "Deposit",
          status: depositStatus,
          sendTx: form.handleSubmit(({ category, endDate, value }) =>
            sendDeposit({
              args: [
                depositAmount,
                {
                  category,
                  endDate: BigInt(endDate.getTime() / 1000),
                  value: BigInt(value),
                },
              ],
            })
          ),
          txData: depositData,
          onSuccess() {
            router.push("/feed");
          },
        };

  return (
    <div className="max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={txProps.sendTx} className="space-y-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a challenge you want to start" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("category") && (
            <>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps amount</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Amount of steps you want to achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stake</FormLabel>
                    <FormControl>
                      <Input placeholder="10" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much money you want to stake on your goal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {form.watch("endDate")
                        ? `You will have
                      ${differenceInDays(
                        form.watch("endDate"),
                        new Date()
                      )} days
                      to finish.`
                        : "You have to provide a proof of completion before that time."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <TxButton {...txProps} />
        </form>
      </Form>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { User } from "@/lib/types";
import { ethers } from "ethers";

import { createPublicClient, http } from "viem";

const formSchema = z.object({
  user: z.string().min(1, "Please select a user"),
  amount: z
    .string()
    .refine(
      val => !isNaN(Number(val)) && Number(val) >= 0.0001,
      "Amount must be at least 0.0001"
    ),
});

// Define separate types for form input and output
type FormInput = {
  user: string;
  amount: string;
};

type FormOutput = {
  user: string;
  amount: number;
};

export default function SendTxDialog() {
  const { ready, user } = usePrivy();
  const { wallets } = useWallets();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/api/users`;
    const fetchUsers = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
    // logChain();
  }, []);

  const logChain = async () => {
    const client = createPublicClient({
      transport: http(),
    });
    const chainId = await client.getChainId();
    console.log(chainId);
  };

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      amount: "0.0001",
    },
  });

  async function onSubmit(values: FormInput) {
    // console.log("Sending transaction:", {
    //     to: values.user,
    //     amount: Number(values.amount)
    // });
    //use ethers.js to send the transaction
    const mm_provider = new ethers.providers.Web3Provider(window.ethereum);
    const pv_provider = await wallets[0].getEthereumProvider();

    console.log(mm_provider);
    console.log(pv_provider);

    // console.log(window.ethereum);
    // console.log(pv_provider);

    // const signer =
    // const tx = {
    //     to: values.user,
    //     value: ethers.utils.parseEther(values.amount)
    // };
    // signer.sendTransaction(tx)
    //     .then((tx) => {
    //         console.log("Transaction sent:", tx);
    //     })
    //     .catch((error) => {
    //         console.error("Failed to send transaction:", error);
    //     });

    // setOpen(false);
  }

  // Filter out users without wallet addresses and the current user
  const validUsers = users.filter(
    u =>
      u.wallet?.address &&
      u.wallet.address.toLowerCase() !== user?.wallet?.address?.toLowerCase()
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!ready}>{!ready ? "Loading..." : "Send"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Transaction</DialogTitle>
          <DialogDescription>Send crypto to another user</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {validUsers.map(user => (
                        <SelectItem
                          key={user.id}
                          value={user.wallet?.address || ""}
                        >
                          {user.email?.address || user.wallet?.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the user you want to send crypto to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you want to send (minimum 0.0001)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Send Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

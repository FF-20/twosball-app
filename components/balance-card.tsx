"use client"
import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BalanceCard = () => {
    const { ready, user } = usePrivy();
    const [balance, setBalance] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletInitialized, setWalletInitialized] = useState(false);

    const getProvider = () => {
        return new ethers.providers.EtherscanProvider(
            "sepolia",
            process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
        );
    };

    const updateBalance = async () => {
        if (!ready || !user?.wallet?.address) {
            console.log("Skipping balance update - prerequisites not met");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const provider = getProvider();
            const balanceInWei = await provider.getBalance(user.wallet.address);
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            
            setBalance(balanceInEth);
            setWalletInitialized(true);
        } catch (error) {
            console.error("Error fetching balance:", error);
            setError(
                `Failed to fetch balance: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
            setWalletInitialized(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial setup effect
    useEffect(() => {
        updateBalance();
    }, [ready, user?.wallet?.address]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center text-center">
                    <span>Wallet Balance (Sepolia)</span>
                    {!walletInitialized && (
                        <span className="text-xs text-yellow-500 ms-1">
                            Initializing...
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}

                <div className="space-y-4">
                    <div className="text-center">
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 rounded-full animate-pulse bg-gray-400" />
                                <div className="w-4 h-4 rounded-full animate-pulse bg-gray-400" />
                                <div className="w-4 h-4 rounded-full animate-pulse bg-gray-400" />
                            </div>
                        ) : (
                            <p className="text-2xl font-bold">
                                {balance ? `${Number(balance).toFixed(4)} ETH` : "0 ETH"}
                            </p>
                        )}
                    </div>

                    {user?.wallet?.address && (
                        <div className="text-center">
                            <span className="text-xs break-all text-gray-500">
                                {user.wallet.address}
                            </span>
                        </div>
                    )}

                    <Button
                        onClick={updateBalance}
                        disabled={isLoading || !walletInitialized}
                        className="w-full"
                    >
                        {isLoading ? "Refreshing..." : "Refresh Balance"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BalanceCard;
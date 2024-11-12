import BalanceCard from "@/components/balance-card";
import FundWalletBtn from "@/components/fund-wallet-btn";
import SendTxDialog from "@/components/send-tx";

export default function DashboardPage() {
    return (
        <>
            <main className="flex flex-col min-h-screen py-6 sm:py-10 bg-privy-light-blue space-y-2">
                <h1 className="text-3xl text-center font-bold">Welcome Back</h1>
                <div className="flex flex-row space-x-1">
                    <FundWalletBtn />
                    <SendTxDialog />
                </div>
                <BalanceCard />
            </main>
        </>
    );
}

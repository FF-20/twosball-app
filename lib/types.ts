export type Campaign = {
    owner: string; // Ethereum address of the owner (usually in hex string format)
    title: string; // Title of the campaign
    description: string; // Description of the campaign
    target: BigInt; // Target amount in wei (use BigNumber for higher precision if needed)
    deadline: number; // Deadline as a UNIX timestamp (number)
    amountCollected: BigInt; // Total amount collected in wei (use BigNumber for higher precision if needed)
    contributors: string[]; // Array of contributor addresses (hex string format)
    contributions: BigInt[]; // Array of contributions in wei (each contribution amount)
};

export type User = {
    id: string;
    createdAt: string;
    isGuest: boolean;
    email: {
        address: string;
        verifiedAt: string;
        firstVerifiedAt: string;
        latestVerifiedAt: string;
    };
    wallet: {
        address: string;
        verifiedAt: string;
        firstVerifiedAt: string;
        latestVerifiedAt: string;
        chainType: string;
        chainId: string;
        walletClientType: string;
        connectorType: string;
        hdWalletIndex: number;
        imported: boolean;
        delegated: boolean;
    };
};

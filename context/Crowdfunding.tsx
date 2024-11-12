// import React, { createContext, useContext,useState, useEffect } from 'react';
// import Web3Modal from 'web3modal';
// import { ethers, BrowserProvider, JsonRpcProvider, Contract } from 'ethers';
// import { CrowdFundingABI, CrowdFundingAddress } from './constants';
// import { Campaign } from '../lib/types';

// const fetchContract = (signerOrProvider: any) => 
//     new Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

// interface CreateCampaignInput {
//     title: string;
//     description: string;
//     target: string;  // Target amount in ETH as string (will be converted to wei)
//     deadline: Date;  // Deadline as Date object
// }

// interface CrowdFundingContextType {
//     crowdFunding: Contract | null;
//     account: string | null;
//     createCampaign: (campaign: CreateCampaignInput) => Promise<void>;
//     getCampaigns: () => Promise<Campaign[]>;
//     connectWallet: () => Promise<void>;
// }

// export const CrowdFundingContext = createContext<CrowdFundingContextType>({
//     crowdFunding: null,
//     account: null,
//     createCampaign: async () => {},
//     getCampaigns: async () => [],
//     connectWallet: async () => {}
// });

// interface Props {
//     children: React.ReactNode;
// }

// export const CrowdFundingProvider: React.FC<Props> = ({ children }) => {
//     const [crowdFunding, setCrowdFunding] = useState<Contract | null>(null);
//     const [account, setAccount] = useState<string | null>(null);

//     const getProvider = async () => {
//         if (typeof window !== 'undefined' && window.ethereum) {
//             return new BrowserProvider(window.ethereum);
//         }
//         console.error('Install MetaMask');
//         return null;
//     };

//     const createCampaign = async (campaign: CreateCampaignInput) => {
//         const { title, description, target, deadline } = campaign;
        
//         try {
//             const web3Modal = new Web3Modal();
//             const connection = await web3Modal.connect();
//             const provider = new BrowserProvider(connection);
//             const signer = await provider.getSigner();
//             const contract = fetchContract(signer);

//             // Convert target from ETH to wei
//             const targetInWei = ethers.parseEther(target);
            
//             // Convert deadline to UNIX timestamp
//             const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);

//             const tx = await contract.createCampaign(
//                 title,
//                 description,
//                 targetInWei,
//                 deadlineTimestamp
//             );

//             await tx.wait();
//             console.log('Campaign created', tx);
//         } catch (error) {
//             console.error('Error creating campaign:', error);
//             throw error;
//         }
//     };

//     const getCampaigns = async (): Promise<Campaign[]> => {
//         try {
//             const provider = await getProvider();
//             if (!provider) throw new Error("No provider available");

//             const contract = fetchContract(provider);
//             const campaignsData = await contract.getCampaigns();

//             // Transform the raw data into our Campaign type
//             const campaigns: Campaign[] = campaignsData.map((campaign: any) => ({
//                 owner: campaign.owner.toLowerCase(),
//                 title: campaign.title,
//                 description: campaign.description,
//                 target: campaign.target,
//                 deadline: Number(campaign.deadline),
//                 amountCollected: campaign.amountCollected,
//                 contributors: campaign.contributors.map((addr: string) => addr.toLowerCase()),
//                 contributions: campaign.contributions.map((amount: bigint) => amount)
//             }));

//             return campaigns;
//         } catch (error) {
//             console.error('Error fetching campaigns:', error);
//             return [];
//         }
//     };

//     const checkIfWalletConnected = async () => {
//         const provider = await getProvider();
//         if (provider) {
//             const accounts = await provider.listAccounts();
//             if (accounts.length > 0) {
//                 setAccount(accounts[0].address.toLowerCase());
//             } else {
//                 console.log("No account found");
//             }
//         }
//     };

//     const connectWallet = async () => {
//         try {
//             const provider = await getProvider();
//             if (provider && window.ethereum) {
//                 const accounts = await window.ethereum.request({ 
//                     method: 'eth_requestAccounts' 
//                 }) as string[];
                
//                 if (accounts.length > 0) {
//                     setAccount(accounts[0].toLowerCase());
//                 }
//             }
//         } catch (error) {
//             console.error('Error connecting wallet:', error);
//             throw error;
//         }
//     };

//     useEffect(() => {
//         checkIfWalletConnected();
//         const initialize = async () => {
//             const provider = await getProvider();
//             if (provider) {
//                 try {
//                     const signer = await provider.getSigner();
//                     const contract = fetchContract(signer);
//                     setCrowdFunding(contract);
                    
//                     const accounts = await provider.listAccounts();
//                     if (accounts.length > 0) {
//                         setAccount(accounts[0].address.toLowerCase());
//                     }
//                 } catch (error) {
//                     console.error("Failed to initialize:", error);
//                 }
//             }
//         };

//         initialize();
//     }, []);

//     const value: CrowdFundingContextType = {
//         crowdFunding,
//         account,
//         createCampaign,
//         getCampaigns,
//         connectWallet
//     };
    
//     return (
//         <CrowdFundingContext.Provider value={value}>
//             {children}
//         </CrowdFundingContext.Provider>
//     );
// };

// // Export a custom hook for using the context
// export const useCrowdFunding = () => {
//     const context = useContext(CrowdFundingContext);
//     if (context === undefined) {
//         throw new Error('useCrowdFunding must be used within a CrowdFundingProvider');
//     }
//     return context;
// };
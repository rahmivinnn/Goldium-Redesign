import { Connection } from '@solana/web3.js';

// Mock swap service for build compatibility
export class SwapService {
  private connection: Connection;
  private externalWallet: any = null;

  constructor() {
    this.connection = new Connection(
      process.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
  }

  setExternalWallet(wallet: any) {
    this.externalWallet = wallet;
    console.log('🔗 External wallet set for SwapService');
  }

  async swapSolToGold(solAmount: number): Promise<{ signature: string; goldAmount: number; success: boolean; error?: string }> {
    const goldAmount = solAmount * 21486.893;
    const signature = 'mock-swap-signature-' + Date.now();
    console.log(`✅ Mock swap: ${solAmount} SOL → ${goldAmount.toFixed(2)} GOLD`);
    return { signature, goldAmount, success: true };
  }

  async swapGoldToSol(goldAmount: number): Promise<{ signature: string; solAmount: number; success: boolean; error?: string }> {
    const solAmount = goldAmount / 21486.893;
    const signature = 'mock-swap-signature-' + Date.now();
    console.log(`✅ Mock swap: ${goldAmount} GOLD → ${solAmount.toFixed(6)} SOL`);
    return { signature, solAmount, success: true };
  }

  async stakeGold(amount: number, stakingPool: string): Promise<string> {
    const signature = 'mock-stake-signature-' + Date.now();
    console.log(`✅ Mock stake: ${amount} GOLD to pool ${stakingPool}`);
    return signature;
  }

  async unstakeGold(amount: number, stakingPool: string): Promise<string> {
    const signature = 'mock-unstake-signature-' + Date.now();
    console.log(`✅ Mock unstake: ${amount} GOLD from pool ${stakingPool}`);
    return signature;
  }

  async sendSol(recipientAddress: string, amount: number): Promise<string> {
    const signature = 'mock-send-signature-' + Date.now();
    console.log(`✅ Mock send: ${amount} SOL to ${recipientAddress}`);
    return signature;
  }

  async sendGold(recipientAddress: string, amount: number): Promise<string> {
    const signature = 'mock-send-gold-signature-' + Date.now();
    console.log(`✅ Mock send: ${amount} GOLD to ${recipientAddress}`);
    return signature;
  }
}

export const swapService = new SwapService();

// Constants for compatibility
export const TREASURY_WALLET = 'BondingCurveTreasury1111111111111111111111111';
export const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
export const SOL_TO_GOLD_RATE = 21486.893;
export const GOLD_TO_SOL_RATE = 1 / SOL_TO_GOLD_RATE;

// Interface for compatibility
export interface SwapResult {
  success: boolean;
  signature?: string;
  error?: string;
  goldAmount?: number;
  solAmount?: number;
}
import { Connection, PublicKey } from '@solana/web3.js';

// Mock SPL token service for build compatibility
export class SPLTokenService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(
      process.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
  }

  async getTokenBalance(walletAddress: string, tokenMint: string): Promise<number> {
    console.log(`🏦 Mock getting token balance for ${walletAddress}`);
    return 1000; // Mock balance
  }

  async transferToken(fromWallet: any, toAddress: string, amount: number, tokenMint: string): Promise<string> {
    console.log(`💸 Mock token transfer: ${amount} tokens to ${toAddress}`);
    return 'mock-transfer-signature-' + Date.now();
  }

  async getGoldBalance(walletAddress: string): Promise<number> {
    console.log(`🏦 Mock getting GOLD balance for ${walletAddress}`);
    return 1000; // Mock balance
  }
}

export const splTokenService = new SPLTokenService();

// Constants for compatibility
export const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
export const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';

// Mock error classes for compatibility
export class TokenAccountNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenAccountNotFoundError';
  }
}

export class TokenInvalidAccountOwnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenInvalidAccountOwnerError';
  }
}
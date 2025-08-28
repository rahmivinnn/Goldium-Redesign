// Goldium Contract Tracker
// Tracks all transactions on the Goldium contract address

export interface GoldiumTransaction {
  type: 'swap' | 'send' | 'stake' | 'unstake' | 'buy_gold' | 'sell_gold';
  txSignature: string;
  timestamp: number;
  walletAddress: string;
  amount: number;
  tokenFrom: string;
  tokenTo: string;
  solscanUrl: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockTime?: number;
  slot?: number;
  fee?: number;
}

export interface ContractConfig {
  GOLDIUM_CONTRACT_ADDRESS: string;
  GOLD_TOKEN_MINT: string;
  SOLSCAN_BASE_URL: string;
  RPC_ENDPOINT: string;
}

// Goldium Contract Configuration
export const GOLDIUM_CONFIG: ContractConfig = {
  GOLDIUM_CONTRACT_ADDRESS: 'GOLDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with actual CA
  GOLD_TOKEN_MINT: 'GOLDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with actual GOLD token mint
  SOLSCAN_BASE_URL: 'https://solscan.io',
  RPC_ENDPOINT: 'https://solana.publicnode.com'
};

export class GoldiumContractTracker {
  private static instance: GoldiumContractTracker;
  private transactions: GoldiumTransaction[] = [];
  private listeners: ((tx: GoldiumTransaction) => void)[] = [];

  private constructor() {
    this.initializeTracking();
  }

  public static getInstance(): GoldiumContractTracker {
    if (!GoldiumContractTracker.instance) {
      GoldiumContractTracker.instance = new GoldiumContractTracker();
    }
    return GoldiumContractTracker.instance;
  }

  // Initialize contract tracking
  private async initializeTracking() {
    console.log('🔍 Initializing Goldium Contract Tracker...');
    console.log('📋 Contract Address:', GOLDIUM_CONFIG.GOLDIUM_CONTRACT_ADDRESS);
    console.log('🪙 GOLD Token Mint:', GOLDIUM_CONFIG.GOLD_TOKEN_MINT);
    
    // Start monitoring contract transactions
    this.startContractMonitoring();
  }

  // Start monitoring contract transactions
  private async startContractMonitoring() {
    try {
      console.log('🔄 Starting contract transaction monitoring...');
      
      // Monitor new transactions every 10 seconds
      setInterval(async () => {
        await this.fetchLatestTransactions();
      }, 10000);

      // Initial fetch
      await this.fetchLatestTransactions();
      
    } catch (error) {
      console.error('❌ Failed to start contract monitoring:', error);
    }
  }

  // Fetch latest transactions from the contract
  private async fetchLatestTransactions() {
    try {
      const response = await fetch(GOLDIUM_CONFIG.RPC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getSignaturesForAddress',
          params: [
            GOLDIUM_CONFIG.GOLDIUM_CONTRACT_ADDRESS,
            {
              limit: 20,
              commitment: 'confirmed'
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.result && data.result.value) {
        for (const signature of data.result.value) {
          await this.processTransaction(signature.signature);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch latest transactions:', error);
    }
  }

  // Process individual transaction
  private async processTransaction(signature: string) {
    try {
      // Check if transaction already processed
      if (this.transactions.find(tx => tx.txSignature === signature)) {
        return;
      }

      console.log('🔍 Processing transaction:', signature);

      // Get transaction details
      const txDetails = await this.getTransactionDetails(signature);
      
      if (txDetails) {
        // Parse transaction to determine type
        const parsedTx = this.parseTransaction(txDetails, signature);
        
        if (parsedTx) {
          // Add to transactions list
          this.transactions.unshift(parsedTx);
          
          // Notify listeners
          this.notifyListeners(parsedTx);
          
          console.log('✅ Transaction processed:', parsedTx);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process transaction:', signature, error);
    }
  }

  // Get transaction details from RPC
  private async getTransactionDetails(signature: string) {
    try {
      const response = await fetch(GOLDIUM_CONFIG.RPC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getTransaction',
          params: [
            signature,
            {
              encoding: 'jsonParsed',
              commitment: 'confirmed',
              maxSupportedTransactionVersion: 0
            }
          ]
        })
      });

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('❌ Failed to get transaction details:', error);
      return null;
    }
  }

  // Parse transaction to determine type and extract data
  private parseTransaction(txDetails: any, signature: string): GoldiumTransaction | null {
    try {
      const timestamp = txDetails.blockTime * 1000; // Convert to milliseconds
      const fee = txDetails.meta?.fee || 0;
      const slot = txDetails.slot;

      // Extract account keys
      const accountKeys = txDetails.transaction.message.accountKeys;
      
      // Look for GOLD token transfers
      const postTokenBalances = txDetails.meta?.postTokenBalances || [];
      const preTokenBalances = txDetails.meta?.preTokenBalances || [];
      
      // Check for GOLD token mint in balances
      const hasGoldToken = postTokenBalances.some((balance: any) => 
        balance.mint === GOLDIUM_CONFIG.GOLD_TOKEN_MINT
      ) || preTokenBalances.some((balance: any) => 
        balance.mint === GOLDIUM_CONFIG.GOLD_TOKEN_MINT
      );

      // Check for SOL transfers
      const hasSolTransfer = txDetails.meta?.preBalances && txDetails.meta?.postBalances;

      // Determine transaction type based on instructions and token transfers
      let txType: GoldiumTransaction['type'] | null = null;
      let amount = 0;
      let tokenFrom = '';
      let tokenTo = '';

      // Parse instructions to determine transaction type
      const instructions = txDetails.transaction.message.instructions || [];
      
      for (const instruction of instructions) {
        const programId = instruction.programId;
        const data = instruction.data;
        
        // Check if this is a swap instruction
        if (this.isSwapInstruction(instruction)) {
          txType = 'swap';
          amount = this.extractSwapAmount(instruction);
          tokenFrom = 'SOL';
          tokenTo = 'GOLD';
          break;
        }
        
        // Check if this is a stake instruction
        if (this.isStakeInstruction(instruction)) {
          txType = 'stake';
          amount = this.extractStakeAmount(instruction);
          tokenFrom = 'GOLD';
          tokenTo = 'GOLD';
          break;
        }
        
        // Check if this is a send instruction
        if (this.isSendInstruction(instruction)) {
          txType = 'send';
          amount = this.extractSendAmount(instruction);
          tokenFrom = hasGoldToken ? 'GOLD' : 'SOL';
          tokenTo = hasGoldToken ? 'GOLD' : 'SOL';
          break;
        }
        
        // Check if this is a buy GOLD instruction
        if (this.isBuyGoldInstruction(instruction)) {
          txType = 'buy_gold';
          amount = this.extractBuyAmount(instruction);
          tokenFrom = 'SOL';
          tokenTo = 'GOLD';
          break;
        }
      }

      // If we couldn't determine type from instructions, use heuristics
      if (!txType) {
        if (hasGoldToken && hasSolTransfer) {
          txType = 'swap';
          tokenFrom = 'SOL';
          tokenTo = 'GOLD';
        } else if (hasGoldToken) {
          txType = 'send';
          tokenFrom = 'GOLD';
          tokenTo = 'GOLD';
        } else if (hasSolTransfer) {
          txType = 'send';
          tokenFrom = 'SOL';
          tokenTo = 'SOL';
        }
      }

      if (txType) {
        return {
          type: txType,
          txSignature: signature,
          timestamp,
          walletAddress: accountKeys[0] || 'unknown',
          amount,
          tokenFrom,
          tokenTo,
          solscanUrl: `${GOLDIUM_CONFIG.SOLSCAN_BASE_URL}/tx/${signature}`,
          status: 'confirmed',
          blockTime: txDetails.blockTime,
          slot,
          fee
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to parse transaction:', error);
      return null;
    }
  }

  // Check if instruction is a swap instruction
  private isSwapInstruction(instruction: any): boolean {
    // Check for swap program ID and specific instruction data
    return instruction.programId === GOLDIUM_CONFIG.GOLDIUM_CONTRACT_ADDRESS &&
           instruction.data && instruction.data.length > 0;
  }

  // Check if instruction is a stake instruction
  private isStakeInstruction(instruction: any): boolean {
    // Check for staking program ID and specific instruction data
    return instruction.programId === GOLDIUM_CONFIG.GOLDIUM_CONTRACT_ADDRESS &&
           instruction.data && instruction.data.length > 0;
  }

  // Check if instruction is a send instruction
  private isSendInstruction(instruction: any): boolean {
    // Check for transfer program ID
    return instruction.programId === '11111111111111111111111111111111' || // System Program
           instruction.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'; // Token Program
  }

  // Check if instruction is a buy GOLD instruction
  private isBuyGoldInstruction(instruction: any): boolean {
    // Check for buy GOLD specific instruction
    return instruction.programId === GOLDIUM_CONFIG.GOLDIUM_CONTRACT_ADDRESS &&
           instruction.data && instruction.data.length > 0;
  }

  // Extract amount from swap instruction
  private extractSwapAmount(instruction: any): number {
    // Parse instruction data to extract amount
    // This would depend on the specific instruction format
    return 0; // Placeholder
  }

  // Extract amount from stake instruction
  private extractStakeAmount(instruction: any): number {
    // Parse instruction data to extract amount
    return 0; // Placeholder
  }

  // Extract amount from send instruction
  private extractSendAmount(instruction: any): number {
    // Parse instruction data to extract amount
    return 0; // Placeholder
  }

  // Extract amount from buy instruction
  private extractBuyAmount(instruction: any): number {
    // Parse instruction data to extract amount
    return 0; // Placeholder
  }

  // Add transaction listener
  public addListener(callback: (tx: GoldiumTransaction) => void) {
    this.listeners.push(callback);
  }

  // Remove transaction listener
  public removeListener(callback: (tx: GoldiumTransaction) => void) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notify all listeners
  private notifyListeners(transaction: GoldiumTransaction) {
    this.listeners.forEach(listener => {
      try {
        listener(transaction);
      } catch (error) {
        console.error('❌ Listener error:', error);
      }
    });
  }

  // Get all transactions
  public getTransactions(): GoldiumTransaction[] {
    return [...this.transactions];
  }

  // Get transactions by type
  public getTransactionsByType(type: GoldiumTransaction['type']): GoldiumTransaction[] {
    return this.transactions.filter(tx => tx.type === type);
  }

  // Get transactions by wallet address
  public getTransactionsByWallet(walletAddress: string): GoldiumTransaction[] {
    return this.transactions.filter(tx => tx.walletAddress === walletAddress);
  }

  // Get recent transactions (last N transactions)
  public getRecentTransactions(limit: number = 10): GoldiumTransaction[] {
    return this.transactions.slice(0, limit);
  }

  // Search transactions
  public searchTransactions(query: string): GoldiumTransaction[] {
    const lowerQuery = query.toLowerCase();
    return this.transactions.filter(tx => 
      tx.txSignature.toLowerCase().includes(lowerQuery) ||
      tx.walletAddress.toLowerCase().includes(lowerQuery) ||
      tx.type.toLowerCase().includes(lowerQuery)
    );
  }

  // Get transaction statistics
  public getTransactionStats() {
    const stats = {
      total: this.transactions.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalVolume: 0
    };

    this.transactions.forEach(tx => {
      // Count by type
      stats.byType[tx.type] = (stats.byType[tx.type] || 0) + 1;
      
      // Count by status
      stats.byStatus[tx.status] = (stats.byStatus[tx.status] || 0) + 1;
      
      // Calculate total volume
      stats.totalVolume += tx.amount;
    });

    return stats;
  }

  // Export transactions to JSON
  public exportTransactions(): string {
    return JSON.stringify(this.transactions, null, 2);
  }

  // Import transactions from JSON
  public importTransactions(jsonData: string) {
    try {
      const transactions = JSON.parse(jsonData);
      this.transactions = transactions;
      console.log('✅ Transactions imported successfully');
    } catch (error) {
      console.error('❌ Failed to import transactions:', error);
    }
  }

  // Clear all transactions
  public clearTransactions() {
    this.transactions = [];
    console.log('🗑️ All transactions cleared');
  }
}

// Export singleton instance
export const goldiumTracker = GoldiumContractTracker.getInstance(); 
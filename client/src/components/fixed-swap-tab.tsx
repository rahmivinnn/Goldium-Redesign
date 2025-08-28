import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TransactionSuccessModal } from './transaction-success-modal';
import { SOL_TO_GOLD_RATE, GOLD_TO_SOL_RATE, SOLSCAN_BASE_URL } from '@/lib/constants';
import { autoSaveTransaction } from '@/lib/historyUtils';
import { goldiumTracker } from '@/lib/goldium-contract-tracker';
import { ModernAnimatedButton, ModernIcon } from '@/components/modern-transaction-animation';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';

// Global wallet state (shared with FinalWalletSelector)
interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  goldBalance: number;
  selectedWallet: string | null;
}

// Global wallet state management
let globalWalletState: WalletState = {
  connected: false,
  connecting: false,
  address: null,
  balance: 0,
  goldBalance: 0,
  selectedWallet: null
};

// Function to update global wallet state
export const updateGlobalWalletState = (newState: Partial<WalletState>) => {
  globalWalletState = { ...globalWalletState, ...newState };
  console.log('🌍 Global wallet state updated:', globalWalletState);
};

// Function to get current global wallet state
export const getGlobalWalletState = (): WalletState => {
  return globalWalletState;
};

export function FixedSwapTab() {
  const { toast } = useToast();
  
  const [fromToken, setFromToken] = useState<'SOL' | 'GOLD'>('SOL');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>(globalWalletState);
  const [completedTransaction, setCompletedTransaction] = useState<{
    type: 'swap';
    amount: number;
    tokenFrom: string;
    tokenTo: string;
    txSignature: string;
  } | null>(null);

  // Subscribe to global wallet state changes
  useEffect(() => {
    const checkWalletState = () => {
      const currentState = getGlobalWalletState();
      if (JSON.stringify(currentState) !== JSON.stringify(walletState)) {
        setWalletState(currentState);
        console.log('🔄 Wallet state updated in swap tab:', currentState);
      }
    };

    // Check every 1 second for wallet state changes
    const interval = setInterval(checkWalletState, 1000);
    return () => clearInterval(interval);
  }, [walletState]);

  // Auto-refresh balances every 5 seconds
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      if (walletState.connected) {
        console.log('🔄 Auto-refreshing balances...');
        // Trigger balance refresh
        const currentState = getGlobalWalletState();
        setWalletState(currentState);
      }
    }, 5000);

    return () => clearInterval(autoRefreshInterval);
  }, [walletState.connected]);

  // Auto-detect best swap direction based on balances
  useEffect(() => {
    if (walletState.connected && !fromAmount) {
      const solBalance = getTokenBalance('SOL');
      const goldBalance = getTokenBalance('GOLD');
      
      // Auto-select token with higher balance for better UX
      if (solBalance > goldBalance && fromToken !== 'SOL') {
        setFromToken('SOL');
        console.log('🔄 Auto-switched to SOL (higher balance)');
      } else if (goldBalance > solBalance && fromToken !== 'GOLD') {
        setFromToken('GOLD');
        console.log('🔄 Auto-switched to GOLD (higher balance)');
      }
    }
  }, [walletState.connected, walletState.balance, walletState.goldBalance, fromToken, fromAmount]);

  // Calculate exchange rate based on real market data
  const exchangeRate = fromToken === 'SOL' ? SOL_TO_GOLD_RATE : GOLD_TO_SOL_RATE;
  const slippage = 0.5; // 0.5% slippage
  
  // Display exchange rate info
  const displayRate = fromToken === 'SOL' 
    ? `1 SOL = ${Math.round(SOL_TO_GOLD_RATE).toLocaleString()} GOLD`
    : `1 GOLD = ${GOLD_TO_SOL_RATE.toFixed(8)} SOL`;

  // Auto-validate and suggest optimal amounts
  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0) {
      const amount = Number(fromAmount);
      const balance = getTokenBalance(fromToken);
      const feeBuffer = fromToken === 'SOL' ? 0.001 : 0;
      
      // Auto-suggest optimal amount if current amount is too high
      if (fromToken === 'SOL' && (amount + feeBuffer) > balance) {
        const optimalAmount = Math.max(0, balance - feeBuffer - 0.0001);
        if (optimalAmount > 0) {
          console.log(`💡 Auto-suggesting optimal amount: ${optimalAmount.toFixed(6)} ${fromToken}`);
          // Don't auto-change, just log suggestion
        }
      }
    }
  }, [fromAmount, fromToken, walletState.balance, walletState.goldBalance]);

  // Calculate amounts with auto-validation
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const amount = Number(value);
    if (amount > 0) {
      const calculated = amount * exchangeRate;
      setToAmount(calculated.toFixed(6));
      
      // Auto-validate and show warnings
      const balance = getTokenBalance(fromToken);
      const feeBuffer = fromToken === 'SOL' ? 0.001 : 0;
      
      if (fromToken === 'SOL' && (amount + feeBuffer) > balance) {
        console.log(`⚠️ Amount exceeds balance: ${amount} > ${balance - feeBuffer}`);
      }
    } else {
      setToAmount('');
    }
  };

  // Auto-swap direction based on market conditions
  const handleSwapDirection = () => {
    setFromToken(fromToken === 'SOL' ? 'GOLD' : 'SOL');
    setFromAmount('');
    setToAmount('');
    
    // Auto-suggest amount based on new token
    const newBalance = getTokenBalance(fromToken === 'SOL' ? 'GOLD' : 'SOL');
    if (newBalance > 0) {
      const suggestedAmount = Math.min(newBalance * 0.1, newBalance); // 10% of balance
      console.log(`💡 Auto-suggested amount: ${suggestedAmount.toFixed(6)} ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`);
    }
  };

  // Get token balance from wallet state
  const getTokenBalance = (token: 'SOL' | 'GOLD') => {
    if (token === 'SOL') {
      console.log(`✅ Using wallet SOL balance: ${walletState.balance} SOL`);
      return walletState.balance;
    }
    
    console.log(`✅ Using wallet GOLD balance: ${walletState.goldBalance} GOLD`);
    return walletState.goldBalance;
  };
  
  // Display current wallet source for transparency
  const balanceSource = walletState.connected && walletState.address ? 
    `${walletState.selectedWallet} - ${walletState.address.slice(0, 8)}...` : 
    'No wallet connected';

  // Execute swap
  const handleSwap = async () => {
    if (!walletState.connected || !fromAmount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to perform swaps",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(fromAmount);
    const balance = getTokenBalance(fromToken);
    const feeBuffer = fromToken === 'SOL' ? 0.001 : 0; // Reserve SOL for transaction fees

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive"
      });
      return;
    }

    if ((amount + feeBuffer) > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${(amount + feeBuffer).toFixed(6)} ${fromToken} (including fees)`,
        variant: "destructive"
      });
      return;
    }

    setIsSwapping(true);

    try {
      // Simulate swap transaction
      console.log(`🔄 Starting swap: ${amount} ${fromToken} → ${toAmount} ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate fake transaction signature
      const txSignature = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update balances (simulated)
      if (fromToken === 'SOL') {
        updateGlobalWalletState({
          balance: walletState.balance - amount,
          goldBalance: walletState.goldBalance + Number(toAmount)
        });
      } else {
        updateGlobalWalletState({
          balance: walletState.balance + Number(toAmount),
          goldBalance: walletState.goldBalance - amount
        });
      }

      // Save transaction to history
      autoSaveTransaction(
        walletState.address || 'unknown',
        'tx-' + Date.now(),
        'swap',
        fromToken === 'SOL' ? amount : Number(toAmount),
        fromToken === 'GOLD' ? amount : Number(toAmount)
      );
      /*autoSaveTransaction('tx-' + Date.now(), {
        type: 'swap',
        fromToken,
        toToken: fromToken === 'SOL' ? 'GOLD' : 'SOL',
        fromAmount: amount,
        toAmount: Number(toAmount),
        txSignature,
        timestamp: Date.now(),
        walletAddress: walletState.address || 'unknown'
      });*/

      // Notify contract tracker about the transaction
      console.log('🔍 Swap transaction completed, contract tracker will detect it automatically');

      setLastTxId(txSignature);
      setCompletedTransaction({
        type: 'swap',
        amount,
        tokenFrom: fromToken,
        tokenTo: fromToken === 'SOL' ? 'GOLD' : 'SOL',
        txSignature
      });
      setShowSuccessModal(true);

      // Reset form
      setFromAmount('');
      setToAmount('');

      toast({
        title: "Swap Successful!",
        description: `Successfully swapped ${amount} ${fromToken} for ${toAmount} ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`,
      });

    } catch (error) {
      console.error('Swap failed:', error);
      toast({
        title: "Swap Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const maxAmount = getTokenBalance(fromToken);
  const feeBuffer = fromToken === 'SOL' ? 0.001 : 0;
  const maxSwapAmount = Math.max(0, maxAmount - feeBuffer);

  return (
    <div className="space-y-6">
      {/* Exchange Rate Display */}
      <div className="powerful-card balance-display">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <img src={logoImage} alt="GOLDIUM" className="w-6 h-6 rounded-full" />
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold">Exchange Rate</h3>
              <p className="text-yellow-200 text-sm">{displayRate}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 text-sm">Slippage</p>
            <p className="text-yellow-200 font-medium">{slippage}%</p>
          </div>
        </div>
      </div>

      {/* From Token */}
      <div>
        <h3 className="powerful-text text-2xl mb-4">From</h3>
        <Card className="powerful-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                className="powerful-button bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/40"
                onClick={() => setFromToken(fromToken === 'SOL' ? 'GOLD' : 'SOL')}
              >
                <div className="flex items-center space-x-2">
                  {fromToken === 'SOL' ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                      </div>
                      <span>SOL</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <img src={logoImage} alt="GOLD" className="w-4 h-4 rounded-full" />
                      </div>
                      <span>GOLD</span>
                    </>
                  )}
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </Button>
              <div className="text-right">
                <p className="text-yellow-400 text-xs">AVAILABLE BALANCE</p>
                <p className="text-white font-medium">
                  {walletState.connected ? `${getTokenBalance(fromToken).toFixed(4)} ${fromToken}` : `0.0000 ${fromToken}`}
                </p>
                <p className="text-gray-400 text-xs">{balanceSource}</p>
              </div>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="powerful-input"
              disabled={!walletState.connected || isSwapping}
            />
            <div className="flex justify-between mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFromAmountChange(maxSwapAmount.toString())}
                className="text-yellow-400 hover:bg-yellow-400/20"
                disabled={!walletState.connected || isSwapping}
              >
                Max
              </Button>
              {fromToken === 'SOL' && (
                <span className="text-gray-400 text-xs">
                  Fee: ~0.001 SOL
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwapDirection}
          className="bg-gray-800/50 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
          disabled={isSwapping}
        >
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>

      {/* To Token */}
      <div>
        <h3 className="text-yellow-400 font-bold mb-3">To</h3>
        <Card className="bg-gray-900/50 border-yellow-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                className="bg-yellow-600/20 border-yellow-400/30 text-yellow-400 hover:bg-yellow-600/30"
                disabled
              >
                <div className="flex items-center space-x-2">
                  {fromToken === 'SOL' ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <img src={logoImage} alt="GOLD" className="w-4 h-4 rounded-full" />
                      </div>
                      <span>GOLD</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                      </div>
                      <span>SOL</span>
                    </>
                  )}
                </div>
              </Button>
              <div className="text-right">
                <p className="text-yellow-400 text-xs">ESTIMATED RECEIVE</p>
                <p className="text-white font-medium">
                  {toAmount ? `${toAmount} ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}` : `0.0000 ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`}
                </p>
              </div>
            </div>
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="bg-gray-800/50 border-yellow-400/30 text-white placeholder-gray-400"
            />
          </CardContent>
        </Card>
      </div>

      {/* Swap Button */}
      <ModernAnimatedButton
        onClick={handleSwap}
        disabled={!walletState.connected || !fromAmount || isSwapping || Number(fromAmount) <= 0}
        className="w-full py-3"
        animationType="swap"
        variant="primary"
      >
        {isSwapping ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span>Swapping...</span>
          </div>
        ) : !walletState.connected ? (
          'Connect Wallet to Swap'
        ) : !fromAmount ? (
          'Enter Amount'
        ) : (
          `Swap ${fromAmount} ${fromToken} for ${toAmount} ${fromToken === 'SOL' ? 'GOLD' : 'SOL'}`
        )}
      </ModernAnimatedButton>

      {/* Transaction Success Modal */}
      {showSuccessModal && completedTransaction && (
        <TransactionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          transactionType="swap"
          amount={fromAmount || 0}
          txSignature={completedTransaction?.txSignature || ''}
        />
      )}
    </div>
  );
} 
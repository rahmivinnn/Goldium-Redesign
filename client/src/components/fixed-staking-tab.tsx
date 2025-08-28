import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { STAKING_APY, SOLSCAN_BASE_URL } from '@/lib/constants';
import { autoSaveTransaction } from '@/lib/historyUtils';

// Import global state functions
import { getGlobalWalletState } from './fixed-swap-tab';

// Global wallet state interface
interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  goldBalance: number;
  selectedWallet: string | null;
}

export function FixedStakingTab() {
  const { toast } = useToast();
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<WalletState>(getGlobalWalletState());

  // Subscribe to global wallet state changes
  useEffect(() => {
    const checkWalletState = () => {
      const currentState = getGlobalWalletState();
      if (JSON.stringify(currentState) !== JSON.stringify(walletState)) {
        setWalletState(currentState);
        console.log('🔄 Wallet state updated in staking tab:', currentState);
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
        console.log('🔄 Auto-refreshing balances in staking tab...');
        const currentState = getGlobalWalletState();
        setWalletState(currentState);
      }
    }, 5000);

    return () => clearInterval(autoRefreshInterval);
  }, [walletState.connected]);

  // Get token balance from wallet state
  const getTokenBalance = (token: 'SOL' | 'GOLD') => {
    if (token === 'SOL') {
      console.log(`✅ Using wallet SOL balance in staking: ${walletState.balance} SOL`);
      return walletState.balance;
    }
    
    console.log(`✅ Using wallet GOLD balance in staking: ${walletState.goldBalance} GOLD`);
    return walletState.goldBalance;
  };

  // Display current wallet source for transparency
  const balanceSource = walletState.connected && walletState.address ? 
    `${walletState.selectedWallet} - ${walletState.address.slice(0, 8)}...` : 
    'No wallet connected';

  // Stake GOLD tokens
  const handleStake = async () => {
    if (!walletState.connected || !stakeAmount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to stake tokens",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(stakeAmount);
    const goldBalance = getTokenBalance('GOLD');
    
    if (amount <= 0 || amount > goldBalance) {
      toast({
        title: "Invalid Amount", 
        description: goldBalance === 0 ? 
          "You need GOLD tokens to stake. Get some from the Swap tab first." :
          `Please enter a valid amount (max: ${goldBalance.toFixed(4)} GOLD)`,
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`🔄 Executing stake: ${amount} GOLD tokens`);
      
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate fake transaction signature
      const txSignature = `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setLastTxId(txSignature);

      // Auto-save stake transaction to history
      try {
        if (walletState.address) {
          await autoSaveTransaction({
            type: 'stake',
            fromToken: 'GOLD',
            toToken: 'GOLD',
            fromAmount: amount,
            toAmount: amount,
            txSignature,
            timestamp: Date.now(),
            walletAddress: walletState.address
          });
        }
      } catch (error) {
        console.error('Failed to auto-save stake transaction:', error);
      }

      setStakeAmount('');

      toast({
        title: "Staking Successful! 🔒",
        description: (
          <div className="space-y-2">
            <p>Your GOLD tokens have been staked!</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txSignature}`, '_blank')}
              >
                View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ),
      });

    } catch (error) {
      console.error('Staking failed:', error);
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  // Unstake GOLD tokens
  const handleUnstake = async () => {
    if (!walletState.connected || !unstakeAmount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to unstake tokens",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(unstakeAmount);
    const stakedBalance = 1000; // Simulated staked balance
    
    if (amount <= 0 || amount > stakedBalance) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount (max: ${stakedBalance.toFixed(4)} GOLD)`,
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`🔄 Executing unstake: ${amount} GOLD tokens`);
      
      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate fake transaction signature
      const txSignature = `unstake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setLastTxId(txSignature);

      // Auto-save unstake transaction to history
      try {
        if (walletState.address) {
          await autoSaveTransaction({
            type: 'unstake',
            fromToken: 'GOLD',
            toToken: 'GOLD',
            fromAmount: amount,
            toAmount: amount,
            txSignature,
            timestamp: Date.now(),
            walletAddress: walletState.address
          });
        }
      } catch (error) {
        console.error('Failed to auto-save unstake transaction:', error);
      }

      setUnstakeAmount('');

      toast({
        title: "Unstaking Successful! 🔓",
        description: (
          <div className="space-y-2">
            <p>Your GOLD tokens have been unstaked!</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txSignature}`, '_blank')}
              >
                View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ),
      });

    } catch (error) {
      console.error('Unstaking failed:', error);
      toast({
        title: "Unstaking Failed",
        description: "Failed to unstake tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const goldBalance = getTokenBalance('GOLD');
  const stakedBalance = 1000; // Simulated staked balance

  return (
    <div className="space-y-6">
      {/* Staking APY Display */}
      <div className="powerful-card balance-display">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">%</span>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold">Staking APY</h3>
              <p className="text-yellow-200 text-sm">{STAKING_APY}% Annual Yield</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 text-sm">Wallet</p>
            <p className="text-yellow-200 text-xs">{balanceSource}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake GOLD */}
        <Card className="powerful-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-xs">🔒</span>
              </div>
              <h3 className="text-yellow-400 font-bold">Stake GOLD</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-yellow-200 text-sm mb-2 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-gray-800/50 border-yellow-400/30 text-white placeholder-gray-400"
                  disabled={!walletState.connected || isStaking}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Available:</span>
                <span className="text-yellow-200 font-medium">
                  {walletState.connected ? `${goldBalance.toFixed(4)} GOLD` : '0.0000 GOLD'}
                </span>
              </div>
              
              <Button
                onClick={handleStake}
                disabled={!walletState.connected || !stakeAmount || isStaking || Number(stakeAmount) <= 0}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStaking ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Staking...</span>
                  </div>
                ) : !walletState.connected ? (
                  'Connect Wallet to Stake'
                ) : !stakeAmount ? (
                  'Enter Amount'
                ) : (
                  `Stake ${stakeAmount} GOLD`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Unstake GOLD */}
        <Card className="powerful-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <span className="text-black font-bold text-xs">🔓</span>
              </div>
              <h3 className="text-yellow-400 font-bold">Unstake GOLD</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-yellow-200 text-sm mb-2 block">Amount to Unstake</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="bg-gray-800/50 border-yellow-400/30 text-white placeholder-gray-400"
                  disabled={!walletState.connected || isStaking}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Staked:</span>
                <span className="text-yellow-200 font-medium">
                  {walletState.connected ? `${stakedBalance.toFixed(4)} GOLD` : '0.0000 GOLD'}
                </span>
              </div>
              
              <Button
                onClick={handleUnstake}
                disabled={!walletState.connected || !unstakeAmount || isStaking || Number(unstakeAmount) <= 0}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStaking ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Unstaking...</span>
                  </div>
                ) : !walletState.connected ? (
                  'Connect Wallet to Unstake'
                ) : !unstakeAmount ? (
                  'Enter Amount'
                ) : (
                  `Unstake ${unstakeAmount} GOLD`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
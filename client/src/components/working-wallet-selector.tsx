import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  goldBalance: number;
  selectedWallet: string | null;
}

const walletOptions = [
  { type: 'phantom', name: 'Phantom', icon: '🟣' },
  { type: 'solflare', name: 'Solflare', icon: '🔥' },
  { type: 'backpack', name: 'Backpack', icon: '🎒' },
  { type: 'trust', name: 'Trust Wallet', icon: '🔷' }
];

export function WorkingWalletSelector() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    connecting: false,
    address: null,
    balance: 0,
    goldBalance: 0,
    selectedWallet: null
  });

  // Check available wallets
  const getAvailableWallets = (): string[] => {
    const available: string[] = [];
    
    if (typeof window !== 'undefined') {
      // Check for Phantom
      if ((window as any).solana?.isPhantom) {
        available.push('phantom');
      }
      
      // Check for Solflare
      if ((window as any).solflare?.isSolflare || (window as any).solflare) {
        available.push('solflare');
      }
      
      // Check for Backpack
      if ((window as any).backpack?.isBackpack || (window as any).backpack) {
        available.push('backpack');
      }
      
      // Check for Trust Wallet
      if ((window as any).isTrust || 
          (window as any).trustwallet || 
          (window as any).trust ||
          (window as any).trustWallet ||
          (window as any).isTrustWallet ||
          ((window as any).solana && (window as any).solana.isTrust) ||
          ((window as any).ethereum && (window as any).ethereum.isTrust)) {
        available.push('trust');
      }
    }
    
    return available;
  };

  // Fetch SOL balance
  const fetchSolBalance = async (address: string): Promise<number> => {
    try {
      const response = await fetch('https://solana.publicnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getBalance',
          params: [address]
        })
      });
      
      const data = await response.json();
      if (data.result && typeof data.result.value === 'number') {
        return data.result.value / 1000000000; // Convert lamports to SOL
      }
    } catch (error) {
      console.log('SOL balance fetch failed:', error);
    }
    return 0;
  };

  // Fetch GOLD token balance (simulated for demo)
  const fetchGoldBalance = async (address: string): Promise<number> => {
    try {
      // For demo purposes, we'll simulate GOLD balance
      // In real implementation, this would fetch from token account
      const response = await fetch('https://solana.publicnode.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getBalance',
          params: [address]
        })
      });
      
      const data = await response.json();
      if (data.result && typeof data.result.value === 'number') {
        // Simulate GOLD balance based on SOL balance for demo
        const solBalance = data.result.value / 1000000000;
        return solBalance * 1000; // Simulate 1000 GOLD per SOL
      }
    } catch (error) {
      console.log('GOLD balance fetch failed:', error);
    }
    return 0;
  };

  // Refresh balances
  const refreshBalances = async () => {
    if (!walletState.connected || !walletState.address) return;
    
    try {
      const [solBalance, goldBalance] = await Promise.all([
        fetchSolBalance(walletState.address),
        fetchGoldBalance(walletState.address)
      ]);
      
      setWalletState(prev => ({
        ...prev,
        balance: solBalance,
        goldBalance: goldBalance
      }));
      
      console.log(`💰 Balances updated - SOL: ${solBalance}, GOLD: ${goldBalance}`);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  // Connect to wallet
  const connectWallet = async (walletType: string) => {
    setWalletState(prev => ({ ...prev, connecting: true }));
    
    try {
      let walletAdapter: any = null;
      
      switch (walletType) {
        case 'phantom':
          walletAdapter = (window as any).solana;
          if (!walletAdapter?.isPhantom) {
            throw new Error('Phantom wallet not detected');
          }
          break;
        case 'solflare':
          walletAdapter = (window as any).solflare;
          if (!walletAdapter || !walletAdapter.connect) {
            throw new Error('Solflare wallet not detected');
          }
          break;
        case 'backpack':
          walletAdapter = (window as any).backpack;
          if (!walletAdapter) {
            throw new Error('Backpack wallet not detected');
          }
          break;
        case 'trust':
          walletAdapter = (window as any).trustwallet || 
                          (window as any).trust ||
                          (window as any).trustWallet ||
                          ((window as any).solana && (window as any).solana.isTrust ? (window as any).solana : null);
          if (!walletAdapter) {
            throw new Error('Trust wallet not detected');
          }
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      // Connect to wallet
      let response;
      if (walletAdapter.publicKey) {
        response = { publicKey: walletAdapter.publicKey };
      } else if (typeof walletAdapter.connect === 'function') {
        response = await walletAdapter.connect();
      } else {
        throw new Error('Wallet connect method not available');
      }

      if (!response?.publicKey) {
        throw new Error('Failed to get public key from wallet');
      }

      const address = response.publicKey.toString ? response.publicKey.toString() : response.publicKey.toBase58();
      
      // Fetch initial balances
      const [solBalance, goldBalance] = await Promise.all([
        fetchSolBalance(address),
        fetchGoldBalance(address)
      ]);

      setWalletState({
        connected: true,
        connecting: false,
        address,
        balance: solBalance,
        goldBalance: goldBalance,
        selectedWallet: walletType
      });

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletOptions.find(w => w.type === walletType)?.name}`,
      });

      // Set up periodic balance refresh
      const interval = setInterval(refreshBalances, 10000); // Refresh every 10 seconds
      
      // Store interval ID for cleanup
      (window as any).__balanceRefreshInterval = interval;

    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setWalletState(prev => ({ ...prev, connecting: false }));
      
      toast({
        title: "Connection Failed",
        description: error.message || "Please ensure the wallet is unlocked and accessible.",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (walletState.selectedWallet) {
      try {
        let walletAdapter: any = null;
        
        switch (walletState.selectedWallet) {
          case 'phantom':
            walletAdapter = (window as any).solana;
            break;
          case 'solflare':
            walletAdapter = (window as any).solflare;
            break;
          case 'backpack':
            walletAdapter = (window as any).backpack;
            break;
          case 'trust':
            walletAdapter = (window as any).trustwallet || 
                           (window as any).trust ||
                           (window as any).trustWallet;
            break;
        }
        
        if (walletAdapter?.disconnect) {
          await walletAdapter.disconnect();
        }
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
    
    // Clear balance refresh interval
    if ((window as any).__balanceRefreshInterval) {
      clearInterval((window as any).__balanceRefreshInterval);
      (window as any).__balanceRefreshInterval = null;
    }
    
    setWalletState({
      connected: false,
      connecting: false,
      address: null,
      balance: 0,
      goldBalance: 0,
      selectedWallet: null
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ((window as any).__balanceRefreshInterval) {
        clearInterval((window as any).__balanceRefreshInterval);
      }
    };
  }, []);

  const availableWallets = getAvailableWallets();
  const currentWallet = walletOptions.find(w => w.type === walletState.selectedWallet);

  // Show connect button if not connected
  if (!walletState.connected) {
    return (
      <div className="relative">
        <Button 
          disabled={walletState.connecting}
          className="wallet-selector-button"
          onClick={() => {
            if (availableWallets.length === 0) {
              toast({
                title: "No Wallets Found",
                description: "Please install a Solana wallet extension like Phantom, Solflare, Backpack, or Trust Wallet.",
                variant: "destructive",
              });
            } else if (availableWallets.length === 1) {
              connectWallet(availableWallets[0]);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          <span className="mr-2">💳</span>
          {walletState.connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        
        {isOpen && availableWallets.length > 1 && (
          <div className="absolute top-full mt-2 right-0 w-64 bg-black/95 border border-yellow-400/30 rounded-lg shadow-2xl backdrop-blur-sm z-50">
            <div className="p-3 border-b border-yellow-400/20">
              <h3 className="text-yellow-100 font-medium">Choose Wallet</h3>
            </div>
            <div className="p-2">
              {walletOptions.map((wallet) => {
                const isAvailable = availableWallets.includes(wallet.type);
                return (
                  <button
                    key={wallet.type}
                    onClick={() => {
                      if (isAvailable) {
                        setIsOpen(false);
                        connectWallet(wallet.type);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`
                      w-full text-left p-3 rounded-md transition-all duration-200
                      ${isAvailable 
                        ? 'text-yellow-100 hover:bg-yellow-500/20 cursor-pointer' 
                        : 'text-gray-500 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{wallet.icon}</span>
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-yellow-200/70">
                            {isAvailable ? 'Available' : 'Not installed'}
                          </div>
                        </div>
                      </div>
                      {isAvailable && (
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                          Connect
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show connected wallet info with balances
  return (
    <div className="relative">
      <Button 
        className="bg-black/70 border-yellow-400/40 hover:border-yellow-400/70 text-yellow-100 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{currentWallet?.icon || '💳'}</span>
        
        {/* Show balances in button */}
        <div className="hidden sm:flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs">⚡</span>
            <span className="text-xs font-medium">{walletState.balance.toFixed(4)} SOL</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs">💰</span>
            <span className="text-xs font-medium">{walletState.goldBalance.toFixed(2)} GOLD</span>
          </div>
        </div>
        
        {/* Mobile view */}
        <div className="sm:hidden flex items-center space-x-2">
          <span className="text-xs">{walletState.balance.toFixed(2)} SOL</span>
          <span className="text-xs">|</span>
          <span className="text-xs">{walletState.goldBalance.toFixed(0)} GOLD</span>
        </div>
        
        <span className="ml-2">▼</span>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-black/90 border-yellow-400/40 rounded-lg shadow-2xl backdrop-blur-sm z-50">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-100">Connected Wallet</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-200/70">Wallet:</span>
                <span className="text-xs text-yellow-100">{currentWallet?.name || 'Unknown Wallet'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-200/70">Address:</span>
                <span className="text-xs font-mono text-yellow-100">
                  {walletState.address ? `${walletState.address.slice(0, 8)}...${walletState.address.slice(-8)}` : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-200/70">SOL Balance:</span>
                <span className="text-xs font-medium text-yellow-100">
                  {walletState.balance.toFixed(4)} SOL
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-200/70">GOLD Balance:</span>
                <span className="text-xs font-medium text-yellow-100">
                  {walletState.goldBalance.toFixed(2)} GOLD
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-yellow-400/30 p-2 space-y-1">
            <button
              onClick={refreshBalances}
              className="w-full text-left p-2 text-yellow-400 hover:bg-yellow-500/20 rounded cursor-pointer transition-colors"
            >
              🔄 Refresh Balances
            </button>
            <button
              onClick={disconnectWallet}
              className="w-full text-left p-2 text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export wallet state for use in other components
export const getWalletState = () => {
  return {
    connected: false,
    balance: 0,
    goldBalance: 0,
    address: null
  };
}; 
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  selectedWallet: string | null;
}

const walletOptions = [
  { type: 'phantom', name: 'Phantom', icon: '🟣' },
  { type: 'solflare', name: 'Solflare', icon: '🔥' },
  { type: 'backpack', name: 'Backpack', icon: '🎒' },
  { type: 'trust', name: 'Trust Wallet', icon: '🔷' }
];

export function SimpleWalletSelector() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    connecting: false,
    address: null,
    balance: 0,
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
      
      // Fetch balance
      let balance = 0;
      try {
        const balanceResponse = await fetch('https://solana.publicnode.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'getBalance',
            params: [address]
          })
        });
        
        const data = await balanceResponse.json();
        if (data.result && typeof data.result.value === 'number') {
          balance = data.result.value / 1000000000; // Convert lamports to SOL
        }
      } catch (error) {
        console.log('Balance fetch failed, using 0:', error);
      }

      setWalletState({
        connected: true,
        connecting: false,
        address,
        balance,
        selectedWallet: walletType
      });

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletOptions.find(w => w.type === walletType)?.name}`,
      });

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
    
    setWalletState({
      connected: false,
      connecting: false,
      address: null,
      balance: 0,
      selectedWallet: null
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

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

  // Show connected wallet info
  return (
    <div className="relative">
      <Button 
        className="bg-black/70 border-yellow-400/40 hover:border-yellow-400/70 text-yellow-100 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{currentWallet?.icon || '💳'}</span>
        <span className="hidden sm:inline">
          {walletState.address ? `${walletState.address.slice(0, 4)}...${walletState.address.slice(-4)}` : 'Wallet'}
        </span>
        <span className="sm:hidden">{currentWallet?.name || 'Connected'}</span>
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
                <span className="text-xs text-yellow-200/70">Balance:</span>
                <span className="text-xs font-medium text-yellow-100">
                  {walletState.balance.toFixed(4)} SOL
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-yellow-400/30 p-2">
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
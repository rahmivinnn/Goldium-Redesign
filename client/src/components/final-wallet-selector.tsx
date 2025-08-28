import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateGlobalWalletState } from './fixed-swap-tab';

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

export function FinalWalletSelector() {
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
        console.log('🟣 Phantom detected');
        available.push('phantom');
      }
      
      // Check for Solflare
      if ((window as any).solflare?.isSolflare || (window as any).solflare) {
        console.log('🔥 Solflare detected');
        available.push('solflare');
      }
      
      // Check for Backpack
      if ((window as any).backpack?.isBackpack || (window as any).backpack) {
        console.log('🎒 Backpack detected');
        available.push('backpack');
      }
      
      // Enhanced Trust Wallet detection
      const trustWallet = (window as any).trustwallet || 
                         (window as any).trust ||
                         (window as any).trustWallet ||
                         (window as any).isTrust ||
                         (window as any).isTrustWallet ||
                         ((window as any).solana && (window as any).solana.isTrust) ||
                         ((window as any).ethereum && (window as any).ethereum.isTrust) ||
                         ((window as any).solana && (window as any).solana.isTrustWallet) ||
                         ((window as any).ethereum && (window as any).ethereum.isTrustWallet) ||
                         // Additional Trust Wallet detection methods
                         ((window as any).solana && (window as any).solana.provider && (window as any).solana.provider.isTrust) ||
                         ((window as any).ethereum && (window as any).ethereum.provider && (window as any).ethereum.provider.isTrust) ||
                         // Check for Trust Wallet in window object
                         (window as any).__TRUST_WALLET__ ||
                         (window as any).trustWalletExtension;
      
      if (trustWallet) {
        console.log('🔷 Trust Wallet detected:', trustWallet);
        available.push('trust');
      } else {
        console.log('❌ Trust Wallet not detected');
        // Log all window properties for debugging
        console.log('🔍 Available window properties:', Object.keys(window).filter(key => 
          key.toLowerCase().includes('trust') || 
          key.toLowerCase().includes('wallet') ||
          key.toLowerCase().includes('solana') ||
          key.toLowerCase().includes('ethereum')
        ));
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

  // Trust Wallet specific connection function
  const connectTrustWallet = async (): Promise<{ publicKey: string }> => {
    console.log('🔷 Attempting Trust Wallet connection...');
    
    // Try multiple Trust Wallet connection methods
    const connectionMethods = [
      // Method 1: Direct trustwallet object
      async () => {
        const tw = (window as any).trustwallet;
        if (tw && typeof tw.request === 'function') {
          const accounts = await tw.request({ method: 'eth_requestAccounts' });
          return { publicKey: accounts[0] };
        }
        throw new Error('Method 1 failed');
      },
      
      // Method 2: Solana provider with Trust Wallet
      async () => {
        const solana = (window as any).solana;
        if (solana && (solana.isTrust || solana.isTrustWallet)) {
          if (solana.connect) {
            const response = await solana.connect();
            return { publicKey: response.publicKey.toString() };
          }
        }
        throw new Error('Method 2 failed');
      },
      
      // Method 3: Ethereum provider with Trust Wallet
      async () => {
        const ethereum = (window as any).ethereum;
        if (ethereum && (ethereum.isTrust || ethereum.isTrustWallet)) {
          if (ethereum.request) {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            return { publicKey: accounts[0] };
          }
        }
        throw new Error('Method 3 failed');
      },
      
      // Method 4: Enable method
      async () => {
        const tw = (window as any).trustwallet || (window as any).trust || (window as any).trustWallet;
        if (tw && typeof tw.enable === 'function') {
          const accounts = await tw.enable();
          return { publicKey: accounts[0] };
        }
        throw new Error('Method 4 failed');
      },
      
      // Method 5: Direct connection
      async () => {
        const tw = (window as any).trustwallet || (window as any).trust || (window as any).trustWallet;
        if (tw && typeof tw.connect === 'function') {
          const response = await tw.connect();
          return { publicKey: response.publicKey.toString() };
        }
        throw new Error('Method 5 failed');
      }
    ];
    
    // Try each method until one works
    for (let i = 0; i < connectionMethods.length; i++) {
      try {
        console.log(`🔄 Trying Trust Wallet connection method ${i + 1}...`);
        const result = await connectionMethods[i]();
        console.log(`✅ Trust Wallet connected via method ${i + 1}`);
        return result;
      } catch (error) {
        console.log(`❌ Trust Wallet method ${i + 1} failed:`, error);
        if (i === connectionMethods.length - 1) {
          throw new Error('All Trust Wallet connection methods failed');
        }
      }
    }
    
    throw new Error('Trust Wallet connection failed');
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
      
      const newState = {
        ...walletState,
        balance: solBalance,
        goldBalance: goldBalance
      };
      
      setWalletState(newState);
      updateGlobalWalletState(newState);
      
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
          // Use specialized Trust Wallet connection function
          console.log('🔷 Using specialized Trust Wallet connection...');
          try {
            const trustResponse = await connectTrustWallet();
            const response = trustResponse;
            console.log('✅ Trust Wallet connected successfully');
            // Skip the general connection logic and go directly to balance fetching
            const address = trustResponse.publicKey;
            console.log('📍 Trust Wallet address:', address);
            
            // Fetch initial balances
            const [solBalance, goldBalance] = await Promise.all([
              fetchSolBalance(address),
              fetchGoldBalance(address)
            ]);

            const newState = {
              connected: true,
              connecting: false,
              address,
              balance: solBalance,
              goldBalance: goldBalance,
              selectedWallet: walletType
            };
            
            setWalletState(newState);
            updateGlobalWalletState(newState);

            toast({
              title: "Trust Wallet Connected",
              description: "Successfully connected to Trust Wallet",
            });

            // Set up periodic balance refresh
            const interval = setInterval(refreshBalances, 10000);
            (window as any).__balanceRefreshInterval = interval;
            
            return; // Exit early for Trust Wallet
          } catch (error: any) {
            console.error('Trust Wallet connection failed:', error);
            throw new Error(`Trust Wallet connection failed: ${error.message || 'Unknown error'}`);
          }
        default:
          throw new Error('Unsupported wallet type');
      }

      // Connect to wallet
      let response;
      console.log('🔗 Attempting to connect to wallet:', walletType, walletAdapter);
      
      if (walletAdapter.publicKey) {
        response = { publicKey: walletAdapter.publicKey };
        console.log('✅ Wallet already connected, public key found');
      } else if (typeof walletAdapter.connect === 'function') {
        console.log('🔄 Calling wallet connect method...');
        response = await walletAdapter.connect();
        console.log('✅ Wallet connect response:', response);
      } else if (typeof walletAdapter.request === 'function') {
        // Trust Wallet specific connection method
        console.log('🔄 Using Trust Wallet request method...');
        try {
          const accounts = await walletAdapter.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            response = { publicKey: accounts[0] };
            console.log('✅ Trust Wallet connected via request method');
          }
        } catch (error) {
          console.log('❌ Trust Wallet request failed, trying alternative method...');
          // Try alternative connection method
          if (walletAdapter.enable) {
            const accounts = await walletAdapter.enable();
            if (accounts && accounts.length > 0) {
              response = { publicKey: accounts[0] };
              console.log('✅ Trust Wallet connected via enable method');
            }
          }
        }
      } else {
        throw new Error(`Wallet connect method not available for ${walletType}`);
      }

      if (!response?.publicKey) {
        throw new Error(`Failed to get public key from ${walletType} wallet`);
      }

      // Handle different public key formats
      let address;
      if (typeof response.publicKey === 'string') {
        address = response.publicKey;
      } else if (response.publicKey.toString) {
        address = response.publicKey.toString();
      } else if (response.publicKey.toBase58) {
        address = response.publicKey.toBase58();
      } else {
        throw new Error(`Unsupported public key format from ${walletType}`);
      }
      
      console.log('📍 Wallet address:', address);
      
      // Fetch initial balances
      const [solBalance, goldBalance] = await Promise.all([
        fetchSolBalance(address),
        fetchGoldBalance(address)
      ]);

      const newState = {
        connected: true,
        connecting: false,
        address,
        balance: solBalance,
        goldBalance: goldBalance,
        selectedWallet: walletType
      };
      
      setWalletState(newState);
      updateGlobalWalletState(newState);

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
    
    const newState = {
      connected: false,
      connecting: false,
      address: null,
      balance: 0,
      goldBalance: 0,
      selectedWallet: null
    };
    
    setWalletState(newState);
    updateGlobalWalletState(newState);

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
            className="wallet-selector-button powerful-button"
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
            className="powerful-button bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/60 hover:border-yellow-400/90 text-yellow-100 transition-all duration-300"
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
          <div className="absolute top-full mt-2 right-0 w-80 powerful-card wallet-dropdown z-50">
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
                className="w-full text-left p-2 text-yellow-400 hover:bg-yellow-500/20 rounded cursor-pointer transition-colors wallet-option"
              >
              🔄 Refresh Balances
            </button>
                          <button
                onClick={disconnectWallet}
                className="w-full text-left p-2 text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition-colors wallet-option"
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
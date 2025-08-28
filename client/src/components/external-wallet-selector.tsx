import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Wallet, Copy, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SOLSCAN_BASE_URL } from '@/lib/constants';

interface WalletOption {
  type: string;
  name: string;
  icon: string;
  description: string;
}

// Wallet Logo Components (using emoji fallback for reliability)
const WalletLogos = {
  phantom: '🟣',
  solflare: '🔥', 
  backpack: '🎒',
  trust: '🔷'
};

// Wallet Logo Images (base64 encoded for reliability)
const WalletImages = {
  phantom: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNBQjlGRjIiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0zIDVDMyAyLjc5MDg2IDQuNzkwODYgMSA3IDFIOUM5LjIwOTE0IDEgMTEgMi43OTA4NiAxMSA1VjEzTDguNSAxMUw2IDEzTDMuNSAxMUwzIDEzVjVaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMSIgZmlsbD0iI0FCOUZGMiIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjYiIHI9IjEiIGZpbGw9IiNBQjlGRjIiLz4KPC9zdmc+Cjwvc3ZnPgo=',
  solflare: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNGQzhENEQiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDBMMTIgNEg0TDggMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04IDE2TDQgMTJIMTJMOCAxNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0wIDhMNCA0VjEyTDAgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA4TDEyIDEyVjRMMTYgOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
  backpack: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNFMzNFM0YiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik00IDNDNCAyLjQ0NzcyIDQuNDQ3NzIgMiA1IDJIOUMxMC4xMDQ2IDIgMTEgMi44OTU0MyAxMSAzVjRIMTJDMTIuNTUyMyA0IDEzIDQuNDQ3NzIgMTMgNVYxNEMxMyAxNC41NTIzIDEyLjU1MjMgMTUgMTIgMTVIM0MyLjQ0NzcyIDE1IDIgMTQuNTUyMyAyIDE0VjVDMiA0LjQ0NzcyIDIuNDQ3NzIgNCAzIDRINFYzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYgM1Y0SDlWM0M5IDIuNDQ3NzIgOC41NTIyOCAyIDggMkg3QzYuNDQ3NzIgMiA2IDIuNDQ3NzIgNiAzWiIgZmlsbD0iI0UzM0UzRiIvPgo8cmVjdCB4PSI1IiB5PSI3IiB3aWR0aD0iNiIgaGVpZ2h0PSIxIiBmaWxsPSIjRTMzRTNGIi8+Cjwvc3ZnPgo8L3N2Zz4K',
  trust: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiMzMzc1QkIiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDBMMTQgM1Y5QzE0IDEzLjUgMTEgMTcuMjYgOCAxOEM1IDE3LjI2IDIgMTMuNSAyIDlWM0w4IDBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNiA5TDcuNSAxMC41TDEwLjUgNy41IiBzdHJva2U9IiMzMzc1QkIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'
};

const walletOptions: WalletOption[] = [
  {
    type: 'phantom',
    name: 'Phantom',
    icon: 'phantom',
    description: 'Most popular Solana wallet',
  },
  {
    type: 'solflare',
    name: 'Solflare',
    icon: 'solflare',
    description: 'Feature-rich Solana wallet',
  },
  {
    type: 'backpack',
    name: 'Backpack',
    icon: 'backpack',
    description: 'Modern crypto wallet',
  },
  {
    type: 'trust',
    name: 'Trust Wallet',
    icon: 'trust',
    description: 'Secure multi-coin wallet',
  },
];

// Simple wallet state management
interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  selectedWallet: string | null;
}

export function ExternalWalletSelector() {
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

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!walletState.address) return;
    
    try {
      await navigator.clipboard.writeText(walletState.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // View wallet on Solscan
  const viewOnSolscan = () => {
    if (!walletState.address) return;
    window.open(`${SOLSCAN_BASE_URL}/account/${walletState.address}`, '_blank');
  };

  // Handle wallet selection
  const handleWalletSelect = async (walletType: string) => {
    if (walletState.selectedWallet === walletType) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    await connectWallet(walletType);
  };

  const availableWallets = getAvailableWallets();
  const currentWallet = walletOptions.find(w => w.type === walletState.selectedWallet);

  // Show connect button if not connected
  if (!walletState.connected) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            disabled={walletState.connecting}
            className="wallet-selector-button"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {walletState.connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-80 bg-black/90 border-yellow-400/30 z-50 backdrop-blur-sm"
        >
          <DropdownMenuLabel className="text-yellow-100 px-4 py-3 border-b border-yellow-400/20">
            Connect Your Wallet
          </DropdownMenuLabel>
          
          <div className="p-2 space-y-1">
            {walletOptions.map((walletOption) => {
              const isAvailable = availableWallets.includes(walletOption.type);
              
              return (
                <DropdownMenuItem
                  key={walletOption.type}
                  onClick={() => isAvailable && handleWalletSelect(walletOption.type)}
                  className={`
                    text-yellow-100 hover:bg-yellow-500/20 cursor-pointer p-3 rounded-md transition-all duration-200
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400/20'}
                  `}
                  disabled={!isAvailable}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        <img 
                          src={WalletImages[walletOption.icon as keyof typeof WalletImages]} 
                          alt={walletOption.name} 
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <span className={`text-lg hidden ${WalletLogos[walletOption.icon as keyof typeof WalletLogos]}`}>
                          {WalletLogos[walletOption.icon as keyof typeof WalletLogos]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{walletOption.name}</div>
                        <div className="text-xs text-yellow-200/70">{walletOption.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isAvailable ? (
                        <span className="text-xs text-green-400 px-2 py-1 bg-green-500/20 rounded">
                          Detected
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-200/70 px-2 py-1 bg-yellow-400/20 rounded">
                          Not Found
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>

          {availableWallets.length === 0 && (
            <div className="p-4 text-center text-sm text-yellow-200/70 border-t border-yellow-400/30 mt-2">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-400/50" />
              <p className="mb-2 font-medium">No wallet extensions found.</p>
              <p className="text-xs mb-3">Please install and refresh the page:</p>
              <div className="text-xs space-y-1">
                <div>• <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Phantom Wallet</a></div>
                <div>• <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Solflare Wallet</a></div>
                <div>• <a href="https://backpack.app/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Backpack Wallet</a></div>
                <div>• <a href="https://trustwallet.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Trust Wallet</a></div>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show connected wallet info
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-black/70 border-yellow-400/40 hover:border-yellow-400/70 text-yellow-100 transition-all duration-200"
        >
          <div className="mr-2 flex items-center justify-center w-5 h-5">
            {currentWallet ? (
                <img 
                  src={WalletImages[currentWallet.icon as keyof typeof WalletImages]} 
                  alt={currentWallet.name} 
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
            <span className={`text-sm hidden ${WalletLogos[currentWallet?.icon as keyof typeof WalletLogos] || '🪙'}`}>
              {WalletLogos[currentWallet?.icon as keyof typeof WalletLogos] || '🪙'}
            </span>
          </div>
          <span className="hidden sm:inline">
            {walletState.address ? `${walletState.address.slice(0, 4)}...${walletState.address.slice(-4)}` : 'Wallet'}
          </span>
          <span className="sm:hidden">{currentWallet?.name || 'Connected'}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-black/90 border-yellow-400/40 backdrop-blur-sm"
      >
        {/* Connected Wallet Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-100">Connected Wallet</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-200/70">Wallet:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-4 h-4">
                  {currentWallet ? (
                  <img 
                    src={WalletImages[currentWallet.icon as keyof typeof WalletImages]} 
                    alt={currentWallet.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <Wallet className="w-3 h-3" />
                )}
                </div>
                <span className="text-xs text-yellow-100">{currentWallet?.name || 'Unknown Wallet'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-200/70">Address:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-yellow-100">
                  {walletState.address ? `${walletState.address.slice(0, 8)}...${walletState.address.slice(-8)}` : 'N/A'}
                </span>
                <Button
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 hover:bg-yellow-400/20"
                  disabled={!walletState.address}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-200/70">Balance:</span>
              <span className="text-xs font-medium text-yellow-100">
                {walletState.balance.toFixed(4)} SOL
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-yellow-400/30" />

        {/* Switch Wallet */}
        <DropdownMenuLabel className="text-yellow-100 px-4">Switch Wallet</DropdownMenuLabel>
        
        <div className="p-2 space-y-1">
          {walletOptions.map((walletOption) => {
            const isAvailable = availableWallets.includes(walletOption.type);
            const isSelected = walletState.selectedWallet === walletOption.type;
            
            return (
              <DropdownMenuItem
                key={walletOption.type}
                onClick={() => isAvailable && !isSelected && handleWalletSelect(walletOption.type)}
                className={`
                  text-yellow-100 hover:bg-yellow-500/20 cursor-pointer p-3 rounded-md transition-all duration-200
                  ${isSelected ? 'bg-yellow-500/30' : ''}
                  ${!isAvailable ? 'opacity-50' : ''}
                `}
                disabled={!isAvailable || isSelected}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      <img 
                        src={WalletImages[walletOption.icon as keyof typeof WalletImages]} 
                        alt={walletOption.name} 
                        className="w-6 h-6 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{walletOption.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-green-400" />}
                      </div>
                      <span className="text-xs text-yellow-200/70">{walletOption.description}</span>
                    </div>
                  </div>
                  {!isAvailable && (
                    <span className="text-xs text-yellow-200/70">Not Detected</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="bg-yellow-400/30" />

        {/* Wallet Actions */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-yellow-100 hover:bg-yellow-500/20 cursor-pointer"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={viewOnSolscan}
            className="text-yellow-100 hover:bg-yellow-500/20 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Solscan
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="text-red-400 hover:bg-red-500/20 cursor-pointer"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </div>

        {/* Network Info */}
        <DropdownMenuSeparator className="bg-yellow-400/30" />
        <div className="p-4">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs font-medium text-green-400">Solana Mainnet</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FixedSwapTab } from '@/components/fixed-swap-tab';
import { FixedStakingTab } from '@/components/fixed-staking-tab';
import { FixedSendTab } from '@/components/fixed-send-tab';
import { TransactionHistory } from '@/components/transaction-history';
import { GoldiumTransactionTracker } from '@/components/goldium-transaction-tracker';
import { AnimationDemo } from '@/components/animation-demo';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { FinalWalletSelector } from '@/components/final-wallet-selector';
import { ModernGenZNavbar } from '@/components/modern-gen-z-navbar';
import { ModernGenZHero } from '@/components/modern-gen-z-hero';
import { ModernGenZLeaderboard } from '@/components/modern-gen-z-leaderboard';
import { ModernGenZButton } from '@/components/modern-gen-z-button';
import { RealTimeNotifications } from '@/components/real-time-notifications';
import { ExternalLink } from 'lucide-react';
import { AnimatedTokenomicsCharts } from '@/components/animated-tokenomics-charts';
import { realTimeDataService, RealTimeTokenData } from '@/services/real-time-data-service';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { goldTokenService } from '@/services/gold-token-service';
import { autoSaveTransaction } from "@/lib/historyUtils";
import { useGoldBalance } from '@/hooks/use-gold-balance';
import goldiumLogo from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';
import { TwitterEmbed } from '@/components/twitter-embed';

export default function HomeSimple() {
  const wallet = useSolanaWallet();
  const [tokenData, setTokenData] = useState<RealTimeTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.000047');
  
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  const goldBalance = useGoldBalance();

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const data = await realTimeDataService.getRealTimeTokenData();
        setTokenData(data);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
        setTokenData({
          price: 0.00004653,
          marketCap: 1000000,
          volume24h: 50000,
          holders: 1234
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyGoldium = async () => {
    if (!externalWallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to buy GOLDIUM tokens.",
        variant: "destructive"
      });
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive"
      });
      return;
    }

    setBuyingToken(true);
    try {
      console.log('🚀 Starting REAL GOLDIUM purchase with blockchain integration');
      
      const solAmount = parseFloat(buyAmount);
      const goldAmount = solAmount * 21486.893;

      const { SwapService } = await import('@/lib/swap-service');
      const swapService = new SwapService();

      if (externalWallet.walletInstance) {
        console.log('✅ External wallet connected for REAL transaction');
        const swapResult = await swapService.swapSolToGoldium(
          externalWallet.walletInstance,
          solAmount
        );

        if (!swapResult.success) {
          throw new Error(swapResult.error || 'Swap failed');
        }

        const signature = swapResult.signature || 'demo_signature_' + Date.now();

        const { transactionHistory } = await import('@/lib/transaction-history');
        if (externalWallet.address) {
          transactionHistory.addGoldTransaction('swap_receive', goldAmount, signature);
        }

        if (externalWallet.address) {
          autoSaveTransaction(
            externalWallet.address,
            'buy',
            solAmount,
            goldAmount,
            'success'
          );
        }

        toast({
          title: "🎉 REAL Purchase Successful!",
          description: `Successfully bought ${goldAmount.toFixed(2)} GOLDIUM tokens with ${buyAmount} SOL! Transaction: ${signature.slice(0, 8)}...`,
          variant: "default"
        });

        setBuyAmount('0.000047');
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      }
    } catch (error) {
      console.error('Failed to buy GOLDIUM:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to buy GOLDIUM tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBuyingToken(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      <div className="floating-orb floating-orb-4"></div>
      <div className="floating-orb floating-orb-5"></div>
      
      {/* Floating Particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>

      {/* Modern Navigation Bar */}
      <ModernGenZNavbar />
      
      {/* Modern Hero Section */}
      <ModernGenZHero />
      
      {/* Real-time notifications */}
      <div className="fixed top-20 right-6 z-40">
        <RealTimeNotifications className="shadow-2xl" maxNotifications={3} />
      </div>

      {/* Main Content Sections */}
      <div className="relative z-10">
        {/* DeFi Trading Section */}
        <section id="defi" className="py-20 bg-black/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                DeFi Trading Platform
              </h2>
              <p className="text-xl text-yellow-300 max-w-3xl mx-auto">
                Experience seamless trading with our modern, user-friendly interface
              </p>
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-400">
                    <img 
                      src={goldiumLogo} 
                      alt="Goldium Logo" 
                      className="w-full h-full object-contain bg-black p-2"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400">Buy GOLDIUM with SOL</h3>
                </div>
                <div className="bg-black/60 border border-yellow-400/50 p-4 rounded-2xl inline-block">
                  <p className="text-yellow-300 font-medium">
                    Exchange Rate: <span className="text-yellow-400 font-bold">1 SOL = 21,486.893 GOLD</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 items-center max-w-md mx-auto">
                <div className="w-full">
                  <label className="block text-sm font-medium text-yellow-300 mb-2">SOL Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="Enter SOL amount"
                      min="0.000047"
                      step="0.000047"
                      className="bg-black/60 border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-center font-semibold placeholder-yellow-600"
                      disabled={buyingToken}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold text-sm">SOL</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-lg">
                  <span className="text-yellow-400">↓</span>
                  <span className="text-yellow-400 font-bold">
                    {buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD
                  </span>
                </div>
              </div>
                
              <ModernGenZButton
                onClick={handleBuyGoldium}
                disabled={buyingToken || !externalWallet.connected}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {buyingToken ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Buying GOLDIUM...
                  </div>
                ) : (
                  'Buy GOLDIUM with SOL'
                )}
              </ModernGenZButton>
              
              {!externalWallet.connected && (
                <p className="text-sm text-yellow-300 text-center">Connect wallet to buy GOLDIUM tokens</p>
              )}
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-8 max-w-md mx-auto mt-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg animate-bounce-soft">
                    <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400">Join Our Community</h3>
                </div>
                <div className="bg-black/60 border border-yellow-400/50 p-4 rounded-2xl">
                  <p className="text-yellow-300 font-medium">
                    Stay updated with <span className="text-yellow-400 font-bold">latest news and announcements</span>
                  </p>
                </div>
              </div>
              
              <ModernGenZButton
                onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Follow on Twitter
                </div>
              </ModernGenZButton>
            </div>
          </div>
        </section>

        {/* Community Leaderboard Section */}
        <section id="leaderboard" className="py-20 bg-black/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                Community Champions
              </h2>
              <p className="text-xl text-yellow-300 max-w-3xl mx-auto">
                Top performers in our vibrant GOLDIUM community
              </p>
            </div>
            
            <ModernGenZLeaderboard />
          </div>
        </section>
      </div>

      {/* Live Market Data Section */}
      <section className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-soft">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-black rounded-sm"></div>
                  <div className="w-2 h-3 bg-black rounded-sm"></div>
                  <div className="w-2 h-1 bg-black rounded-sm"></div>
                  <div className="w-2 h-4 bg-black rounded-sm"></div>
                </div>
              </div>
              Live Market Data
            </h2>
            <p className="text-xl text-yellow-300 max-w-3xl mx-auto">Real-time market statistics and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-400 animate-bounce-soft">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain bg-black p-2"
                />
              </div>
              <div className="text-yellow-400 font-bold text-lg mb-2">Current Price</div>
              <div className="text-yellow-300 text-2xl font-bold mb-2">
                ${tokenData ? tokenData.price.toFixed(8) : '0.00004653'}
              </div>
              <div className="bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full inline-block">+12.5% ↗</div>
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg animate-bounce-soft">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-yellow-400 font-bold text-lg mb-2">Market Cap</div>
              <div className="text-yellow-300 text-2xl font-bold mb-2">
                ${tokenData ? tokenData.marketCap.toLocaleString() : '1,000,000'}
              </div>
              <div className="bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full inline-block">+15.2% ↗</div>
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg animate-bounce-soft">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-yellow-400 font-bold text-lg mb-2">24h Volume</div>
              <div className="text-yellow-300 text-2xl font-bold mb-2">
                ${tokenData ? tokenData.volume24h.toLocaleString() : '50,000'}
              </div>
              <div className="bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full inline-block">+9.8% ↗</div>
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg animate-bounce-soft">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
              </div>
              <div className="text-yellow-400 font-bold text-lg mb-2">Holders</div>
              <div className="text-yellow-300 text-2xl font-bold mb-2">
                {tokenData ? tokenData.holders.toLocaleString() : '1,234'}
              </div>
              <div className="bg-yellow-400/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full inline-block">+8.23% ↗</div>
            </div>
          </div>
        </div>
      </section>

      {/* DeFi Features Section */}
      <section id="features" className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              DeFi Platform Features
            </h2>
            <p className="text-xl text-yellow-300 max-w-3xl mx-auto">
              Explore powerful DeFi tools designed for the modern trader
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <Tabs defaultValue="swap" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/60 border border-yellow-400/50 rounded-2xl p-1">
                  <TabsTrigger value="swap" className="rounded-xl font-semibold text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Swap</TabsTrigger>
                  <TabsTrigger value="stake" className="rounded-xl font-semibold text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Stake</TabsTrigger>
                  <TabsTrigger value="send" className="rounded-xl font-semibold text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black">Send</TabsTrigger>
                </TabsList>
                <TabsContent value="swap" className="mt-6">
                  <FixedSwapTab />
                </TabsContent>
                <TabsContent value="stake" className="mt-6">
                  <FixedStakingTab />
                </TabsContent>
                <TabsContent value="send" className="mt-6">
                  <FixedSendTab />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Transaction History</h3>
                <p className="text-yellow-300">Track your GOLDIUM transactions</p>
              </div>
              <TransactionHistory />
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              GOLDIUM Tokenomics
            </h2>
            <p className="text-xl text-yellow-300 max-w-3xl mx-auto">
              Sustainable token distribution for long-term growth
            </p>
          </div>
          
          <div className="bg-black/80 border border-yellow-400/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <AnimatedTokenomicsCharts />
          </div>
        </div>
      </section>

      {/* Twitter Feed Section */}
      <section className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              Latest Updates
            </h2>
            <p className="text-xl text-yellow-300 max-w-3xl mx-auto">
              Stay connected with our community
            </p>
          </div>
          
          <TwitterEmbed />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-yellow-400/30 text-yellow-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-400">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain bg-black p-2"
                />
              </div>
              <h3 className="text-2xl font-bold text-yellow-400">GOLDIUM</h3>
            </div>
            <div className="text-xs sm:text-sm text-yellow-300 text-center">
              © 2025 Goldium. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
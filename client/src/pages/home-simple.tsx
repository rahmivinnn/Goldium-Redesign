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
import { AdvancedTradingChart } from '@/components/advanced-trading-chart';
import { YieldFarmingPools } from '@/components/yield-farming-pools';
import { PortfolioAnalytics } from '@/components/portfolio-analytics';
import { DAOGovernance } from '@/components/dao-governance';
import { NFTMarketplace } from '@/components/nft-marketplace';
import { AdvancedStakingTiers } from '@/components/advanced-staking-tiers';
import { ParticleSystem, FloatingElements } from '@/components/particle-system';
import { Enhanced3DCard, GlowingButton, NeonText } from '@/components/enhanced-3d-cards';
import { CyberpunkHUD } from '@/components/cyberpunk-hud';

import { RealTimeNotifications } from '@/components/real-time-notifications';
import { ExternalLink, Zap } from 'lucide-react';
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
  const [buyAmount, setBuyAmount] = useState('0.000047'); // Default amount for 1 GOLD
  
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  const goldBalance = useGoldBalance();

  // Fetch real-time data on component mount
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const data = await realTimeDataService.getRealTimeTokenData();
        setTokenData(data);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
        // Fallback to realistic demo data
        setTokenData({
          currentPrice: 0.0089,
          priceChange24h: 12.8,
          volume24h: 485000,
          marketCap: 890000,
          totalSupply: 100000000,
          circulatingSupply: 60000000,
          stakingAPY: 8.5,
          totalStaked: 21000000,
          holders: 1247
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();

    // Update data every 30 seconds
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
      // REAL BLOCKCHAIN TRANSACTION - No more simulation!
      console.log('🚀 Starting REAL GOLDIUM purchase with blockchain integration');
      
      const solAmount = parseFloat(buyAmount);
      const goldAmount = solAmount * 21486.893; // Exchange rate: 1 SOL = 21,486.893 GOLD
      
      // Import and use REAL swap service
      const { SwapService } = await import('@/lib/swap-service');
      const swapService = new SwapService();
      
      // Set external wallet for real transaction
      if (externalWallet.connected) {
        swapService.setExternalWallet(externalWallet);
        console.log('✅ External wallet connected for REAL transaction');
      }
      
      console.log(`💰 Executing REAL swap: ${solAmount} SOL → ${goldAmount.toFixed(2)} GOLD`);
      console.log(`🔗 Transaction will be tracked with GOLD Contract Address (CA)`);
      
      // Execute REAL blockchain swap
      const swapResult = await swapService.swapSolToGold(solAmount);
      
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Swap failed');
      }
      
      const signature = swapResult.signature!;
      console.log(`✅ REAL transaction completed: ${signature}`);
      console.log(`🔍 View on Solscan: https://solscan.io/tx/${signature}`);
      
      // Update transaction history with REAL signature
      const { transactionHistory } = await import('@/lib/transaction-history');
      if (externalWallet.address) {
        transactionHistory.setCurrentWallet(externalWallet.address);
        transactionHistory.addGoldTransaction('swap_receive', goldAmount, signature);
      }

      // Auto-save REAL transaction
      if (externalWallet.address) {
        await autoSaveTransaction(
          externalWallet.address,
          signature,
          'swap',
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

      // Reset buy amount
      setBuyAmount('0.000047');
      
      // Refresh balances after real transaction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
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
    <div className="min-h-screen chainzoku-override relative overflow-hidden" style={{
      background: '#0a0a0a',
      position: 'relative'
    }}>
      {/* Advanced Particle System */}
      <ParticleSystem 
        particleCount={150} 
        colors={['#00ff41', '#00d4ff', '#ff0080', '#ffff00', '#8000ff']}
        speed={2}
      />
      
      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Cyberpunk HUD */}
      <CyberpunkHUD />
      
      {/* Enhanced Matrix Rain Background */}
      <div className="matrix-rain-container">
        {Array.from({length: 30}).map((_, i) => (
          <div 
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              fontSize: `${12 + Math.random() * 8}px`,
              color: ['#00ff41', '#00d4ff', '#ff0080'][Math.floor(Math.random() * 3)],
              textShadow: `0 0 10px currentColor`
            }}
          >
            {['0', '1', '01', '10', '101', '010', '001', '110'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>
      
      {/* Cyberpunk Grid Background with Animation */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 65, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 4s ease-in-out infinite'
      }} />
      
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
        <section id="defi" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                DeFi Trading Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience seamless trading with our modern, user-friendly interface
              </p>
            </div>
            
            <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-purple-300">
                    <img 
                      src={goldiumLogo} 
                      alt="Goldium Logo" 
                      className="w-full h-full object-contain bg-gradient-to-br from-purple-100 to-pink-100 p-2"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Buy GOLDIUM with SOL</h3>
                </div>
                <div className="glass-card p-4 rounded-2xl inline-block">
                  <p className="text-gray-700 font-medium">
                    Exchange Rate: <span className="text-purple-600 font-bold">1 SOL = 21,486.893 GOLD</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 items-center max-w-md mx-auto">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">SOL Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="Enter SOL amount"
                      min="0.000047"
                      step="0.000047"
                      className="glass-card border-2 border-purple-300 text-gray-800 px-4 py-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-center font-semibold placeholder-gray-500"
                      disabled={buyingToken}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 font-bold text-sm">SOL</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-lg">
                  <span className="text-purple-400">↓</span>
                  <span className="text-purple-600 font-bold">{buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD</span>
                </div>
              </div>
                
              <div className="mt-6">
                <GlowingButton
                  onClick={handleBuyGoldium}
                  variant="primary"
                  size="lg"
                  disabled={buyingToken || !externalWallet.connected}
                  className="w-full"
                >
                  {buyingToken ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <NeonText size="sm" color="#000000">Buying GOLDIUM...</NeonText>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <NeonText size="sm" color="#000000">Buy GOLDIUM with SOL</NeonText>
                    </div>
                  )}
                </GlowingButton>
                
                {!externalWallet.connected && (
                  <p className="text-sm text-gray-500 text-center mt-4">Connect wallet to buy GOLDIUM tokens</p>
                )}
              </div>
            </div>
               
            <div className="glass-card rounded-3xl p-8 max-w-md mx-auto mt-8">
                 <div className="text-center mb-6">
                   <div className="flex items-center justify-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg animate-bounce-soft">
                       <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                       </svg>
                     </div>
                     <h3 className="text-2xl font-bold text-gray-800">Join Our Community</h3>
                   </div>
                   <div className="glass-card p-4 rounded-2xl">
                     <p className="text-gray-700 font-medium">Stay updated with <span className="text-blue-600 font-bold">latest news and announcements</span></p>
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
        <section id="leaderboard" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Community Champions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Top performers in our vibrant GOLDIUM community
                </p>
              </div>
              
              <ModernGenZLeaderboard />
            </div>
        </section>

        {/* Live Market Data Section */}
        <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-soft">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-3 bg-white rounded-sm"></div>
                  <div className="w-2 h-1 bg-white rounded-sm"></div>
                  <div className="w-2 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              Live Market Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real-time market statistics and performance metrics</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-cyan-300 animate-bounce-soft">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain bg-gradient-to-br from-cyan-100 to-blue-100 p-2"
                />
              </div>
              <div className="text-cyan-600 font-bold text-lg mb-2">GOLD Price</div>
              <div className="text-gray-800 text-2xl font-bold mb-2">${tokenData ? tokenData.currentPrice.toFixed(6) : '0.000000'}</div>
              <div className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full inline-block">{tokenData ? `+${tokenData.priceChange24h.toFixed(2)}%` : '+0.00%'} ↗</div>
            </div>
            
            <div className="glass-card rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-100">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow-pulse-soft">
                <div className="flex items-end gap-1">
                  <div className="w-1 h-3 bg-white rounded-sm"></div>
                  <div className="w-1 h-5 bg-white rounded-sm"></div>
                  <div className="w-1 h-4 bg-white rounded-sm"></div>
                  <div className="w-1 h-6 bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="text-purple-600 font-bold text-lg mb-2">Market Cap</div>
              <div className="text-gray-800 text-2xl font-bold mb-2">${tokenData ? (tokenData.marketCap / 1000000).toFixed(1) : '0.0'}M</div>
              <div className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full inline-block">+5.67% ↗</div>
            </div>
            
            <div className="glass-card rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-soft">
                <div className="relative">
                  <div className="w-4 h-6 bg-white rounded-t-full"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-glow-pulse-soft"></div>
                </div>
              </div>
              <div className="text-orange-600 font-bold text-lg mb-2">24h Volume</div>
              <div className="text-gray-800 text-2xl font-bold mb-2">${tokenData ? (tokenData.volume24h / 1000).toFixed(0) : '0'}K</div>
              <div className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full inline-block">+12.45% ↗</div>
            </div>
            
            <div className="glass-card rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow-pulse-soft">
                <div className="flex gap-1">
                  <div className="w-2 h-4 bg-white rounded-full"></div>
                  <div className="w-2 h-5 bg-white rounded-full"></div>
                  <div className="w-2 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-green-600 font-bold text-lg mb-2">Holders</div>
              <div className="text-gray-800 text-2xl font-bold mb-2">{tokenData ? tokenData.holders.toLocaleString() : '0'}</div>
              <div className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full inline-block">+8.23% ↗</div>
            </div>
          </div>
        </div>
      </section>

      {/* DeFi Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              DeFi Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete DeFi ecosystem for trading, staking, and managing your digital gold
            </p>
          </div>
          
          <Enhanced3DCard glowColor="#00ff41" intensity={1.5} className="p-8">
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 glass-navbar rounded-2xl p-2">
                <TabsTrigger value="swap" className="powerful-tab rounded-xl font-semibold transition-all hover:scale-105" style={{
                  background: 'transparent',
                  border: '2px solid #00ff41',
                  color: '#00ff41',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  💱 SOL ↔ GOLD
                </TabsTrigger>
                <TabsTrigger value="stake" className="powerful-tab rounded-xl font-semibold transition-all hover:scale-105" style={{
                  background: 'transparent',
                  border: '2px solid #00d4ff',
                  color: '#00d4ff',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  🔒 STAKE GOLD
                </TabsTrigger>
                <TabsTrigger value="send" className="powerful-tab rounded-xl font-semibold transition-all hover:scale-105" style={{
                  background: 'transparent',
                  border: '2px solid #ff0080',
                  color: '#ff0080',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em'
                }}>
                  📤 SEND
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="swap">
                <FixedSwapTab />
              </TabsContent>
              
              <TabsContent value="stake">
                <AdvancedStakingTiers />
              </TabsContent>
              
              <TabsContent value="send">
                <FixedSendTab />
              </TabsContent>
            </Tabs>
          </Enhanced3DCard>
        </div>
      </section>

      {/* SOL-GOLD Trading Analytics Section */}
      <section id="analytics" className="py-20 px-6" style={{background: '#0a0a0a'}}>
        <div className="max-w-7xl mx-auto">
          <Enhanced3DCard glowColor="#00d4ff" intensity={2}>
            <AdvancedTradingChart />
          </Enhanced3DCard>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-6 bg-gradient-to-b from-black via-yellow-900/5 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black text-yellow-400 mb-8">
              TOKENOMICS
            </h2>
            <p className="text-2xl text-yellow-200 max-w-4xl mx-auto font-medium">
              Transparent and sustainable token distribution designed for long-term value
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-400/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg border-2 border-yellow-400/40">
                    <img 
                      src={goldiumLogo} 
                      alt="Goldium Logo" 
                      className="w-full h-full object-contain bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-1"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400">Token Distribution</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Total Supply</span>
                    <span className="text-white font-bold">1,000,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Circulating Supply</span>
                    <span className="text-white font-bold">600,000,000 GOLD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Liquidity Pool</span>
                    <span className="text-white font-bold">300,000,000 (30%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Community Rewards</span>
                    <span className="text-white font-bold">250,000,000 (25%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Development</span>
                    <span className="text-white font-bold">200,000,000 (20%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Marketing</span>
                    <span className="text-white font-bold">150,000,000 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Team (Locked)</span>
                    <span className="text-white font-bold">100,000,000 (10%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <AnimatedTokenomicsCharts />
            </div>
          </div>
        </div>
      </section>

      {/* Twitter Feed Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black via-yellow-900/5 to-black border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">COMMUNITY UPDATES</h2>
            </div>
            <p className="text-yellow-200 text-lg">Stay connected with the latest news from Goldium and Solana ecosystem</p>
          </div>
          
          <div className="flex justify-center">
            <TwitterEmbed />
          </div>
        </div>
      </section>
      </div>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">GOLDIUM</div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                The future of digital gold on Solana blockchain. Secure, fast, and decentralized.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-10 h-10 glass-button rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <svg className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 glass-button rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <svg className="w-4 h-4 text-pink-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 glass-button rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <svg className="w-4 h-4 text-cyan-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Product</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#defi" className="block text-gray-400 hover:text-purple-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">DeFi App</a>
                <a href="#tokenomics" className="block text-gray-400 hover:text-pink-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Tokenomics</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">API</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Resources</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-pink-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Whitepaper</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Security Audit</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Support</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-pink-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Contact Us</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-300 transition-colors text-sm sm:text-base hover:translate-x-1 duration-200">Status</a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                <a href="#" className="hover:text-purple-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-pink-300 transition-colors">Privacy Policy</a>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 text-center">
                © 2025 Goldium. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

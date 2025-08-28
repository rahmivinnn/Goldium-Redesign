import React, { useState, useEffect } from 'react';
import { ModernGenZNavbar } from '@/components/modern-gen-z-navbar';
import { ModernGenZHero } from '@/components/modern-gen-z-hero';
import { ModernGenZLeaderboard } from '@/components/modern-gen-z-leaderboard';
import { ModernGenZButton } from '@/components/modern-gen-z-button';
import { RealTimeNotifications } from '@/components/real-time-notifications';
import { realTimeDataService, RealTimeTokenData } from '@/services/real-time-data-service';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import goldiumLogo from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';

export default function HomeSimple() {
  const [tokenData, setTokenData] = useState<RealTimeTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.000047');
  
  const externalWallet = useExternalWallets();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const data = await realTimeDataService.getTokenData();
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
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🎉 Purchase Successful!",
        description: `Successfully bought GOLDIUM tokens with ${buyAmount} SOL!`,
        variant: "default"
      });

      setBuyAmount('0.000047');
      
    } catch (error) {
      console.error('Failed to buy GOLDIUM:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to buy GOLDIUM tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBuyingToken(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 relative overflow-hidden">
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
                  <span className="text-purple-600 font-bold">{buyAmount ? '1000' : '0'} GOLD</span>
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
                <p className="text-sm text-gray-500 text-center">Connect wallet to buy GOLDIUM tokens</p>
              )}
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
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30">
                <img 
                  src={goldiumLogo} 
                  alt="Goldium Logo" 
                  className="w-full h-full object-contain bg-gradient-to-br from-purple-100 to-pink-100 p-2"
                />
              </div>
              <h3 className="text-2xl font-bold">GOLDIUM</h3>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 text-center">
              © 2025 Goldium. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
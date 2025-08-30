import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, TrendingDown, Eye, Wifi } from 'lucide-react';
import { AnimatedCounter, NeonText } from './enhanced-3d-cards';

interface HUDData {
  solPrice: number;
  goldPrice: number;
  volume24h: number;
  marketCap: number;
  activeUsers: number;
  totalTransactions: number;
  networkStatus: 'online' | 'slow' | 'offline';
}

export const CyberpunkHUD: React.FC = () => {
  const [hudData, setHudData] = useState<HUDData>({
    solPrice: 98.45,
    goldPrice: 2147.83,
    volume24h: 2847392,
    marketCap: 47200000,
    activeUsers: 8947,
    totalTransactions: 294756,
    networkStatus: 'online'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHudData(prev => ({
        ...prev,
        solPrice: prev.solPrice + (Math.random() - 0.5) * 2,
        goldPrice: prev.goldPrice + (Math.random() - 0.5) * 50,
        volume24h: prev.volume24h + Math.floor((Math.random() - 0.5) * 10000),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 100),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getNetworkStatusColor = () => {
    switch (hudData.networkStatus) {
      case 'online': return '#00ff41';
      case 'slow': return '#ffff00';
      case 'offline': return '#ff0080';
      default: return '#cccccc';
    }
  };

  return (
    <>
      {/* Main HUD */}
      <div className="fixed top-20 right-4 z-40">
        <div 
          className="cyber-card p-4 cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(10, 10, 10, 0.95)',
            border: '2px solid #00ff41',
            borderRadius: '8px',
            backdropFilter: 'blur(20px)',
            minWidth: isExpanded ? '320px' : '200px',
            transform: isExpanded ? 'scale(1.05)' : 'scale(1)'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* HUD Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{
                background: getNetworkStatusColor(),
                boxShadow: `0 0 10px ${getNetworkStatusColor()}`
              }} />
              <NeonText size="sm" color="#00ff41">
                GOLDIUM HUD
              </NeonText>
            </div>
            
            <Eye className="w-4 h-4 text-green-400" />
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                SOL
              </span>
              <div className="text-sm font-bold text-green-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                <AnimatedCounter value={hudData.solPrice} decimals={2} prefix="$" />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                GOLD
              </span>
              <div className="text-sm font-bold text-blue-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                <AnimatedCounter value={hudData.goldPrice} decimals={2} prefix="$" />
              </div>
            </div>

            {isExpanded && (
              <>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      24h Volume
                    </span>
                    <div className="text-sm font-bold text-yellow-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      <AnimatedCounter value={hudData.volume24h / 1000000} decimals={2} prefix="$" suffix="M" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      Market Cap
                    </span>
                    <div className="text-sm font-bold text-purple-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      <AnimatedCounter value={hudData.marketCap / 1000000} decimals={1} prefix="$" suffix="M" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      Active Users
                    </span>
                    <div className="text-sm font-bold text-pink-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      <AnimatedCounter value={hudData.activeUsers} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      Total TXs
                    </span>
                    <div className="text-sm font-bold text-cyan-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      <AnimatedCounter value={hudData.totalTransactions} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Data stream animation */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
            <div 
              className="h-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
                animation: 'dataStream 3s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Network Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg" style={{
          background: 'rgba(10, 10, 10, 0.9)',
          border: `1px solid ${getNetworkStatusColor()}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Wifi className="w-4 h-4" style={{color: getNetworkStatusColor()}} />
          <span className="text-xs font-bold" style={{
            color: getNetworkStatusColor(),
            fontFamily: 'JetBrains Mono, monospace',
            textTransform: 'uppercase'
          }}>
            {hudData.networkStatus}
          </span>
        </div>
      </div>

      {/* Trading Activity Feed */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="cyber-card p-3 max-w-xs" style={{
          background: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid #333333',
          borderRadius: '8px',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-green-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Live Activity
            </span>
          </div>
          
          <div className="space-y-1 text-xs" style={{fontFamily: 'JetBrains Mono, monospace'}}>
            {[
              { user: 'CryptoWhale', action: 'Swapped 12.5 SOL → 268,586 GOLD', color: '#00ff41' },
              { user: 'DeFiMaster', action: 'Staked 50,000 GOLD (Gold Tier)', color: '#00d4ff' },
              { user: 'SolTrader', action: 'Sent 5.2 SOL to wallet', color: '#ff0080' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-2 p-1 rounded" style={{
                background: 'rgba(0, 0, 0, 0.3)'
              }}>
                <div className="w-1 h-1 rounded-full" style={{background: activity.color}} />
                <div className="flex-1">
                  <div className="text-white font-bold">{activity.user}</div>
                  <div className="text-gray-400 text-xs">{activity.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { Coins, Zap, Target, TrendingUp, Lock, Unlock, Calculator } from 'lucide-react';

interface FarmingPool {
  id: string;
  name: string;
  tokenPair: string;
  apy: number;
  tvl: number;
  dailyRewards: number;
  lockPeriod: number;
  userStaked: number;
  userRewards: number;
  multiplier: number;
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

const mockFarmingPools: FarmingPool[] = [
  {
    id: 'gold-sol',
    name: 'GOLD-SOL LP',
    tokenPair: 'GOLD/SOL',
    apy: 245.7,
    tvl: 1247892,
    dailyRewards: 847.32,
    lockPeriod: 0,
    userStaked: 1250.0,
    userRewards: 23.45,
    multiplier: 2.5,
    isActive: true,
    riskLevel: 'medium'
  },
  {
    id: 'gold-usdc',
    name: 'GOLD-USDC LP',
    tokenPair: 'GOLD/USDC',
    apy: 189.3,
    tvl: 892451,
    dailyRewards: 612.18,
    lockPeriod: 7,
    userStaked: 0,
    userRewards: 0,
    multiplier: 2.0,
    isActive: true,
    riskLevel: 'low'
  },
  {
    id: 'gold-eth',
    name: 'GOLD-ETH LP',
    tokenPair: 'GOLD/ETH',
    apy: 312.8,
    tvl: 567234,
    dailyRewards: 1024.67,
    lockPeriod: 14,
    userStaked: 500.0,
    userRewards: 8.92,
    multiplier: 3.0,
    isActive: true,
    riskLevel: 'high'
  },
  {
    id: 'gold-btc',
    name: 'GOLD-BTC LP',
    tokenPair: 'GOLD/BTC',
    apy: 425.2,
    tvl: 234567,
    dailyRewards: 456.78,
    lockPeriod: 30,
    userStaked: 0,
    userRewards: 0,
    multiplier: 4.0,
    isActive: true,
    riskLevel: 'high'
  }
];

export const YieldFarmingPools: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [calculatedRewards, setCalculatedRewards] = useState(0);
  const [totalTVL, setTotalTVL] = useState(0);
  const [totalUserStaked, setTotalUserStaked] = useState(0);

  useEffect(() => {
    const tvl = mockFarmingPools.reduce((sum, pool) => sum + pool.tvl, 0);
    const userStaked = mockFarmingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
    setTotalTVL(tvl);
    setTotalUserStaked(userStaked);
  }, []);

  const calculateRewards = (amount: number, pool: FarmingPool) => {
    const dailyRate = pool.apy / 365 / 100;
    return amount * dailyRate * pool.multiplier;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#00ff41';
      case 'medium': return '#ffff00';
      case 'high': return '#ff0080';
      default: return '#cccccc';
    }
  };

  const getRiskGlow = (risk: string) => {
    switch (risk) {
      case 'low': return 'rgba(0, 255, 65, 0.3)';
      case 'medium': return 'rgba(255, 255, 0, 0.3)';
      case 'high': return 'rgba(255, 0, 128, 0.3)';
      default: return 'rgba(204, 204, 204, 0.3)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Farming Overview */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333',
        borderRadius: '8px'
      }}>
        <h2 className="text-3xl font-bold mb-6" style={{
          background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
        }}>
          🌾 YIELD FARMING
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Value Locked', 
              value: `$${(totalTVL / 1000000).toFixed(2)}M`, 
              icon: Lock,
              color: '#00ff41'
            },
            { 
              label: 'Your Total Staked', 
              value: `$${(totalUserStaked * 2147.83).toFixed(0)}`, 
              icon: Coins,
              color: '#00d4ff'
            },
            { 
              label: 'Total Rewards Earned', 
              value: `${mockFarmingPools.reduce((sum, p) => sum + p.userRewards, 0).toFixed(2)} GOLD`, 
              icon: Target,
              color: '#ffff00'
            }
          ].map((stat, index) => (
            <div key={index} className="cyber-card p-4 text-center" style={{
              background: 'rgba(21, 21, 21, 0.95)',
              border: `1px solid ${stat.color}50`
            }}>
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-6 h-6" style={{color: stat.color}} />
              </div>
              <div className="text-sm text-gray-400 mb-1" style={{
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                fontSize: '0.7rem'
              }}>
                {stat.label}
              </div>
              <div className="text-xl font-bold" style={{
                color: stat.color,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 5px ${stat.color}50`
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farming Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockFarmingPools.map((pool) => (
          <div key={pool.id} className="cyber-card p-6 hover:border-green-400 transition-all duration-300" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: `2px solid ${selectedPool === pool.id ? '#00ff41' : '#333333'}`,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
          >
            {/* Pool Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
                  border: '2px solid #00ff41'
                }}>
                  <Coins className="w-6 h-6 text-black" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white" style={{
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase'
                  }}>
                    {pool.name}
                  </h3>
                  <p className="text-sm text-gray-400" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {pool.tokenPair}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold" style={{
                  color: '#00ff41',
                  fontFamily: 'JetBrains Mono, monospace',
                  textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
                }}>
                  {pool.apy.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  APY
                </div>
              </div>
            </div>

            {/* Pool Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  TVL
                </div>
                <div className="text-lg font-bold text-blue-400" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  ${(pool.tvl / 1000).toFixed(0)}K
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  Daily Rewards
                </div>
                <div className="text-lg font-bold text-yellow-400" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {pool.dailyRewards.toFixed(0)} GOLD
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  Risk Level:
                </span>
                <span className="px-2 py-1 rounded text-xs font-bold" style={{
                  background: getRiskGlow(pool.riskLevel),
                  color: getRiskColor(pool.riskLevel),
                  border: `1px solid ${getRiskColor(pool.riskLevel)}`,
                  fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase'
                }}>
                  {pool.riskLevel}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  Multiplier:
                </span>
                <span className="text-sm font-bold text-purple-400" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {pool.multiplier}x
                </span>
              </div>
            </div>

            {/* User Position */}
            {pool.userStaked > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-1" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Your Staked
                    </div>
                    <div className="text-lg font-bold text-green-400" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {pool.userStaked.toFixed(2)} LP
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-400 mb-1" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Pending Rewards
                    </div>
                    <div className="text-lg font-bold text-yellow-400" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {pool.userRewards.toFixed(2)} GOLD
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expanded Pool Details */}
            {selectedPool === pool.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                {/* Stake/Unstake Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm text-gray-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Stake Amount (LP Tokens)
                    </label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => {
                        setStakeAmount(e.target.value);
                        const amount = parseFloat(e.target.value) || 0;
                        setCalculatedRewards(calculateRewards(amount, pool));
                      }}
                      placeholder="0.00"
                      className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:border-green-400 focus:outline-none"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        background: '#0a0a0a',
                        border: '2px solid #333333'
                      }}
                    />
                    
                    {stakeAmount && (
                      <div className="text-xs text-gray-400" style={{
                        fontFamily: 'JetBrains Mono, monospace'
                      }}>
                        Daily Rewards: ~{calculatedRewards.toFixed(4)} GOLD
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Pool Details
                    </div>
                    
                    <div className="space-y-2 text-xs" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lock Period:</span>
                        <span className="text-white">{pool.lockPeriod === 0 ? 'No Lock' : `${pool.lockPeriod} days`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Multiplier:</span>
                        <span className="text-purple-400">{pool.multiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Stake:</span>
                        <span className="text-white">0.01 LP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Harvest Fee:</span>
                        <span className="text-white">0.5%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="cyber-button-primary py-3 px-4 transition-all duration-300" style={{
                    background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
                    border: '2px solid #00ff41',
                    color: '#0a0a0a',
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase',
                    borderRadius: '4px'
                  }}>
                    <Zap className="w-4 h-4 inline mr-2" />
                    Stake
                  </button>
                  
                  {pool.userStaked > 0 && (
                    <>
                      <button className="cyber-button py-3 px-4 transition-all duration-300" style={{
                        background: 'transparent',
                        border: '2px solid #ff0080',
                        color: '#ff0080',
                        fontFamily: 'Orbitron, monospace',
                        textTransform: 'uppercase',
                        borderRadius: '4px'
                      }}>
                        <Unlock className="w-4 h-4 inline mr-2" />
                        Unstake
                      </button>
                      
                      <button className="cyber-button py-3 px-4 transition-all duration-300" style={{
                        background: 'transparent',
                        border: '2px solid #ffff00',
                        color: '#ffff00',
                        fontFamily: 'Orbitron, monospace',
                        textTransform: 'uppercase',
                        borderRadius: '4px'
                      }}>
                        <Target className="w-4 h-4 inline mr-2" />
                        Harvest
                      </button>
                    </>
                  )}
                </div>

                {/* Rewards Calculator */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calculator className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-bold text-purple-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Rewards Calculator
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    <div>
                      <div className="text-gray-400">Daily APY:</div>
                      <div className="text-green-400">{(pool.apy / 365).toFixed(3)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Weekly APY:</div>
                      <div className="text-green-400">{(pool.apy / 52).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Monthly APY:</div>
                      <div className="text-green-400">{(pool.apy / 12).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Yearly APY:</div>
                      <div className="text-green-400">{pool.apy.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Farming Analytics */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase'
        }}>
          📊 FARMING ANALYTICS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Best APY', value: `${Math.max(...mockFarmingPools.map(p => p.apy)).toFixed(1)}%`, color: '#00ff41' },
            { label: 'Active Pools', value: mockFarmingPools.filter(p => p.isActive).length.toString(), color: '#00d4ff' },
            { label: 'Total Multiplier', value: `${mockFarmingPools.reduce((sum, p) => sum + p.multiplier, 0).toFixed(1)}x`, color: '#8000ff' },
            { label: 'Avg Lock Period', value: `${(mockFarmingPools.reduce((sum, p) => sum + p.lockPeriod, 0) / mockFarmingPools.length).toFixed(0)} days`, color: '#ff4000' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-3 rounded-lg" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid #333333'
            }}>
              <div className="text-lg font-bold mb-1" style={{
                color: stat.color,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 5px ${stat.color}50`
              }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400" style={{
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
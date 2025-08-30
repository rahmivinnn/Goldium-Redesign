import React, { useState, useEffect } from 'react';
import { Crown, Diamond, Star, Zap, Lock, Unlock, Gift, Calculator, TrendingUp } from 'lucide-react';

interface StakingTier {
  id: string;
  name: string;
  minStake: number;
  apy: number;
  lockPeriod: number;
  multiplier: number;
  benefits: string[];
  userStaked: number;
  userRewards: number;
  isUnlocked: boolean;
  nextTierRequirement?: number;
  icon: React.ComponentType<any>;
  color: string;
  glowColor: string;
}

interface StakingStats {
  totalStaked: number;
  totalRewards: number;
  averageAPY: number;
  stakingRatio: number;
}

export const AdvancedStakingTiers: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [calculatedRewards, setCalculatedRewards] = useState(0);

  const [stakingTiers] = useState<StakingTier[]>([
    {
      id: 'bronze',
      name: 'Bronze Staker',
      minStake: 100,
      apy: 12.5,
      lockPeriod: 0,
      multiplier: 1.0,
      benefits: ['Basic staking rewards', 'Community access', 'Monthly airdrops'],
      userStaked: 250,
      userRewards: 3.47,
      isUnlocked: true,
      nextTierRequirement: 1000,
      icon: Star,
      color: '#cd7f32',
      glowColor: 'rgba(205, 127, 50, 0.3)'
    },
    {
      id: 'silver',
      name: 'Silver Guardian',
      minStake: 1000,
      apy: 18.7,
      lockPeriod: 7,
      multiplier: 1.5,
      benefits: ['Enhanced rewards', 'Priority support', 'Exclusive events', 'Governance voting'],
      userStaked: 1500,
      userRewards: 12.89,
      isUnlocked: true,
      nextTierRequirement: 5000,
      icon: Diamond,
      color: '#c0c0c0',
      glowColor: 'rgba(192, 192, 192, 0.3)'
    },
    {
      id: 'gold',
      name: 'Gold Sovereign',
      minStake: 5000,
      apy: 25.3,
      lockPeriod: 14,
      multiplier: 2.0,
      benefits: ['Premium rewards', 'VIP support', 'Early access', 'Proposal creation', 'Revenue sharing'],
      userStaked: 0,
      userRewards: 0,
      isUnlocked: false,
      nextTierRequirement: 10000,
      icon: Crown,
      color: '#ffd700',
      glowColor: 'rgba(255, 215, 0, 0.3)'
    },
    {
      id: 'platinum',
      name: 'Platinum Elite',
      minStake: 10000,
      apy: 35.8,
      lockPeriod: 30,
      multiplier: 3.0,
      benefits: ['Maximum rewards', 'White-glove service', 'Alpha access', 'Treasury voting', 'Profit sharing', 'Custom features'],
      userStaked: 0,
      userRewards: 0,
      isUnlocked: false,
      icon: Zap,
      color: '#e5e4e2',
      glowColor: 'rgba(229, 228, 226, 0.3)'
    }
  ]);

  const [stats] = useState<StakingStats>({
    totalStaked: stakingTiers.reduce((sum, tier) => sum + tier.userStaked, 0),
    totalRewards: stakingTiers.reduce((sum, tier) => sum + tier.userRewards, 0),
    averageAPY: 18.9,
    stakingRatio: 67.8
  });

  const calculateDailyRewards = (amount: number, tier: StakingTier) => {
    const dailyRate = (tier.apy / 365 / 100) * tier.multiplier;
    return amount * dailyRate;
  };

  const getCurrentTier = () => {
    const totalStaked = stats.totalStaked;
    return stakingTiers.reverse().find(tier => totalStaked >= tier.minStake) || stakingTiers[0];
  };

  const getNextTier = () => {
    const totalStaked = stats.totalStaked;
    return stakingTiers.find(tier => totalStaked < tier.minStake);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
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
          🔒 GOLD STAKING TIERS
        </h2>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Staked', value: `${stats.totalStaked.toLocaleString()} GOLD`, color: '#00ff41' },
            { label: 'Total Rewards', value: `${stats.totalRewards.toFixed(2)} GOLD`, color: '#ffff00' },
            { label: 'Average APY', value: `${stats.averageAPY}%`, color: '#00d4ff' },
            { label: 'Current Tier', value: currentTier.name, color: currentTier.color }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-lg" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: `1px solid ${stat.color}50`
            }}>
              <div className="text-xl font-bold mb-1" style={{
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

        {/* Tier Progress */}
        {nextTier && (
          <div className="cyber-card p-4 mb-6" style={{
            background: 'rgba(0, 255, 65, 0.05)',
            border: '1px solid rgba(0, 255, 65, 0.3)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-green-400" style={{
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}>
                Progress to {nextTier.name}
              </span>
              <span className="text-xs text-gray-400" style={{
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {stats.totalStaked.toLocaleString()} / {nextTier.minStake.toLocaleString()} GOLD
              </span>
            </div>
            
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 rounded-full"
                style={{
                  width: `${Math.min((stats.totalStaked / nextTier.minStake) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #00ff41 0%, #00d4ff 100%)',
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Staking Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stakingTiers.map((tier) => {
          const IconComponent = tier.icon;
          const isCurrentTier = currentTier.id === tier.id;
          
          return (
            <div key={tier.id} className={`cyber-card p-6 cursor-pointer transition-all duration-300 ${
              isCurrentTier ? 'scale-105' : 'hover:scale-105'
            }`} style={{
              background: isCurrentTier ? tier.glowColor : 'rgba(21, 21, 21, 0.95)',
              border: `2px solid ${isCurrentTier ? tier.color : (tier.isUnlocked ? '#333333' : '#666666')}`,
              borderRadius: '8px',
              opacity: tier.isUnlocked ? 1 : 0.7,
              boxShadow: isCurrentTier ? `0 0 20px ${tier.glowColor}` : 'none'
            }}
            onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
            >
              {/* Tier Header */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}80 100%)`,
                  border: `2px solid ${tier.color}`,
                  boxShadow: `0 0 15px ${tier.glowColor}`
                }}>
                  <IconComponent className="w-8 h-8" style={{
                    color: tier.id === 'bronze' || tier.id === 'gold' ? '#000000' : '#ffffff'
                  }} />
                </div>
                
                <h3 className="text-lg font-bold mb-1" style={{
                  color: tier.color,
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  textShadow: `0 0 5px ${tier.glowColor}`
                }}>
                  {tier.name}
                </h3>
                
                <div className="text-xs text-gray-400" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  Min: {tier.minStake.toLocaleString()} GOLD
                </div>
              </div>

              {/* Tier Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400" style={{fontFamily: 'Orbitron, monospace'}}>APY</span>
                  <span className="font-bold" style={{
                    color: tier.color,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {tier.apy}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400" style={{fontFamily: 'Orbitron, monospace'}}>Lock Period</span>
                  <span className="font-bold text-white" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {tier.lockPeriod === 0 ? 'Flexible' : `${tier.lockPeriod} days`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400" style={{fontFamily: 'Orbitron, monospace'}}>Multiplier</span>
                  <span className="font-bold text-purple-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {tier.multiplier}x
                  </span>
                </div>
              </div>

              {/* User Position */}
              {tier.userStaked > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-1" style={{fontFamily: 'Orbitron, monospace'}}>
                    Your Position
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-green-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      {tier.userStaked.toLocaleString()} GOLD
                    </span>
                    <span className="text-sm font-bold text-yellow-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      +{tier.userRewards.toFixed(2)} Rewards
                    </span>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  Benefits
                </div>
                <div className="space-y-1">
                  {tier.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="text-xs text-gray-300 flex items-center space-x-2" style={{
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      <div className="w-1 h-1 rounded-full" style={{background: tier.color}} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                  {tier.benefits.length > 3 && (
                    <div className="text-xs text-gray-500" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      +{tier.benefits.length - 3} more benefits
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {tier.isUnlocked ? (
                  <button className="w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 hover:scale-105" style={{
                    background: tier.userStaked > 0 ? 'transparent' : `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}80 100%)`,
                    border: `2px solid ${tier.color}`,
                    color: tier.userStaked > 0 ? tier.color : (tier.id === 'bronze' || tier.id === 'gold' ? '#000000' : '#ffffff'),
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}>
                    {tier.userStaked > 0 ? (
                      <>
                        <Unlock className="w-3 h-3 inline mr-1" />
                        Manage
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 inline mr-1" />
                        Stake Now
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-2 px-4 rounded-lg text-center" style={{
                    background: 'rgba(102, 102, 102, 0.2)',
                    border: '2px solid #666666',
                    color: '#666666',
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}>
                    🔒 Locked
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {selectedTier === tier.id && tier.isUnlocked && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                  {/* Staking Calculator */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      Calculate Rewards
                    </label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => {
                        setStakeAmount(e.target.value);
                        const amount = parseFloat(e.target.value) || 0;
                        setCalculatedRewards(calculateDailyRewards(amount, tier));
                      }}
                      placeholder="Enter amount"
                      className="w-full p-2 rounded text-sm"
                      style={{
                        background: '#0a0a0a',
                        border: '1px solid #333333',
                        color: '#ffffff',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    />
                    
                    {stakeAmount && (
                      <div className="text-xs space-y-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Daily Rewards:</span>
                          <span className="text-green-400">{calculatedRewards.toFixed(4)} GOLD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Rewards:</span>
                          <span className="text-green-400">{(calculatedRewards * 30).toFixed(2)} GOLD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Yearly Rewards:</span>
                          <span className="text-green-400">{(calculatedRewards * 365).toFixed(0)} GOLD</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* All Benefits */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400" style={{
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      All Benefits
                    </div>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="text-xs text-gray-300 flex items-center space-x-2" style={{
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          <Gift className="w-3 h-3" style={{color: tier.color}} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 px-3 rounded text-xs font-bold transition-all duration-300" style={{
                      background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}80 100%)`,
                      border: `2px solid ${tier.color}`,
                      color: tier.id === 'bronze' || tier.id === 'gold' ? '#000000' : '#ffffff',
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase'
                    }}>
                      <Zap className="w-3 h-3 inline mr-1" />
                      Stake
                    </button>
                    
                    {tier.userStaked > 0 && (
                      <button className="py-2 px-3 rounded text-xs font-bold transition-all duration-300" style={{
                        background: 'transparent',
                        border: '2px solid #ff0080',
                        color: '#ff0080',
                        fontFamily: 'Orbitron, monospace',
                        textTransform: 'uppercase'
                      }}>
                        <Unlock className="w-3 h-3 inline mr-1" />
                        Unstake
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Staking Analytics */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase'
        }}>
          📊 Staking Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rewards Distribution */}
          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(0, 255, 65, 0.1)',
            border: '1px solid rgba(0, 255, 65, 0.3)'
          }}>
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400 mb-1" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {((stats.totalRewards / stats.totalStaked) * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Rewards Ratio
            </div>
          </div>

          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-lg font-bold text-blue-400 mb-1" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              ${(stats.totalStaked * 2147.83).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              USD Value
            </div>
          </div>

          <div className="text-center p-4 rounded-lg" style={{
            background: 'rgba(255, 255, 0, 0.1)',
            border: '1px solid rgba(255, 255, 0, 0.3)'
          }}>
            <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-lg font-bold text-yellow-400 mb-1" style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {stakingTiers.findIndex(t => t.id === currentTier.id) + 1}/4
            </div>
            <div className="text-xs text-gray-400" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Tier Rank
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
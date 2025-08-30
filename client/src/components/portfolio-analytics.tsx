import React, { useState, useEffect } from 'react';
import { PieChart, BarChart3, TrendingUp, TrendingDown, DollarSign, Percent, Eye, Calendar } from 'lucide-react';

interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  changePercent24h: number;
  allocation: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  totalPnL: number;
  totalPnLPercent: number;
  bestPerformer: string;
  worstPerformer: string;
}

export const PortfolioAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('24h');
  const [viewType, setViewType] = useState<'overview' | 'assets' | 'performance'>('overview');
  
  const [portfolio] = useState<PortfolioAsset[]>([
    {
      symbol: 'GOLD',
      name: 'Goldium Token',
      balance: 1247.83,
      value: 2678945.23,
      change24h: +234.56,
      changePercent24h: +8.75,
      allocation: 65.2
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: 45.67,
      value: 8932.45,
      change24h: -123.45,
      changePercent24h: -1.36,
      allocation: 21.8
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 5000.00,
      value: 5000.00,
      change24h: 0,
      changePercent24h: 0,
      allocation: 12.2
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 0.89,
      value: 2847.92,
      change24h: +45.67,
      changePercent24h: +1.63,
      allocation: 0.8
    }
  ]);

  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalChange24h: 0,
    totalChangePercent24h: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    bestPerformer: '',
    worstPerformer: ''
  });

  useEffect(() => {
    const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
    const totalChange24h = portfolio.reduce((sum, asset) => sum + asset.change24h, 0);
    const totalChangePercent24h = (totalChange24h / (totalValue - totalChange24h)) * 100;
    
    const bestPerformer = portfolio.reduce((best, asset) => 
      asset.changePercent24h > best.changePercent24h ? asset : best
    );
    
    const worstPerformer = portfolio.reduce((worst, asset) => 
      asset.changePercent24h < worst.changePercent24h ? asset : worst
    );

    setMetrics({
      totalValue,
      totalChange24h,
      totalChangePercent24h,
      totalPnL: totalChange24h * 7, // Mock 7-day PnL
      totalPnLPercent: totalChangePercent24h * 1.2, // Mock PnL percentage
      bestPerformer: bestPerformer.symbol,
      worstPerformer: worstPerformer.symbol
    });
  }, [portfolio]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333',
        borderRadius: '8px'
      }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{
            background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
          }}>
            📊 Portfolio Analytics
          </h2>

          {/* View Type Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {(['overview', 'assets', 'performance'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-4 py-2 text-xs font-medium rounded transition-all ${
                  viewType === type 
                    ? 'bg-green-500 text-black' 
                    : 'text-gray-400 hover:text-green-400'
                }`}
                style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Total Value
            </div>
            <div className="text-3xl font-bold" style={{
              color: '#00ff41',
              fontFamily: 'JetBrains Mono, monospace',
              textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
            }}>
              {formatCurrency(metrics.totalValue)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              24h Change
            </div>
            <div className={`text-2xl font-bold flex items-center justify-center space-x-1`} style={{
              color: metrics.totalChange24h >= 0 ? '#00ff41' : '#ff0080',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {metrics.totalChange24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{metrics.totalChange24h >= 0 ? '+' : ''}{formatCurrency(metrics.totalChange24h)}</span>
            </div>
            <div className={`text-sm`} style={{
              color: metrics.totalChangePercent24h >= 0 ? '#00ff41' : '#ff0080',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              ({metrics.totalChangePercent24h >= 0 ? '+' : ''}{metrics.totalChangePercent24h.toFixed(2)}%)
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Total P&L
            </div>
            <div className={`text-2xl font-bold`} style={{
              color: metrics.totalPnL >= 0 ? '#00ff41' : '#ff0080',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {metrics.totalPnL >= 0 ? '+' : ''}{formatCurrency(metrics.totalPnL)}
            </div>
            <div className={`text-sm`} style={{
              color: metrics.totalPnLPercent >= 0 ? '#00ff41' : '#ff0080',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              ({metrics.totalPnLPercent >= 0 ? '+' : ''}{metrics.totalPnLPercent.toFixed(2)}%)
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              Best Performer
            </div>
            <div className="text-2xl font-bold text-yellow-400" style={{
              fontFamily: 'JetBrains Mono, monospace',
              textShadow: '0 0 5px rgba(255, 255, 0, 0.5)'
            }}>
              {metrics.bestPerformer}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown */}
      {viewType === 'assets' && (
        <div className="cyber-card p-6" style={{
          background: 'rgba(21, 21, 21, 0.95)',
          border: '2px solid #333333'
        }}>
          <h3 className="text-xl font-bold mb-4" style={{
            color: '#ffffff',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase'
          }}>
            💰 Asset Breakdown
          </h3>

          <div className="space-y-4">
            {portfolio.map((asset, index) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-800/50 transition-colors" style={{
                border: '1px solid #333333',
                background: 'rgba(10, 10, 10, 0.5)'
              }}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{
                    background: `linear-gradient(135deg, ${['#00ff41', '#00d4ff', '#ffff00', '#ff0080'][index]} 0%, ${['#00d4ff', '#8000ff', '#ff4000', '#8000ff'][index]} 100%)`,
                    color: '#0a0a0a'
                  }}>
                    {asset.symbol.slice(0, 2)}
                  </div>
                  
                  <div>
                    <div className="font-bold text-white" style={{fontFamily: 'Orbitron, monospace'}}>
                      {asset.name}
                    </div>
                    <div className="text-sm text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      {asset.balance.toFixed(2)} {asset.symbol}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-lg" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {formatCurrency(asset.value)}
                  </div>
                  <div className={`text-sm flex items-center space-x-1`} style={{
                    color: asset.changePercent24h >= 0 ? '#00ff41' : '#ff0080',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {asset.changePercent24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400" style={{fontFamily: 'Orbitron, monospace'}}>
                    {asset.allocation.toFixed(1)}%
                  </div>
                  <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${asset.allocation}%`,
                        background: `linear-gradient(90deg, ${['#00ff41', '#00d4ff', '#ffff00', '#ff0080'][index]} 0%, ${['#00d4ff', '#8000ff', '#ff4000', '#8000ff'][index]} 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {viewType === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '2px solid #333333'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ffffff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              📈 Performance Chart
            </h3>

            <div className="h-64 flex items-center justify-center rounded-lg" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid #333333'
            }}>
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <div className="text-green-400" style={{fontFamily: 'Orbitron, monospace'}}>
                  INTERACTIVE CHART
                </div>
                <div className="text-xs text-gray-400 mt-2" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                  Real-time portfolio performance tracking
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '2px solid #333333'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ffffff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              ⚠️ Risk Analysis
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Portfolio Beta', value: '1.24', color: '#ffff00', description: 'Volatility vs market' },
                { label: 'Sharpe Ratio', value: '2.18', color: '#00ff41', description: 'Risk-adjusted returns' },
                { label: 'Max Drawdown', value: '-12.4%', color: '#ff0080', description: 'Worst decline period' },
                { label: 'Diversification', value: '78%', color: '#00d4ff', description: 'Portfolio spread' }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{
                  background: 'rgba(10, 10, 10, 0.5)',
                  border: '1px solid #333333'
                }}>
                  <div>
                    <div className="font-bold text-white" style={{fontFamily: 'Orbitron, monospace'}}>
                      {metric.label}
                    </div>
                    <div className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      {metric.description}
                    </div>
                  </div>
                  <div className="text-xl font-bold" style={{
                    color: metric.color,
                    fontFamily: 'JetBrains Mono, monospace',
                    textShadow: `0 0 5px ${metric.color}50`
                  }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Allocation Visualization */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Chart */}
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '2px solid #333333'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ffffff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              🥧 Allocation
            </h3>

            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                {portfolio.map((asset, index) => {
                  const radius = 80;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (asset.allocation / 100) * circumference;
                  const colors = ['#00ff41', '#00d4ff', '#ffff00', '#ff0080'];
                  
                  return (
                    <circle
                      key={asset.symbol}
                      cx="96"
                      cy="96"
                      r={radius - index * 15}
                      fill="transparent"
                      stroke={colors[index]}
                      strokeWidth="12"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000"
                      style={{
                        filter: `drop-shadow(0 0 5px ${colors[index]}50)`
                      }}
                    />
                  );
                })}
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {formatCurrency(metrics.totalValue)}
                  </div>
                  <div className="text-xs text-gray-400" style={{fontFamily: 'Orbitron, monospace'}}>
                    TOTAL
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {portfolio.map((asset, index) => (
                <div key={asset.symbol} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{background: ['#00ff41', '#00d4ff', '#ffff00', '#ff0080'][index]}}
                    />
                    <span className="text-white" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                      {asset.symbol}
                    </span>
                  </div>
                  <span className="text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {asset.allocation.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '2px solid #333333'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ffffff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              🏆 Top Performers
            </h3>

            <div className="space-y-4">
              {portfolio
                .sort((a, b) => b.changePercent24h - a.changePercent24h)
                .map((asset, index) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg" style={{
                  background: index === 0 ? 'rgba(0, 255, 65, 0.1)' : 'rgba(10, 10, 10, 0.5)',
                  border: `1px solid ${index === 0 ? '#00ff41' : '#333333'}`
                }}>
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold" style={{
                      color: index === 0 ? '#ffff00' : '#cccccc',
                      fontFamily: 'Orbitron, monospace'
                    }}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                        {asset.symbol}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(asset.value)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-right`}>
                    <div className={`font-bold flex items-center space-x-1`} style={{
                      color: asset.changePercent24h >= 0 ? '#00ff41' : '#ff0080',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {asset.changePercent24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '2px solid #333333'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ffffff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase'
            }}>
              ⚡ Quick Actions
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Rebalance Portfolio', icon: BarChart3, color: '#00ff41' },
                { label: 'Auto-Compound', icon: TrendingUp, color: '#00d4ff' },
                { label: 'Stop Loss Setup', icon: Eye, color: '#ff0080' },
                { label: 'Tax Report', icon: Calendar, color: '#8000ff' }
              ].map((action, index) => (
                <button key={index} className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:scale-105" style={{
                  background: 'transparent',
                  border: `2px solid ${action.color}`,
                  color: action.color,
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem'
                }}>
                  <action.icon className="w-5 h-5" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
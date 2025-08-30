import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export const AdvancedTradingChart: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(2147.83);
  const [priceChange, setPriceChange] = useState(+12.45);
  const [priceChangePercent, setPriceChangePercent] = useState(+0.58);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('15m');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mock order book data
  const [buyOrders] = useState<OrderBookEntry[]>([
    { price: 2147.50, amount: 1.25, total: 2684.38 },
    { price: 2147.25, amount: 2.10, total: 4509.23 },
    { price: 2147.00, amount: 0.85, total: 1824.95 },
    { price: 2146.75, amount: 3.20, total: 6869.60 },
    { price: 2146.50, amount: 1.90, total: 4078.35 },
  ]);
  
  const [sellOrders] = useState<OrderBookEntry[]>([
    { price: 2148.00, amount: 0.95, total: 2040.60 },
    { price: 2148.25, amount: 1.75, total: 3759.44 },
    { price: 2148.50, amount: 2.30, total: 4941.55 },
    { price: 2148.75, amount: 1.15, total: 2471.06 },
    { price: 2149.00, amount: 0.80, total: 1719.20 },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setCurrentPrice(prev => {
        const newPrice = prev + change;
        const changeAmount = newPrice - prev;
        setPriceChange(changeAmount);
        setPriceChangePercent((changeAmount / prev) * 100);
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Draw trading chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < canvas.offsetWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.offsetHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < canvas.offsetHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.offsetWidth, y);
      ctx.stroke();
    }

    // Generate mock price data
    const dataPoints = 50;
    const priceData: number[] = [];
    let basePrice = currentPrice;
    
    for (let i = 0; i < dataPoints; i++) {
      basePrice += (Math.random() - 0.5) * 20;
      priceData.push(basePrice);
    }

    // Draw price line
    ctx.strokeStyle = priceChange >= 0 ? '#00ff41' : '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const stepX = canvas.offsetWidth / (dataPoints - 1);
    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    const priceRange = maxPrice - minPrice;

    priceData.forEach((price, index) => {
      const x = index * stepX;
      const y = canvas.offsetHeight - ((price - minPrice) / priceRange) * (canvas.offsetHeight - 40) - 20;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw glow effect
    ctx.shadowColor = priceChange >= 0 ? '#00ff41' : '#ff0080';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [currentPrice, priceChange, chartType]);

  return (
    <div className="cyber-card p-6" style={{
      background: 'rgba(21, 21, 21, 0.95)',
      border: '2px solid #333333',
      borderRadius: '8px',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold" style={{
            color: '#ffffff',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            GOLD/USD
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="cyber-data-large" style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: '#00ff41',
              textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
            }}>
              ${currentPrice.toFixed(2)}
            </span>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
              priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`} style={{
              border: `1px solid ${priceChange >= 0 ? '#00ff41' : '#ff0080'}`,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem'
            }}>
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}</span>
              <span>({priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center space-x-2">
          {/* Timeframe Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  timeframe === tf 
                    ? 'bg-green-500 text-black' 
                    : 'text-gray-400 hover:text-green-400'
                }`}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase'
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { type: 'candlestick' as const, icon: BarChart3 },
              { type: 'line' as const, icon: Activity },
              { type: 'area' as const, icon: TrendingUp }
            ].map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`p-2 rounded transition-all ${
                  chartType === type 
                    ? 'bg-green-500 text-black' 
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-96 mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
          style={{
            background: 'rgba(10, 10, 10, 0.8)',
            border: '1px solid #333333'
          }}
        />
        
        {/* Chart Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/80 p-3 rounded-lg" style={{
          border: '1px solid #333333',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="text-xs text-gray-400 mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>
            VOLUME (24H)
          </div>
          <div className="text-lg font-bold text-green-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
            $2,847,392
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg" style={{
          border: '1px solid #333333',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="text-xs text-gray-400 mb-1" style={{fontFamily: 'JetBrains Mono, monospace'}}>
            MARKET CAP
          </div>
          <div className="text-lg font-bold text-blue-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
            $47.2M
          </div>
        </div>
      </div>

      {/* Order Book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy Orders */}
        <div className="cyber-card p-4" style={{
          background: 'rgba(0, 255, 65, 0.05)',
          border: '1px solid rgba(0, 255, 65, 0.3)'
        }}>
          <h3 className="text-lg font-bold mb-4 text-green-400" style={{
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            📈 BUY ORDERS
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 pb-2 border-b border-gray-700" style={{
              fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'uppercase'
            }}>
              <div>PRICE (USD)</div>
              <div>AMOUNT (GOLD)</div>
              <div>TOTAL (USD)</div>
            </div>
            
            {buyOrders.map((order, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm hover:bg-green-500/10 p-2 rounded transition-colors" style={{
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <div className="text-green-400">${order.price.toFixed(2)}</div>
                <div className="text-white">{order.amount.toFixed(2)}</div>
                <div className="text-gray-300">${order.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sell Orders */}
        <div className="cyber-card p-4" style={{
          background: 'rgba(255, 0, 128, 0.05)',
          border: '1px solid rgba(255, 0, 128, 0.3)'
        }}>
          <h3 className="text-lg font-bold mb-4 text-pink-400" style={{
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            📉 SELL ORDERS
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 pb-2 border-b border-gray-700" style={{
              fontFamily: 'JetBrains Mono, monospace',
              textTransform: 'uppercase'
            }}>
              <div>PRICE (USD)</div>
              <div>AMOUNT (GOLD)</div>
              <div>TOTAL (USD)</div>
            </div>
            
            {sellOrders.map((order, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm hover:bg-pink-500/10 p-2 rounded transition-colors" style={{
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <div className="text-pink-400">${order.price.toFixed(2)}</div>
                <div className="text-white">{order.amount.toFixed(2)}</div>
                <div className="text-gray-300">${order.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: '24h High', value: '$2,189.45', color: '#00ff41' },
          { label: '24h Low', value: '$2,098.32', color: '#ff0080' },
          { label: '24h Volume', value: '1,247 GOLD', color: '#00d4ff' },
          { label: 'Circulating', value: '850K GOLD', color: '#8000ff' }
        ].map((stat, index) => (
          <div key={index} className="cyber-card p-3 text-center" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '1px solid #333333'
          }}>
            <div className="text-xs text-gray-400 mb-1" style={{
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {stat.label}
            </div>
            <div className="text-lg font-bold" style={{
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
  );
};
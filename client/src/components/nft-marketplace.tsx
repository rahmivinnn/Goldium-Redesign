import React, { useState, useEffect } from 'react';
import { Image, Zap, Crown, Star, Filter, Search, Grid, List, Flame, Diamond } from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: { trait: string; value: string; rarity: number }[];
  owner: string;
  isListed: boolean;
  lastSale?: number;
  floorPrice: number;
  volume24h: number;
}

interface Collection {
  name: string;
  floorPrice: number;
  volume24h: number;
  change24h: number;
  totalItems: number;
  owners: number;
}

export const NFTMarketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'recent'>('price');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [collections] = useState<Collection[]>([
    {
      name: 'Goldium Genesis',
      floorPrice: 12.5,
      volume24h: 247.8,
      change24h: +15.7,
      totalItems: 10000,
      owners: 3247
    },
    {
      name: 'Cyber Warriors',
      floorPrice: 8.9,
      volume24h: 189.4,
      change24h: -3.2,
      totalItems: 5000,
      owners: 1892
    },
    {
      name: 'DeFi Legends',
      floorPrice: 25.7,
      volume24h: 456.2,
      change24h: +28.9,
      totalItems: 2500,
      owners: 1456
    }
  ]);

  const [nfts] = useState<NFTItem[]>([
    {
      id: 'nft-001',
      name: 'Golden Cyber Samurai #1247',
      collection: 'Goldium Genesis',
      image: '/api/placeholder/300/300',
      price: 15.7,
      rarity: 'legendary',
      attributes: [
        { trait: 'Background', value: 'Neon City', rarity: 2.1 },
        { trait: 'Weapon', value: 'Plasma Katana', rarity: 0.8 },
        { trait: 'Armor', value: 'Cyber Gold', rarity: 1.2 }
      ],
      owner: 'CryptoSamurai.sol',
      isListed: true,
      lastSale: 12.3,
      floorPrice: 12.5,
      volume24h: 47.8
    },
    {
      id: 'nft-002',
      name: 'Neon Guardian #892',
      collection: 'Cyber Warriors',
      image: '/api/placeholder/300/300',
      price: 9.4,
      rarity: 'epic',
      attributes: [
        { trait: 'Type', value: 'Guardian', rarity: 5.2 },
        { trait: 'Element', value: 'Lightning', rarity: 3.7 },
        { trait: 'Power Level', value: '9000+', rarity: 1.8 }
      ],
      owner: 'NeonCollector.sol',
      isListed: true,
      lastSale: 8.1,
      floorPrice: 8.9,
      volume24h: 23.4
    },
    {
      id: 'nft-003',
      name: 'DeFi Master #456',
      collection: 'DeFi Legends',
      image: '/api/placeholder/300/300',
      price: 28.9,
      rarity: 'legendary',
      attributes: [
        { trait: 'Class', value: 'Yield Farmer', rarity: 1.5 },
        { trait: 'Strategy', value: 'Multi-Pool', rarity: 0.9 },
        { trait: 'APY Boost', value: '500%', rarity: 0.3 }
      ],
      owner: 'DeFiWhale.sol',
      isListed: true,
      lastSale: 25.2,
      floorPrice: 25.7,
      volume24h: 89.6
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#cccccc';
      case 'rare': return '#00d4ff';
      case 'epic': return '#8000ff';
      case 'legendary': return '#ffff00';
      default: return '#cccccc';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rgba(204, 204, 204, 0.3)';
      case 'rare': return 'rgba(0, 212, 255, 0.3)';
      case 'epic': return 'rgba(128, 0, 255, 0.3)';
      case 'legendary': return 'rgba(255, 255, 0, 0.3)';
      default: return 'rgba(204, 204, 204, 0.3)';
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = filterRarity === 'all' || nft.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="space-y-6">
      {/* NFT Marketplace Header */}
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
          🎨 NFT Marketplace
        </h2>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Volume', value: '$1.2M', color: '#00ff41', icon: DollarSign },
            { label: 'Floor Price', value: '8.9 SOL', color: '#00d4ff', icon: Crown },
            { label: 'Active Listings', value: '2,847', color: '#ffff00', icon: Zap },
            { label: 'Unique Owners', value: '6,594', color: '#ff0080', icon: Star }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-lg" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: `1px solid ${stat.color}50`
            }}>
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-6 h-6" style={{color: stat.color}} />
              </div>
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
      </div>

      {/* Collections Overview */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase'
        }}>
          🏆 Top Collections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((collection, index) => (
            <div key={collection.name} className="cyber-card p-4 hover:border-green-400 transition-all duration-300" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid #333333',
              cursor: 'pointer'
            }}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${['#00ff41', '#00d4ff', '#ffff00'][index]} 0%, ${['#00d4ff', '#8000ff', '#ff4000'][index]} 100%)`,
                  border: `2px solid ${['#00ff41', '#00d4ff', '#ffff00'][index]}`
                }}>
                  <Image className="w-6 h-6 text-black" />
                </div>
                
                <div>
                  <div className="font-bold text-white" style={{fontFamily: 'Orbitron, monospace'}}>
                    {collection.name}
                  </div>
                  <div className="text-xs text-gray-400" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                    {collection.totalItems.toLocaleString()} items
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs" style={{fontFamily: 'JetBrains Mono, monospace'}}>
                <div>
                  <div className="text-gray-400">Floor Price</div>
                  <div className="text-green-400 font-bold">{collection.floorPrice} SOL</div>
                </div>
                <div>
                  <div className="text-gray-400">24h Volume</div>
                  <div className="text-blue-400 font-bold">{collection.volume24h} SOL</div>
                </div>
                <div>
                  <div className="text-gray-400">24h Change</div>
                  <div className={`font-bold ${collection.change24h >= 0 ? 'text-green-400' : 'text-pink-400'}`}>
                    {collection.change24h >= 0 ? '+' : ''}{collection.change24h}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Owners</div>
                  <div className="text-purple-400 font-bold">{collection.owners.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs or collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg transition-all focus:outline-none"
              style={{
                background: '#0a0a0a',
                border: '2px solid #333333',
                color: '#ffffff',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-4 py-2 rounded-lg"
              style={{
                background: '#0a0a0a',
                border: '2px solid #333333',
                color: '#ffffff',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg"
              style={{
                background: '#0a0a0a',
                border: '2px solid #333333',
                color: '#ffffff',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}
            >
              <option value="price">Price</option>
              <option value="rarity">Rarity</option>
              <option value="recent">Recent</option>
            </select>

            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredNFTs.map((nft) => (
          <div key={nft.id} className="cyber-card hover:scale-105 transition-all duration-300 cursor-pointer group" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: `2px solid ${getRarityColor(nft.rarity)}50`,
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* NFT Image */}
            <div className="relative aspect-square bg-gray-800 flex items-center justify-center">
              <Image className="w-24 h-24 text-gray-600" />
              
              {/* Rarity Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold" style={{
                background: getRarityGlow(nft.rarity),
                color: getRarityColor(nft.rarity),
                border: `1px solid ${getRarityColor(nft.rarity)}`,
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase'
              }}>
                {nft.rarity}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="cyber-button-primary py-2 px-4" style={{
                  background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
                  border: '2px solid #00ff41',
                  color: '#0a0a0a',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  borderRadius: '4px'
                }}>
                  <Zap className="w-4 h-4 inline mr-2" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* NFT Info */}
            <div className="p-4">
              <div className="mb-3">
                <h4 className="font-bold text-white mb-1" style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.9rem'
                }}>
                  {nft.name}
                </h4>
                <p className="text-xs text-gray-400" style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {nft.collection}
                </p>
              </div>

              {/* Price Info */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-400" style={{
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase'
                  }}>
                    Price
                  </div>
                  <div className="text-lg font-bold text-green-400" style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    textShadow: '0 0 5px rgba(0, 255, 65, 0.5)'
                  }}>
                    {nft.price} SOL
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400" style={{
                    fontFamily: 'Orbitron, monospace',
                    textTransform: 'uppercase'
                  }}>
                    Last Sale
                  </div>
                  <div className="text-sm text-gray-300" style={{
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {nft.lastSale} SOL
                  </div>
                </div>
              </div>

              {/* Attributes Preview */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400" style={{
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase'
                }}>
                  Key Traits
                </div>
                <div className="flex flex-wrap gap-1">
                  {nft.attributes.slice(0, 2).map((attr, index) => (
                    <span key={index} className="px-2 py-1 rounded text-xs" style={{
                      background: 'rgba(0, 255, 65, 0.1)',
                      border: '1px solid rgba(0, 255, 65, 0.3)',
                      color: '#00ff41',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      {attr.trait}: {attr.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="cyber-button py-2 px-3 text-xs transition-all duration-300" style={{
                  background: 'transparent',
                  border: '1px solid #00d4ff',
                  color: '#00d4ff',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  borderRadius: '4px'
                }}>
                  <Star className="w-3 h-3 inline mr-1" />
                  Favorite
                </button>
                
                <button className="cyber-button py-2 px-3 text-xs transition-all duration-300" style={{
                  background: 'transparent',
                  border: '1px solid #8000ff',
                  color: '#8000ff',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  borderRadius: '4px'
                }}>
                  <Filter className="w-3 h-3 inline mr-1" />
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Analytics */}
      <div className="cyber-card p-6" style={{
        background: 'rgba(21, 21, 21, 0.95)',
        border: '2px solid #333333'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{
          color: '#ffffff',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase'
        }}>
          📊 Market Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Avg Sale Price', value: '14.7 SOL', trend: '+12.4%', color: '#00ff41' },
            { label: 'Total Sales', value: '8,247', trend: '+8.9%', color: '#00d4ff' },
            { label: 'Active Traders', value: '1,892', trend: '+15.7%', color: '#ffff00' },
            { label: 'Royalty Earned', value: '247 SOL', trend: '+22.1%', color: '#8000ff' }
          ].map((metric, index) => (
            <div key={index} className="text-center p-4 rounded-lg" style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid #333333'
            }}>
              <div className="text-lg font-bold mb-1" style={{
                color: metric.color,
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: `0 0 5px ${metric.color}50`
              }}>
                {metric.value}
              </div>
              <div className="text-xs text-gray-400 mb-1" style={{
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase'
              }}>
                {metric.label}
              </div>
              <div className="text-xs text-green-400" style={{
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {metric.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
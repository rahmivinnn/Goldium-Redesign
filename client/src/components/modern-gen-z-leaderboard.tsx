import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Zap, 
  Flame as Fire,
  Heart,
  Users,
  Award,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly';

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  avatar: string;
  badges: string[];
  streak: number;
  totalVolume: string;
  winRate: number;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'CryptoKing👑',
    points: 15420,
    avatar: '🚀',
    badges: ['🏆', '💎', '🔥'],
    streak: 7,
    totalVolume: '$2.4M',
    winRate: 94.2
  },
  {
    rank: 2,
    username: 'DeFiQueen💫',
    points: 12890,
    avatar: '⭐',
    badges: ['🥈', '💎', '⚡'],
    streak: 5,
    totalVolume: '$1.8M',
    winRate: 91.7
  },
  {
    rank: 3,
    username: 'DiamondHands💎',
    points: 11750,
    avatar: '💎',
    badges: ['🥉', '🔥', '💪'],
    streak: 12,
    totalVolume: '$1.5M',
    winRate: 88.3
  },
  // More entries...
  ...Array.from({ length: 7 }, (_, i) => ({
    rank: i + 4,
    username: `Trader${i + 4}`,
    points: 10000 - (i * 500),
    avatar: ['🌟', '⚡', '🎯', '🎮', '🚀', '🌈', '🎪'][i],
    badges: ['🎖️'],
    streak: Math.floor(Math.random() * 10) + 1,
    totalVolume: `$${(Math.random() * 1000).toFixed(0)}K`,
    winRate: Math.random() * 30 + 70
  }))
];

export const ModernGenZLeaderboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1: return 'h-32';
      case 2: return 'h-24';
      case 3: return 'h-20';
      default: return 'h-16';
    }
  };

  const topThree = mockLeaderboardData.slice(0, 3);
  const otherEntries = mockLeaderboardData.slice(3);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 chainzoku-override" style={{background: '#0a0a0a'}}>
      {/* Header - Chainzoku Style */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Orbitron, monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
        }}>
          🏆 Trading Champions
        </h2>
        <p className="text-lg" style={{
          color: '#cccccc',
          fontFamily: 'Rajdhani, monospace'
        }}>
          Top performers competing for glory and rewards
        </p>
      </div>

      {/* Period Selector - Chainzoku Style */}
      <div className="flex justify-center mb-8">
        <div className="cyber-card p-1 flex" style={{
          background: 'rgba(21, 21, 21, 0.95)',
          border: '2px solid #333333',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          {(['daily', 'weekly', 'monthly'] as LeaderboardPeriod[]).map((period) => (
            <button
              key={period}
              className={`px-4 py-2 font-medium transition-all duration-300`}
              onClick={() => setSelectedPeriod(period)}
              style={{
                background: selectedPeriod === period ? 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)' : 'transparent',
                color: selectedPeriod === period ? '#0a0a0a' : '#cccccc',
                border: selectedPeriod === period ? '1px solid #00ff41' : '1px solid transparent',
                borderRadius: '4px',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '0.05em',
                boxShadow: selectedPeriod === period ? '0 0 15px rgba(0, 255, 65, 0.3)' : 'none'
              }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Second Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              {topThree[1]?.avatar}
            </div>
            <div className="absolute -top-3 -right-3">
              <Medal className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <h3 className="font-bold text-gray-800">{topThree[1]?.username}</h3>
          <p className="text-purple-600 font-semibold">{topThree[1]?.points.toLocaleString()} pts</p>
          <div className="flex space-x-1 mt-2">
            {topThree[1]?.badges.map((badge, i) => (
              <span key={i} className="text-sm">{badge}</span>
            ))}
          </div>
        </div>

        {/* First Place */}
        <div className="flex flex-col items-center -mt-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-3xl shadow-xl">
              {topThree[0]?.avatar}
            </div>
            <div className="absolute -top-3 -right-3">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            {topThree[0]?.streak > 5 && (
              <div className="absolute -top-3 -right-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Fire className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{topThree[0]?.username}</h3>
          <p className="text-purple-600 font-bold text-xl">{topThree[0]?.points.toLocaleString()} pts</p>
          <div className="flex space-x-1 mt-2">
            {topThree[0]?.badges.map((badge, i) => (
              <span key={i} className="text-lg">{badge}</span>
            ))}
          </div>
        </div>

        {/* Third Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
              {topThree[2]?.avatar}
            </div>
            <div className="absolute -top-3 -right-3">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="font-bold text-gray-800">{topThree[2]?.username}</h3>
          <p className="text-purple-600 font-semibold">{topThree[2]?.points.toLocaleString()} pts</p>
          <div className="flex space-x-1 mt-2">
            {topThree[2]?.badges.map((badge, i) => (
              <span key={i} className="text-sm">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Full Leaderboard
        </h3>
        
        <div className="space-y-2">
          {otherEntries.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                expandedUser === entry.rank
                  ? 'bg-purple-50 border-2 border-purple-200'
                  : 'bg-white/50 hover:bg-white/80 border border-gray-200'
              }`}
              onClick={() => setExpandedUser(expandedUser === entry.rank ? null : entry.rank)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800">{entry.username}</h4>
                    <p className="text-sm text-gray-500">{entry.points.toLocaleString()} points</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{entry.totalVolume}</div>
                    <div className="text-xs text-gray-500">Volume</div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {entry.badges.map((badge, i) => (
                      <span key={i} className="text-sm">{badge}</span>
                    ))}
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedUser === entry.rank ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
              
              {expandedUser === entry.rank && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{entry.winRate.toFixed(1)}%</div>
                      <div className="text-gray-500">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{entry.streak}</div>
                      <div className="text-gray-500">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{entry.totalVolume}</div>
                      <div className="text-gray-500">Total Volume</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: 'High Volume Trader', color: 'bg-blue-100 text-blue-800' },
                      { label: 'Consistent Performer', color: 'bg-green-100 text-green-800' },
                      { label: 'Community Favorite', color: 'bg-purple-100 text-purple-800' }
                    ].map((achievement, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-medium rounded-full"
                      >
                        {achievement.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
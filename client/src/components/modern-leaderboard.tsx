import React from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Users,
  Zap,
  Flame
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  balance: string;
  change: string;
  isPositive: boolean;
  streak: number;
  badges: string[];
}

export function ModernLeaderboard() {
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "CryptoKing",
      avatar: "👑",
      balance: "$125,450",
      change: "+15.2%",
      isPositive: true,
      streak: 7,
      badges: ["Top Trader", "7-Day Streak"]
    },
    {
      rank: 2,
      username: "DeFiQueen",
      avatar: "💎",
      balance: "$98,230",
      change: "+12.8%",
      isPositive: true,
      streak: 5,
      badges: ["High Roller", "5-Day Streak"]
    },
    {
      rank: 3,
      username: "SolanaPro",
      avatar: "⚡",
      balance: "$87,650",
      change: "+8.9%",
      isPositive: true,
      streak: 3,
      badges: ["Solana Expert"]
    },
    {
      rank: 4,
      username: "GoldMiner",
      avatar: "⛏️",
      balance: "$76,420",
      change: "+6.3%",
      isPositive: true,
      streak: 4,
      badges: ["Gold Miner"]
    },
    {
      rank: 5,
      username: "Web3Wizard",
      avatar: "🧙‍♂️",
      balance: "$65,890",
      change: "+4.7%",
      isPositive: true,
      streak: 2,
      badges: ["Web3 Wizard"]
    },
    {
      rank: 6,
      username: "StakeMaster",
      avatar: "🔒",
      balance: "$54,320",
      change: "-2.1%",
      isPositive: false,
      streak: 1,
      badges: ["Stake Master"]
    },
    {
      rank: 7,
      username: "YieldHunter",
      avatar: "🎯",
      balance: "$48,750",
      change: "+3.2%",
      isPositive: true,
      streak: 6,
      badges: ["Yield Hunter", "6-Day Streak"]
    },
    {
      rank: 8,
      username: "MoonWalker",
      avatar: "🚀",
      balance: "$42,180",
      change: "+1.8%",
      isPositive: true,
      streak: 1,
      badges: ["Moon Walker"]
    },
    {
      rank: 9,
      username: "DiamondHands",
      avatar: "💎",
      balance: "$38,950",
      change: "+5.4%",
      isPositive: true,
      streak: 3,
      badges: ["Diamond Hands"]
    },
    {
      rank: 10,
      username: "BullRunner",
      avatar: "🐂",
      balance: "$35,670",
      change: "+2.9%",
      isPositive: true,
      streak: 2,
      badges: ["Bull Runner"]
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-orange-400';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-orange-400 to-red-400';
      default:
        return 'from-purple-400 to-cyan-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Live Leaderboard</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Top <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Traders</span>
          </h2>
          <p className="text-lg text-gray-600">
            Compete with the best traders and earn exclusive rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Active Traders</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">$2.5M</div>
            <div className="text-sm text-gray-600">Daily Volume</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">7 Days</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Top 10 Traders</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="w-4 h-4" />
              <span>Updated every 5 minutes</span>
            </div>
          </div>

          <div className="space-y-4">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.username}
                className="group bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-4 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  {/* Rank & Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getRankGradient(entry.rank)} rounded-2xl flex items-center justify-center`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{entry.username}</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-gray-600">{entry.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance & Change */}
                  <div className="text-right">
                    <div className="font-bold text-gray-800 text-lg">{entry.balance}</div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      entry.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${entry.isPositive ? '' : 'rotate-180'}`} />
                      <span>{entry.change}</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.badges.map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-3 py-1"
                    >
                      <Star className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Ready to join the competition?
              </h4>
              <p className="text-gray-600 mb-4">
                Start trading now and climb the leaderboard to earn exclusive rewards!
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Start Trading Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
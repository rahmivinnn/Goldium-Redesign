import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Zap, 
  Fire,
  Heart,
  Users,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  score: number;
  change: number;
  badge: string;
  level: number;
  streak: number;
  isOnline: boolean;
  totalVolume: string;
  achievements: string[];
}

// Mock data for demonstration
const mockUsers: LeaderboardUser[] = [
  {
    id: '1',
    username: 'CryptoNinja',
    avatar: '🥷',
    rank: 1,
    score: 15420,
    change: 5,
    badge: 'Diamond',
    level: 42,
    streak: 15,
    isOnline: true,
    totalVolume: '$2.4M',
    achievements: ['First Trade', 'Volume King', 'Streak Master']
  },
  {
    id: '2',
    username: 'DeFiQueen',
    avatar: '👑',
    rank: 2,
    score: 12890,
    change: 2,
    badge: 'Platinum',
    level: 38,
    streak: 8,
    isOnline: true,
    totalVolume: '$1.8M',
    achievements: ['Staking Pro', 'Community Leader']
  },
  {
    id: '3',
    username: 'SolanaWizard',
    avatar: '🧙‍♂️',
    rank: 3,
    score: 11250,
    change: -1,
    badge: 'Gold',
    level: 35,
    streak: 12,
    isOnline: false,
    totalVolume: '$1.5M',
    achievements: ['Early Adopter', 'Yield Farmer']
  },
  {
    id: '4',
    username: 'TokenHunter',
    avatar: '🏹',
    rank: 4,
    score: 9870,
    change: 3,
    badge: 'Silver',
    level: 31,
    streak: 5,
    isOnline: true,
    totalVolume: '$980K',
    achievements: ['Lucky Trader']
  },
  {
    id: '5',
    username: 'YieldMaster',
    avatar: '⚡',
    rank: 5,
    score: 8640,
    change: -2,
    badge: 'Bronze',
    level: 28,
    streak: 3,
    isOnline: true,
    totalVolume: '$750K',
    achievements: ['Consistent Trader']
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <Trophy className="w-5 h-5 text-gray-500" />;
  }
};

const getBadgeColor = (badge: string) => {
  switch (badge.toLowerCase()) {
    case 'diamond':
      return 'from-cyan-400 to-blue-500';
    case 'platinum':
      return 'from-gray-300 to-gray-500';
    case 'gold':
      return 'from-yellow-400 to-orange-500';
    case 'silver':
      return 'from-gray-200 to-gray-400';
    case 'bronze':
      return 'from-amber-600 to-amber-800';
    default:
      return 'from-gray-100 to-gray-300';
  }
};

export function ModernGenZLeaderboard() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Leaderboard
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-pink-500" />
          </motion.div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center justify-center space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <motion.button
              key={period}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                timeframe === period
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'glass-button text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setTimeframe(period)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {/* Second Place */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="glass-card p-6 rounded-3xl text-center hover-lift w-full">
            <div className="relative mb-4">
              <div className="w-16 h-16 text-4xl flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mx-auto">
                {mockUsers[1].avatar}
              </div>
              <div className="absolute -top-2 -right-2">
                <Medal className="w-8 h-8 text-gray-400" />
              </div>
              {mockUsers[1].isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{mockUsers[1].username}</h3>
            <p className="text-sm text-gray-600 mb-2">Level {mockUsers[1].level}</p>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getBadgeColor(mockUsers[1].badge)}`}>
              {mockUsers[1].badge}
            </div>
          </div>
        </motion.div>

        {/* First Place */}
        <motion.div variants={itemVariants} className="flex flex-col items-center -mt-4">
          <div className="glass-card p-8 rounded-3xl text-center hover-lift w-full border-2 border-yellow-300/50">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative mb-4"
            >
              <div className="w-20 h-20 text-5xl flex items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-100 to-yellow-200 mx-auto">
                {mockUsers[0].avatar}
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-3 -right-3"
              >
                <Crown className="w-10 h-10 text-yellow-500" />
              </motion.div>
              {mockUsers[0].isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
              )}
            </motion.div>
            <h3 className="font-bold text-gray-800 mb-1 text-lg">{mockUsers[0].username}</h3>
            <p className="text-sm text-gray-600 mb-2">Level {mockUsers[0].level}</p>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getBadgeColor(mockUsers[0].badge)}`}>
              👑 {mockUsers[0].badge}
            </div>
            <div className="flex items-center justify-center space-x-2 mt-3">
              <Fire className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">{mockUsers[0].streak} day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Third Place */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="glass-card p-6 rounded-3xl text-center hover-lift w-full">
            <div className="relative mb-4">
              <div className="w-16 h-16 text-4xl flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 mx-auto">
                {mockUsers[2].avatar}
              </div>
              <div className="absolute -top-2 -right-2">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              {mockUsers[2].isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{mockUsers[2].username}</h3>
            <p className="text-sm text-gray-600 mb-2">Level {mockUsers[2].level}</p>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getBadgeColor(mockUsers[2].badge)}`}>
              {mockUsers[2].badge}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-3xl p-6"
      >
        <div className="space-y-3">
          {mockUsers.map((user, index) => (
            <motion.div
              key={user.id}
              variants={itemVariants}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                selectedUser === user.id 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar & Info */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 text-2xl flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                        {user.avatar}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{user.username}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Level {user.level}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getBadgeColor(user.badge)}`}>
                          {user.badge}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{user.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {user.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : user.change < 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={`text-sm font-medium ${
                      user.change > 0 ? 'text-green-600' : user.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {user.change > 0 ? '+' : ''}{user.change}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: selectedUser === user.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedUser === user.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{user.totalVolume}</div>
                        <div className="text-sm text-gray-600">Total Volume</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Fire className="w-4 h-4 text-orange-500" />
                          <span className="text-lg font-bold text-gray-800">{user.streak}</span>
                        </div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{user.achievements.length}</div>
                        <div className="text-sm text-gray-600">Achievements</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-lg font-bold text-gray-800">{user.level}</span>
                        </div>
                        <div className="text-sm text-gray-600">Level</div>
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Recent Achievements</h5>
                      <div className="flex flex-wrap gap-2">
                        {user.achievements.map((achievement, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-medium rounded-full"
                          >
                            🏆 {achievement}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
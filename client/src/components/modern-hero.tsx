import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react';

export function ModernHero() {
  const stats = [
    { label: 'Total Users', value: '50K+', icon: Users, color: 'from-pink-400 to-purple-400' },
    { label: 'Daily Volume', value: '$2.5M', icon: TrendingUp, color: 'from-cyan-400 to-blue-400' },
    { label: 'APY Rate', value: '12.5%', icon: Zap, color: 'from-green-400 to-emerald-400' },
    { label: 'Security Score', value: '99.9%', icon: Shield, color: 'from-orange-400 to-red-400' },
  ];

  const features = [
    { title: 'Instant Swaps', description: 'Trade SOL and GOLD instantly with zero slippage', icon: Zap },
    { title: 'Earn Rewards', description: 'Stake your tokens and earn up to 15% APY', icon: Star },
    { title: 'Secure & Fast', description: 'Built on Solana for lightning-fast transactions', icon: Shield },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-4 py-2"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Next-Gen Web3 Finance</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  Trade, Stake & Earn
                </span>
                <br />
                <span className="text-gray-800">in the Future of Finance</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the next generation of DeFi with instant swaps, high-yield staking, 
                and seamless cross-chain transactions on Solana.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow duration-300"
              >
                <span>Start Trading</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white transition-colors duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-4 hover:bg-white/80 transition-colors duration-300"
                >
                  <feature.icon className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded-3xl p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Community Driven</h4>
                  <p className="text-sm text-gray-600">Join 50K+ users in the future of finance</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-3xl p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Lightning Fast</h4>
                  <p className="text-sm text-gray-600">Transactions in under 1 second</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
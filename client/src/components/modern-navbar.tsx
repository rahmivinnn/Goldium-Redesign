import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Menu, 
  X, 
  TrendingUp, 
  Users, 
  Trophy,
  Home,
  BarChart3,
  Send,
  Lock
} from 'lucide-react';
import { FinalWalletSelector } from './final-wallet-selector';

export function ModernNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'Swap', icon: BarChart3, href: '#swap' },
    { name: 'Stake', icon: Lock, href: '#stake' },
    { name: 'Send', icon: Send, href: '#send' },
    { name: 'Leaderboard', icon: Trophy, href: '#leaderboard' },
    { name: 'Community', icon: Users, href: '#community' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden lg:block sticky top-0 z-50 backdrop-blur-xl bg-white/20 border-b border-purple-200/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Goldium
                </h1>
                <p className="text-xs text-purple-500 font-medium">Web3 Finance</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center space-x-2 text-purple-700 hover:text-purple-900 font-medium transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </div>

            {/* Wallet Connect */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl p-1"
            >
              <div className="bg-white rounded-xl px-6 py-3">
                <FinalWalletSelector />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/20 border-b border-purple-200/30"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Goldium
              </h1>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/30"
            >
              <div className="space-y-3">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-purple-700 hover:text-purple-900 font-medium p-2 rounded-xl hover:bg-purple-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </motion.a>
                ))}
                <div className="pt-2">
                  <FinalWalletSelector />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-purple-200/30">
        <div className="flex justify-around py-3">
          {navItems.slice(0, 4).map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-purple-50 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">{item.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </>
  );
} 
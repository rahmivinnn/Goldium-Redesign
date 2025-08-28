import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  BarChart3, 
  Info, 
  Wallet, 
  Menu, 
  X, 
  Sparkles,
  Coins,
  Trophy,
  Users
} from 'lucide-react';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { FinalWalletSelector } from '@/components/final-wallet-selector';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home size={20} />,
    gradient: 'gradient-purple-aqua'
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 size={20} />,
    gradient: 'gradient-pink-cyan'
  },
  {
    label: 'About',
    href: '/about',
    icon: <Info size={20} />,
    gradient: 'gradient-mint-sky'
  }
];

export function ModernGenZNavbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const wallet = useSolanaWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate="animate"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-navbar shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <motion.div
                      variants={sparkleVariants}
                      animate="animate"
                      className="w-10 h-10 gradient-rainbow-pastel rounded-2xl flex items-center justify-center"
                    >
                      <Coins className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity 
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                      Goldium
                    </h1>
                    <p className="text-xs text-gray-500 -mt-1">DeFi Platform</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = location === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={`relative px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? `${item.gradient} text-white shadow-lg` 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center space-x-2">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-white/20"
                            layoutId="activeTab"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Wallet & Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Wallet Selector */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block"
              >
                <FinalWalletSelector />
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-2xl glass-button hover-lift"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="glass-card mx-4 mt-2 rounded-3xl p-6 space-y-4">
              {/* Mobile Navigation Items */}
              {navItems.map((item, index) => {
                const isActive = location === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? `${item.gradient} text-white` 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Wallet Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-gray-200"
              >
                <FinalWalletSelector />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
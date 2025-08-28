import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const navigationItems = [
  { name: 'Trade', href: '#trade', active: true },
  { name: 'Pool', href: '#pool' },
  { name: 'Stake', href: '#stake' },
  { name: 'NFT', href: '#nft' },
  { name: 'Leaderboard', href: '#leaderboard' },
];

export const ModernGenZNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-purple-200/30 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 gradient-rainbow-pastel rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  GOLDIUM
                </span>
                <div className="text-xs text-gray-500">DeFi Platform</div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                    item.active 
                      ? 'bg-white/20 text-purple-700' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-white/10'
                  }`}
                >
                  {item.active && (
                    <div className="absolute inset-0 rounded-2xl bg-white/20" />
                  )}
                  <span className="relative font-medium">{item.name}</span>
                  {item.active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
                  )}
                </a>
              ))}
            </div>

            {/* Connect Wallet Button */}
            <div className="hidden sm:block">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-2xl font-medium text-sm hover:shadow-lg transition-all duration-300">
                Connect Wallet
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-2xl glass-button hover-lift"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="mt-4 bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-purple-200/30">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                      item.active 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.active && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
                  </a>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
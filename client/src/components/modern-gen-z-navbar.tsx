import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const navigationItems = [
  { name: 'Trade', href: '#trade', active: true },
  { name: 'Analytics', href: '#analytics' },
  { name: 'Staking', href: '#staking' },
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
      {/* Desktop Navigation - Chainzoku Style */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-navbar border-b-2 border-primary shadow-lg' 
            : 'bg-transparent'
        } chainzoku-override`}
        style={{
          background: isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
          borderBottomColor: isScrolled ? '#00ff41' : 'transparent'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Chainzoku Style */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 cyber-card flex items-center justify-center" style={{background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)'}}>
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 rounded-full animate-cyber-pulse" style={{background: '#ffff00', boxShadow: '0 0 10px #ffff00'}}></div>
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-xl font-bold chainzoku-accent-override" style={{
                  background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
                }}>
                  GOLDIUM
                </span>
                <div className="text-xs chainzoku-text-override" style={{color: '#888888'}}>DeFi Platform</div>
              </div>
            </div>

            {/* Desktop Navigation Links - Chainzoku Style */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`chainzoku-nav-item relative px-4 py-2 rounded transition-all duration-300 cursor-pointer ${
                    item.active 
                      ? 'active' 
                      : ''
                  }`}
                  style={{
                    color: item.active ? '#00ff41' : '#cccccc',
                    background: item.active ? 'rgba(0, 255, 65, 0.2)' : 'transparent',
                    textShadow: item.active ? '0 0 5px rgba(0, 255, 65, 0.5)' : 'none',
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span className="relative font-medium">{item.name}</span>
                  {item.active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 rounded-full" style={{background: '#00ff41', boxShadow: '0 0 5px #00ff41'}} />
                  )}
                </a>
              ))}
            </div>

            {/* Connect Wallet Button - Chainzoku Style */}
            <div className="hidden sm:block">
              <button className="cyber-button-primary px-6 py-2 font-medium text-sm transition-all duration-300" style={{
                background: 'transparent',
                border: '2px solid #00ff41',
                color: '#00ff41',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                Connect Wallet
              </button>
            </div>

            {/* Mobile Menu Button - Chainzoku Style */}
            <button
              className="md:hidden p-2 glass-button hover-lift"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'rgba(21, 21, 21, 0.95)',
                border: '2px solid #333333',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" style={{color: '#00ff41'}} />
              ) : (
                <Menu className="w-5 h-5" style={{color: '#00ff41'}} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Chainzoku Style */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="mt-4 cyber-modal p-4" style={{
              background: 'rgba(21, 21, 21, 0.95)',
              border: '2px solid #00ff41',
              borderRadius: '8px',
              backdropFilter: 'blur(20px)'
            }}>
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 transition-all duration-300 cursor-pointer`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      background: item.active ? 'rgba(0, 255, 65, 0.2)' : 'transparent',
                      color: item.active ? '#00ff41' : '#cccccc',
                      border: `1px solid ${item.active ? '#00ff41' : '#333333'}`,
                      borderRadius: '4px',
                      fontFamily: 'Orbitron, monospace',
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.active && <div className="w-2 h-2 rounded-full" style={{background: '#00ff41', boxShadow: '0 0 5px #00ff41'}} />}
                  </a>
                ))}
              </div>
              
              <div className="pt-4" style={{borderTop: '1px solid #333333'}}>
                <button className="w-full cyber-button-primary px-6 py-3 font-medium transition-all duration-300" style={{
                  background: 'transparent',
                  border: '2px solid #00ff41',
                  color: '#00ff41',
                  fontFamily: 'Orbitron, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderRadius: '4px'
                }}>
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay - Chainzoku Style */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        />
      )}
    </>
  );
};
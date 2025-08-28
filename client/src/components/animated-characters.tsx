import React, { useState, useEffect } from 'react';

interface AnimatedCharacterProps {
  type: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPlaying?: boolean;
  onAnimationComplete?: () => void;
}

export function AnimatedCharacter({ 
  type, 
  size = 'lg', 
  isPlaying = false, 
  onAnimationComplete 
}: AnimatedCharacterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAnimationComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, onAnimationComplete]);

  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'md': return 'w-24 h-24';
      case 'lg': return 'w-32 h-32';
      case 'xl': return 'w-48 h-48';
      default: return 'w-32 h-32';
    }
  };

  const renderCharacter = () => {
    switch (type) {
      case 'K1':
        return <K1GoldSparkle />;
      case 'K2':
        return <K2CoinFlip />;
      case 'K3':
        return <K3DiamondShine />;
      case 'K4':
        return <K4FireBurst />;
      case 'K5':
        return <K5ElectricSpark />;
      case 'K6':
        return <K6RainbowTrail />;
      case 'K7':
        return <K7CrystalGlow />;
      case 'K8':
        return <K8GoldenExplosion />;
      default:
        return <K1GoldSparkle />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${getSize()}`}>
      {renderCharacter()}
    </div>
  );
}

// K1 - Gold Sparkle Character
function K1GoldSparkle() {
  return (
    <div className="relative w-full h-full">
      {/* Main Sparkle */}
      <div className="absolute inset-0 animate-sparkle">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="50%" stopColor="#FFA500" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#goldGradient)" className="animate-pulse" />
          <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#FFD700" className="animate-spin" />
        </svg>
      </div>
      
      {/* Sparkle Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle-particle"
          style={{
            left: `${50 + 30 * Math.cos(i * Math.PI / 4)}%`,
            top: `${50 + 30 * Math.sin(i * Math.PI / 4)}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

// K2 - Coin Flip Character
function K2CoinFlip() {
  return (
    <div className="relative w-full h-full">
      {/* Coin */}
      <div className="absolute inset-0 animate-coin-flip">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-4 border-yellow-300 shadow-2xl flex items-center justify-center">
          <span className="text-2xl font-bold text-white">₿</span>
        </div>
      </div>
      
      {/* Coin Trail */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-yellow-300 animate-coin-trail"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  );
}

// K3 - Diamond Shine Character
function K3DiamondShine() {
  return (
    <div className="relative w-full h-full">
      {/* Diamond */}
      <div className="absolute inset-0 animate-diamond-shine">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <polygon points="50,10 60,40 50,70 40,40" fill="url(#diamondGradient)" className="animate-pulse" />
          <polygon points="50,10 60,40 50,70 40,40" fill="none" stroke="#FFD700" strokeWidth="2" className="animate-ping" />
        </svg>
      </div>
      
      {/* Shine Rays */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-t from-transparent via-yellow-400 to-transparent animate-shine-ray"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

// K4 - Fire Burst Character
function K4FireBurst() {
  return (
    <div className="relative w-full h-full">
      {/* Fire Core */}
      <div className="absolute inset-0 animate-fire-burst">
        <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse" />
      </div>
      
      {/* Fire Flames */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-12 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full animate-fire-flame"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-20px)`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
      
      {/* Fire Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-fire-particle"
          style={{
            left: `${50 + (Math.random() - 0.5) * 60}%`,
            top: `${50 + (Math.random() - 0.5) * 60}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

// K5 - Electric Spark Character
function K5ElectricSpark() {
  return (
    <div className="relative w-full h-full">
      {/* Electric Core */}
      <div className="absolute inset-0 animate-electric-spark">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-full animate-pulse" />
      </div>
      
      {/* Lightning Bolts */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-16 bg-gradient-to-t from-transparent via-cyan-400 to-transparent animate-lightning"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
      
      {/* Electric Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-electric-particle"
          style={{
            left: `${50 + (Math.random() - 0.5) * 40}%`,
            top: `${50 + (Math.random() - 0.5) * 40}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  );
}

// K6 - Rainbow Trail Character
function K6RainbowTrail() {
  return (
    <div className="relative w-full h-full">
      {/* Rainbow Core */}
      <div className="absolute inset-0 animate-rainbow-trail">
        <div className="w-full h-full bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin" />
      </div>
      
      {/* Rainbow Rings */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute border-4 border-transparent rounded-full animate-rainbow-ring"
          style={{
            left: '50%',
            top: '50%',
            width: `${60 + i * 10}%`,
            height: `${60 + i * 10}%`,
            transform: 'translate(-50%, -50%)',
            borderImage: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3) 1',
            animationDelay: `${i * 0.2}s`,
            animationDuration: '3s'
          }}
        />
      ))}
      
      {/* Rainbow Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full animate-rainbow-particle"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-30px)`,
            background: `hsl(${i * 30}, 100%, 50%)`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

// K7 - Crystal Glow Character
function K7CrystalGlow() {
  return (
    <div className="relative w-full h-full">
      {/* Crystal */}
      <div className="absolute inset-0 animate-crystal-glow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <polygon points="50,10 70,30 50,50 30,30" fill="url(#crystalGradient)" className="animate-pulse" />
          <polygon points="50,50 70,70 50,90 30,70" fill="url(#crystalGradient)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </svg>
      </div>
      
      {/* Glow Rays */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-12 bg-gradient-to-t from-transparent via-purple-400 to-transparent animate-glow-ray"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '2.5s'
          }}
        />
      ))}
      
      {/* Crystal Particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full animate-crystal-particle"
          style={{
            left: `${50 + (Math.random() - 0.5) * 50}%`,
            top: `${50 + (Math.random() - 0.5) * 50}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
}

// K8 - Golden Explosion Character
function K8GoldenExplosion() {
  return (
    <div className="relative w-full h-full">
      {/* Explosion Core */}
      <div className="absolute inset-0 animate-golden-explosion">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-full animate-ping" />
      </div>
      
      {/* Explosion Rays */}
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-20 bg-gradient-to-t from-transparent via-yellow-400 to-transparent animate-explosion-ray"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
            animationDelay: `${i * 0.05}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
      
      {/* Golden Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-explosion-particle"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: '2s'
          }}
        />
      ))}
      
      {/* Shockwave */}
      <div className="absolute inset-0 animate-shockwave">
        <div className="w-full h-full border-4 border-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
}

// Animation Manager Hook
export function useAnimatedCharacter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentType, setCurrentType] = useState<'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8'>('K1');

  const playAnimation = (type: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8') => {
    setCurrentType(type);
    setIsPlaying(true);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
  };

  return {
    isPlaying,
    currentType,
    playAnimation,
    stopAnimation
  };
}

// Export all components
export {
  AnimatedCharacter as Character,
  K1GoldSparkle,
  K2CoinFlip,
  K3DiamondShine,
  K4FireBurst,
  K5ElectricSpark,
  K6RainbowTrail,
  K7CrystalGlow,
  K8GoldenExplosion
}; 
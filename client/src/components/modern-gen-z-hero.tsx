import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Zap, Target, Shield } from 'lucide-react';

const FloatingOrb: React.FC<{
  color: string;
  size: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
}> = ({ color, size, x, y, duration, delay }) => {
  return (
    <div
      className={`absolute rounded-full ${color} blur-xl opacity-30`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
    />
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}> = ({ icon, title, description, gradient, delay }) => {
  return (
    <div className="cyber-card p-6 cyber-hover group cursor-pointer" style={{
      background: 'rgba(21, 21, 21, 0.95)',
      border: '1px solid #333333',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>
      <div
        className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
          border: '2px solid #00ff41',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)'
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
          style: { color: '#0a0a0a' }
        })}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{
        color: '#ffffff',
        fontFamily: 'Orbitron, monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{
        color: '#cccccc',
        fontFamily: 'Rajdhani, monospace'
      }}>{description}</p>
    </div>
  );
};

const ParallaxBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
      }}
    >
      {/* Floating Orbs */}
      <FloatingOrb color="bg-purple-400" size="200px" x="10%" y="20%" duration={6} delay={0} />
      <FloatingOrb color="bg-pink-400" size="150px" x="80%" y="10%" duration={8} delay={2} />
      <FloatingOrb color="bg-cyan-400" size="100px" x="70%" y="60%" duration={4} delay={1} />
      <FloatingOrb color="bg-yellow-400" size="120px" x="20%" y="70%" duration={7} delay={3} />
    </div>
  );
};

export const ModernGenZHero: React.FC = () => {
  return (
    <section className="chainzoku-hero relative min-h-screen flex items-center justify-center overflow-hidden py-20" style={{
      background: '#0a0a0a',
      position: 'relative'
    }}>
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain-container">
        {Array.from({length: 20}).map((_, i) => (
          <div 
            key={i}
            className="matrix-char"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>
      
      {/* Parallax Background */}
      <ParallaxBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge - Chainzoku Style */}
        <div className="cyber-badge inline-flex items-center space-x-2 px-4 py-2 mb-8" style={{
          background: 'transparent',
          border: '1px solid #00ff41',
          borderRadius: '4px',
          color: '#00ff41',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <Sparkles className="w-4 h-4" style={{color: '#00ff41'}} />
          <span>
            Next-Gen DeFi Platform ✨
          </span>
        </div>

        {/* Main Heading - Chainzoku Style */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
          }}>
            Welcome to
          </span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #ffff00 0%, #ff4000 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 255, 0, 0.5)'
          }}>
            Goldium
          </span>
        </h1>

        {/* Subtitle - Chainzoku Style */}
        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{
          color: '#cccccc',
          fontFamily: 'Rajdhani, monospace',
          fontWeight: '400'
        }}>
          Experience the future of DeFi with our{" "}
          <span className="font-semibold" style={{color: '#00ff41', textShadow: '0 0 5px rgba(0, 255, 65, 0.5)'}}>playful</span>,{" "}
          <span className="font-semibold" style={{color: '#00d4ff', textShadow: '0 0 5px rgba(0, 212, 255, 0.5)'}}>secure</span>, and{" "}
          <span className="font-semibold" style={{color: '#ff0080', textShadow: '0 0 5px rgba(255, 0, 128, 0.5)'}}>community-driven</span>{" "}
          platform 🚀
        </p>

        {/* CTA Buttons - Chainzoku Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <button className="cyber-button-primary px-8 py-4 font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 100%)',
            border: '2px solid #00ff41',
            color: '#0a0a0a',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
          }}>
            <span>Start Trading</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button className="cyber-button px-8 py-4 font-semibold text-lg transition-all duration-300" style={{
            background: 'transparent',
            border: '2px solid #333333',
            color: '#cccccc',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '4px'
          }}>
            Learn More
          </button>
        </div>

        {/* SOL-GOLD DeFi Stats - Chainzoku Style */}
        <div className="cyber-grid grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { title: "SOL-GOLD Rate", value: "21,487", subtitle: "GOLD per SOL" },
            { title: "Total Staked", value: "1.2M GOLD", subtitle: "🔒 Earning Rewards" },
            { title: "Active Traders", value: "50K+", subtitle: "🌟 Trading SOL-GOLD" },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="chainzoku-stat cyber-hover p-4 transition-all duration-300"
              style={{
                background: 'rgba(21, 21, 21, 0.95)',
                border: '1px solid #333333',
                borderRadius: '6px',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="chainzoku-stat-value text-2xl font-bold" style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: '#00ff41',
                textShadow: '0 0 5px rgba(0, 255, 65, 0.5)'
              }}>{stat.value}</div>
              <div className="chainzoku-stat-label text-sm" style={{
                color: '#cccccc',
                fontFamily: 'Orbitron, monospace',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.1em'
              }}>{stat.title}</div>
              <div className="text-xs font-medium" style={{
                color: '#00d4ff',
                fontFamily: 'JetBrains Mono, monospace',
                textShadow: '0 0 3px rgba(0, 212, 255, 0.5)'
              }}>{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards Section - Chainzoku Style */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="cyber-card p-8" style={{
          background: 'rgba(21, 21, 21, 0.95)',
          border: '2px solid #333333',
          borderRadius: '8px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 className="text-3xl font-bold text-center mb-8" style={{
            color: '#ffffff',
            fontFamily: 'Orbitron, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0, 255, 65, 0.3)'
          }}>
            Why Choose Goldium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-white" />}
              title="SOL ↔ GOLD Swap"
              description="Instant swapping between SOL and GOLD tokens with optimal rates"
              gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
              delay={0}
            />
            
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-white" />}
              title="GOLD Staking"
              description="Stake your GOLD tokens and earn up to 35% APY with tier rewards"
              gradient="bg-gradient-to-br from-green-400 to-blue-500"
              delay={0.2}
            />
            
            <FeatureCard
              icon={<Target className="w-6 h-6 text-white" />}
              title="Secure Transfers"
              description="Send SOL or GOLD tokens securely to any Solana wallet address"
              gradient="bg-gradient-to-br from-purple-400 to-pink-500"
              delay={0.4}
            />
          </div>
        </div>
        
        {/* SOL-GOLD DeFi Features - Chainzoku Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '1px solid #333333',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#ff0080',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '0 0 5px rgba(255, 0, 128, 0.5)'
            }}>💱 Real-time Trading</h3>
            <p style={{
              color: '#cccccc',
              fontFamily: 'Rajdhani, monospace'
            }}>
              Live SOL-GOLD trading with real-time charts, order books, and market analytics for optimal trading decisions.
            </p>
          </div>
          
          <div className="cyber-card p-6" style={{
            background: 'rgba(21, 21, 21, 0.95)',
            border: '1px solid #333333',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              color: '#00d4ff',
              fontFamily: 'Orbitron, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '0 0 5px rgba(0, 212, 255, 0.5)'
            }}>🔒 Multi-tier Staking</h3>
            <p style={{
              color: '#cccccc',
              fontFamily: 'Rajdhani, monospace'
            }}>
              Stake GOLD tokens in 4 different tiers with APY up to 35% and unlock exclusive benefits and rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cyberpunk Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{
        background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)'
      }} />
    </section>
  );
};
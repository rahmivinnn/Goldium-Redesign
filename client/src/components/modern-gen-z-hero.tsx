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
    <div className="glass-card p-6 rounded-3xl hover-lift group cursor-pointer">
      <div
        className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center overflow-hidden py-20">
      {/* Parallax Background */}
      <ParallaxBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            Next-Gen DeFi Platform ✨
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Goldium
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience the future of DeFi with our{" "}
          <span className="font-semibold text-purple-600">playful</span>,{" "}
          <span className="font-semibold text-pink-600">secure</span>, and{" "}
          <span className="font-semibold text-cyan-600">community-driven</span>{" "}
          platform 🚀
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow duration-300">
            <span>Start Trading</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button className="bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white transition-colors duration-300">
            Learn More
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { title: "24h Volume", value: "$2.4M", subtitle: "↗ +15.3%" },
            { title: "Total Locked", value: "$12.8M", subtitle: "🔒 Secured" },
            { title: "Users", value: "50K+", subtitle: "🌟 Active" },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-4 hover:bg-white/80 transition-colors duration-300"
            >
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
              <div className="text-xs text-purple-600 font-medium">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Why Choose Goldium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Lightning Fast"
              description="Execute trades in milliseconds with our optimized infrastructure"
              gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
              delay={0}
            />
            
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Bank-Grade Security"
              description="Your funds are protected by military-grade encryption"
              gradient="bg-gradient-to-br from-green-400 to-blue-500"
              delay={0.2}
            />
            
            <FeatureCard
              icon={<Target className="w-6 h-6 text-white" />}
              title="Smart Trading"
              description="AI-powered insights to maximize your trading potential"
              gradient="bg-gradient-to-br from-purple-400 to-pink-500"
              delay={0.4}
            />
          </div>
        </div>
        
        {/* Additional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎮 Gamified Experience</h3>
            <p className="text-gray-600">
              Earn XP, unlock achievements, and compete with friends in our gamified DeFi ecosystem.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Global Community</h3>
            <p className="text-gray-600">
              Join thousands of traders worldwide in building the future of decentralized finance.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};
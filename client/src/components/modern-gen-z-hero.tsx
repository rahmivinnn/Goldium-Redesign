import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Star,
  Coins,
  Rocket,
  Heart
} from 'lucide-react';

interface FloatingOrbProps {
  size: number;
  color: string;
  duration: number;
  delay: number;
  x: string;
  y: string;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({ size, color, duration, delay, x, y }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} blur-xl opacity-30`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      className="glass-card p-6 rounded-3xl hover-lift group cursor-pointer"
    >
      <motion.div
        className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export function ModernGenZHero() {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const orbsY = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Animated Background Orbs */}
      <motion.div style={{ y: orbsY }} className="absolute inset-0">
        <FloatingOrb size={200} color="bg-purple-400" duration={6} delay={0} x="10%" y="20%" />
        <FloatingOrb size={150} color="bg-pink-400" duration={8} delay={1} x="80%" y="10%" />
        <FloatingOrb size={100} color="bg-cyan-400" duration={7} delay={2} x="70%" y="60%" />
        <FloatingOrb size={120} color="bg-yellow-400" duration={9} delay={0.5} x="20%" y="70%" />
        <FloatingOrb size={80} color="bg-green-400" duration={5} delay={1.5} x="90%" y="80%" />
      </motion.div>

      {/* Interactive Mouse Follower */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-300/20 blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x * 0.1,
          y: mousePosition.y * 0.1,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* Main Content */}
      <motion.div 
        style={{ y: backgroundY }}
        className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: textY }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">
                Next-Gen DeFi Platform ✨
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Goldium
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of DeFi with our{" "}
              <span className="font-semibold text-purple-600">playful</span>,{" "}
              <span className="font-semibold text-pink-600">secure</span>, and{" "}
              <span className="font-semibold text-cyan-600">community-driven</span>{" "}
              platform
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Start Trading</span>
                </div>
              </motion.button>

              <motion.button
                className="px-8 py-4 glass-button text-gray-700 font-semibold rounded-2xl hover-lift"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Join Community</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: "Total Volume", value: "$2.4M", icon: <TrendingUp className="w-5 h-5" /> },
                { label: "Active Users", value: "12.5K", icon: <Star className="w-5 h-5" /> },
                { label: "Transactions", value: "45.2K", icon: <Zap className="w-5 h-5" /> },
                { label: "Security Score", value: "99.9%", icon: <Shield className="w-5 h-5" /> },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-4 rounded-2xl text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-2 text-purple-500">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <FeatureCard
              icon={<Coins className="w-6 h-6 text-white" />}
              title="Easy Swapping"
              description="Swap tokens instantly with our intuitive interface and competitive rates"
              gradient="gradient-purple-aqua"
              delay={0.2}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Secure Staking"
              description="Earn rewards safely with our audited smart contracts and insurance coverage"
              gradient="gradient-pink-cyan"
              delay={0.4}
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Real-time Analytics"
              description="Track your portfolio performance with beautiful charts and insights"
              gradient="gradient-mint-sky"
              delay={0.6}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
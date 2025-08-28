import React, { useState, useEffect } from 'react';
import { animationManager } from '@/assets/transaction-animations';
import { AnimatedCharacter, useAnimatedCharacter } from '@/components/animated-characters';

interface ModernTransactionAnimationProps {
  type?: 'swap' | 'send' | 'stake' | 'buy' | 'success' | 'error' | 'random';
  trigger?: boolean;
  onAnimationComplete?: () => void;
}

export function ModernTransactionAnimation({ 
  type = 'random', 
  trigger = false, 
  onAnimationComplete 
}: ModernTransactionAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger && !isAnimating) {
      playAnimation();
    }
  }, [trigger, type]);

  const playAnimation = () => {
    setIsAnimating(true);
    
    switch (type) {
      case 'swap':
        animationManager.showSwapAnimation();
        break;
      case 'send':
        animationManager.showSendAnimation();
        break;
      case 'stake':
        animationManager.showStakeAnimation();
        break;
      case 'buy':
        animationManager.showBuyAnimation();
        break;
      case 'success':
        animationManager.showSuccessAnimation();
        break;
      case 'error':
        animationManager.showErrorAnimation();
        break;
      default:
        animationManager.showRandomAnimation();
    }

    // Reset after animation
    setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, 3000);
  };

  return null; // This component doesn't render anything visible
}

// Modern Button with Animation
interface ModernAnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  animationType?: 'swap' | 'send' | 'stake' | 'buy' | 'success' | 'error' | 'random';
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

export function ModernAnimatedButton({
  children,
  onClick,
  animationType = 'random',
  className = '',
  disabled = false,
  variant = 'primary'
}: ModernAnimatedButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isPlaying, playAnimation, stopAnimation } = useAnimatedCharacter();

  const handleClick = async () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    
    // Play character animation
    switch (animationType) {
      case 'swap':
        playAnimation('K2'); // Coin flip for swap
        break;
      case 'send':
        playAnimation('K4'); // Fire burst for send
        break;
      case 'stake':
        playAnimation('K1'); // Gold sparkle for stake
        break;
      case 'buy':
        playAnimation('K8'); // Golden explosion for buy
        break;
      case 'success':
        playAnimation('K3'); // Diamond shine for success
        break;
      case 'error':
        playAnimation('K5'); // Electric spark for error
        break;
      default:
        playAnimation('K6'); // Rainbow trail for random
    }

    // Call original onClick
    if (onClick) {
      onClick();
    }

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
      stopAnimation();
    }, 3000);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600';
      default:
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600';
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isAnimating}
        className={`
          modern-animated-button
          ${getVariantStyles()}
          ${className}
          ${isAnimating ? 'animate-pulse' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="button-content">
          {children}
        </span>
        {isAnimating && (
          <div className="button-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
        )}
      </button>
      
      {/* Character Animation */}
      <AnimatedCharacter
        type={animationType === 'swap' ? 'K2' : 
              animationType === 'send' ? 'K4' : 
              animationType === 'stake' ? 'K1' : 
              animationType === 'buy' ? 'K8' : 
              animationType === 'success' ? 'K3' : 
              animationType === 'error' ? 'K5' : 'K6'}
        isPlaying={isPlaying}
        onAnimationComplete={stopAnimation}
      />
    </>
  );
}

// Modern Card with Hover Effects
interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'glow' | 'lift' | 'scale' | 'rotate' | 'none';
  animationType?: 'swap' | 'send' | 'stake' | 'buy' | 'success' | 'error' | 'random';
}

export function ModernCard({
  children,
  className = '',
  hoverEffect = 'glow',
  animationType
}: ModernCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getHoverEffect = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:transform hover:translate-y-[-8px] hover:scale-105';
      case 'scale':
        return 'hover:transform hover:scale-110';
      case 'rotate':
        return 'hover:transform hover:rotate-2';
      case 'glow':
        return 'hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]';
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (animationType) {
      switch (animationType) {
        case 'swap':
          animationManager.showSwapAnimation();
          break;
        case 'send':
          animationManager.showSendAnimation();
          break;
        case 'stake':
          animationManager.showStakeAnimation();
          break;
        case 'buy':
          animationManager.showBuyAnimation();
          break;
        case 'success':
          animationManager.showSuccessAnimation();
          break;
        case 'error':
          animationManager.showErrorAnimation();
          break;
        default:
          animationManager.showRandomAnimation();
      }
    }
  };

  return (
    <div
      className={`
        modern-card
        bg-gradient-to-br from-gray-900/90 to-gray-800/90
        border border-yellow-400/30
        rounded-2xl
        p-6
        backdrop-blur-xl
        transition-all duration-500 ease-out
        ${getHoverEffect()}
        ${isHovered ? 'border-yellow-400/60' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="card-content">
        {children}
      </div>
      {isHovered && (
        <div className="card-glow">
          <div className="glow-line glow-line-1"></div>
          <div className="glow-line glow-line-2"></div>
          <div className="glow-line glow-line-3"></div>
        </div>
      )}
    </div>
  );
}

// Modern Icon Component
interface ModernIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'gold' | 'purple' | 'blue' | 'green' | 'red' | 'rainbow';
  animated?: boolean;
  onClick?: () => void;
}

export function ModernIcon({
  icon,
  size = 'md',
  color = 'gold',
  animated = false,
  onClick
}: ModernIconProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-8 h-8';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'purple':
        return 'text-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]';
      case 'blue':
        return 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      case 'green':
        return 'text-green-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      case 'red':
        return 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'rainbow':
        return 'animate-pulse bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent';
      default:
        return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]';
    }
  };

  return (
    <div
      className={`
        modern-icon
        ${getSize()}
        ${getColor()}
        ${animated ? 'animate-bounce' : ''}
        ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        flex items-center justify-center
        rounded-full
        bg-gradient-to-br from-gray-800/50 to-gray-700/50
        border border-yellow-400/20
        backdrop-blur-sm
      `}
      onClick={onClick}
    >
      <span className="text-2xl font-bold">{icon}</span>
    </div>
  );
}

// Export all components
export {
  ModernTransactionAnimation as TransactionAnimation,
  ModernAnimatedButton as AnimatedButton,
  ModernCard as Card,
  ModernIcon as Icon
}; 
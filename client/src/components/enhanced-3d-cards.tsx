import React, { useState, useRef } from 'react';

interface Enhanced3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export const Enhanced3DCard: React.FC<Enhanced3DCardProps> = ({ 
  children, 
  className = '', 
  glowColor = '#00ff41',
  intensity = 1 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    setMousePosition({ x: x * intensity, y: y * intensity });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative transform-gpu transition-all duration-300 ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) scale(1.05)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovered 
          ? `0 20px 40px ${glowColor}40, 0 0 30px ${glowColor}30`
          : `0 10px 20px rgba(0, 0, 0, 0.3)`,
        background: isHovered 
          ? `linear-gradient(135deg, rgba(21, 21, 21, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)`
          : `rgba(21, 21, 21, 0.95)`,
        border: isHovered 
          ? `2px solid ${glowColor}`
          : '2px solid #333333',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated border */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(45deg, ${glowColor}00, ${glowColor}40, ${glowColor}00)`,
          backgroundSize: '200% 200%',
          animation: isHovered ? 'borderGlow 2s ease-in-out infinite' : 'none'
        }}
      />
      
      {/* Scan line effect */}
      <div 
        className="absolute top-0 left-0 w-full h-0.5 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          animation: isHovered ? 'scanLine 2s ease-in-out infinite' : 'none'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow overlay */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.1 : 0,
          background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, ${glowColor}60 0%, transparent 70%)`
        }}
      />
    </div>
  );
};

export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ value, duration = 2000, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOutCubic);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isVisible]);

  return (
    <div ref={ref} className="font-mono font-bold">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </div>
  );
};

export const GlowingButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);

  const colors = {
    primary: { bg: '#00ff41', glow: 'rgba(0, 255, 65, 0.5)', text: '#000000' },
    secondary: { bg: '#00d4ff', glow: 'rgba(0, 212, 255, 0.5)', text: '#000000' },
    danger: { bg: '#ff0080', glow: 'rgba(255, 0, 128, 0.5)', text: '#ffffff' }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || !onClick) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick();
  };

  return (
    <button
      className={`relative overflow-hidden font-bold transition-all duration-300 transform-gpu ${sizes[size]} ${className}`}
      style={{
        background: disabled 
          ? 'rgba(102, 102, 102, 0.3)' 
          : `linear-gradient(135deg, ${colors[variant].bg} 0%, ${colors[variant].bg}CC 100%)`,
        border: `2px solid ${disabled ? '#666666' : colors[variant].bg}`,
        color: disabled ? '#666666' : colors[variant].text,
        borderRadius: '6px',
        fontFamily: 'Orbitron, monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled 
          ? 'none' 
          : `0 0 20px ${colors[variant].glow}, 0 4px 15px rgba(0, 0, 0, 0.3)`,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)'
      }}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            background: `${colors[variant].bg}40`,
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10">{children}</span>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, transparent, ${colors[variant].glow}, transparent)`,
          backgroundSize: '200% 200%',
          animation: 'buttonGlow 2s ease-in-out infinite'
        }}
      />
    </button>
  );
};

export const NeonText: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}> = ({ children, color = '#00ff41', size = 'md', animated = false }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div
      className={`font-bold ${sizes[size]} ${animated ? 'animate-pulse' : ''}`}
      style={{
        color: color,
        fontFamily: 'Orbitron, monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textShadow: `
          0 0 5px ${color},
          0 0 10px ${color},
          0 0 15px ${color},
          0 0 20px ${color}
        `,
        filter: `drop-shadow(0 0 10px ${color})`
      }}
    >
      {children}
    </div>
  );
};
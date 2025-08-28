import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'gradient-purple' | 'gradient-pink' | 'gradient-cyan' | 'gradient-rainbow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300',
  glass: 'glass-button text-gray-700 hover:bg-white/30',
  outline: 'border-2 border-purple-300 text-purple-600 hover:bg-purple-50',
  'gradient-purple': 'gradient-purple-aqua text-white shadow-lg',
  'gradient-pink': 'gradient-pink-cyan text-white shadow-lg',
  'gradient-cyan': 'gradient-mint-sky text-white shadow-lg',
  'gradient-rainbow': 'gradient-rainbow-pastel text-white shadow-lg',
};

const sizeVariants = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-xl rounded-3xl',
};

export function ModernGenZButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
}: ModernButtonProps) {
  const baseClasses = `
    relative overflow-hidden font-semibold transition-all duration-300 
    transform-gpu focus:outline-none focus:ring-4 focus:ring-purple-300/50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${buttonVariants[variant]}
    ${sizeVariants[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const buttonContent = (
    <>
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2,
        boxShadow: disabled ? undefined : "0 20px 40px rgba(168, 85, 247, 0.3)"
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        y: disabled ? 0 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {buttonContent}
    </motion.button>
  );
}

// Specialized button components
export function PrimaryButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernGenZButton {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernGenZButton {...props} variant="secondary" />;
}

export function GlassButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernGenZButton {...props} variant="glass" />;
}

export function OutlineButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernGenZButton {...props} variant="outline" />;
}

export function GradientButton({ 
  gradient = 'purple',
  ...props 
}: Omit<ModernButtonProps, 'variant'> & { gradient?: 'purple' | 'pink' | 'cyan' | 'rainbow' }) {
  return <ModernGenZButton {...props} variant={`gradient-${gradient}` as any} />;
}

// Floating Action Button
export function FloatingActionButton({
  children,
  className = '',
  ...props
}: ModernButtonProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
    >
      <ModernGenZButton
        {...props}
        className={`rounded-full w-14 h-14 shadow-2xl ${className}`}
        size="md"
      >
        {children}
      </ModernGenZButton>
    </motion.div>
  );
}

// Button Group Component
export function ButtonGroup({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Animated Icon Button
export function IconButton({
  icon,
  tooltip,
  variant = 'glass',
  size = 'md',
  className = '',
  ...props
}: Omit<ModernButtonProps, 'children'> & {
  icon: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <motion.div className="relative group">
      <ModernGenZButton
        {...props}
        variant={variant}
        size={size}
        className={`aspect-square ${className}`}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      </ModernGenZButton>
      
      {tooltip && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </motion.div>
      )}
    </motion.div>
  );
}
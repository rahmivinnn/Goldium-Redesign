import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function ModernButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = ''
}: ModernButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300
    focus:outline-none focus:ring-4 focus:ring-purple-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-500 to-cyan-500 text-white
      hover:from-purple-600 hover:to-cyan-600 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `,
    secondary: `
      bg-gradient-to-r from-pink-400 to-purple-400 text-white
      hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `,
    success: `
      bg-gradient-to-r from-green-400 to-emerald-400 text-white
      hover:from-green-500 hover:to-emerald-500 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `,
    warning: `
      bg-gradient-to-r from-orange-400 to-red-400 text-white
      hover:from-orange-500 hover:to-red-500 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `,
    danger: `
      bg-gradient-to-r from-red-400 to-pink-400 text-white
      hover:from-red-500 hover:to-pink-500 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `,
    ghost: `
      bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700
      hover:bg-white hover:border-purple-300 hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98] active:shadow-md
    `
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const iconSpacing = {
    sm: 'space-x-2',
    md: 'space-x-2',
    lg: 'space-x-3',
    xl: 'space-x-3'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <div className={`flex items-center ${iconSpacing[size]}`}>
        {loading && (
          <div className={`${iconClasses[size]} animate-spin rounded-full border-2 border-current border-t-transparent`} />
        )}
        {!loading && Icon && iconPosition === 'left' && (
          <Icon className={iconClasses[size]} />
        )}
        <span>{children}</span>
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className={iconClasses[size]} />
        )}
      </div>
    </button>
  );
}

// Specialized button components
export function ModernPrimaryButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="primary" />;
}

export function ModernSecondaryButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="secondary" />;
}

export function ModernSuccessButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="success" />;
}

export function ModernWarningButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="warning" />;
}

export function ModernDangerButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="danger" />;
}

export function ModernGhostButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton {...props} variant="ghost" />;
}

// Button group component
interface ModernButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernButtonGroup({ children, className = '' }: ModernButtonGroupProps) {
  return (
    <div className={`inline-flex rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-200/50 p-1 ${className}`}>
      {children}
    </div>
  );
}

// Example usage component
export function ModernButtonsExample() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <ModernPrimaryButton>Primary Button</ModernPrimaryButton>
          <ModernSecondaryButton>Secondary Button</ModernSecondaryButton>
          <ModernSuccessButton>Success Button</ModernSuccessButton>
          <ModernWarningButton>Warning Button</ModernWarningButton>
          <ModernDangerButton>Danger Button</ModernDangerButton>
          <ModernGhostButton>Ghost Button</ModernGhostButton>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <ModernButton size="sm">Small</ModernButton>
          <ModernButton size="md">Medium</ModernButton>
          <ModernButton size="lg">Large</ModernButton>
          <ModernButton size="xl">Extra Large</ModernButton>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <ModernButton>Normal</ModernButton>
          <ModernButton disabled>Disabled</ModernButton>
          <ModernButton loading>Loading</ModernButton>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Full Width</h3>
        <ModernButton fullWidth>Full Width Button</ModernButton>
      </div>
    </div>
  );
} 
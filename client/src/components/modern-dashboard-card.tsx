import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModernDashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export function ModernDashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  onClick,
  className = ''
}: ModernDashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-6 
        hover:bg-white/90 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
        ${onClick ? 'hover:border-purple-300' : ''}
        ${className}
      `}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

// Predefined card variants
export const DashboardCardVariants = {
  primary: 'from-purple-400 to-cyan-400',
  success: 'from-green-400 to-emerald-400',
  warning: 'from-orange-400 to-red-400',
  info: 'from-blue-400 to-cyan-400',
  pink: 'from-pink-400 to-purple-400',
  yellow: 'from-yellow-400 to-orange-400',
};

// Example usage component
export function DashboardCardsExample() {
  const cards = [
    {
      title: 'Total Balance',
      value: '$12,450.67',
      subtitle: 'SOL + GOLD',
      icon: 'Wallet' as any,
      gradient: DashboardCardVariants.primary,
      trend: { value: '+12.5%', isPositive: true }
    },
    {
      title: '24h Volume',
      value: '$2.5M',
      subtitle: 'Trading volume',
      icon: 'TrendingUp' as any,
      gradient: DashboardCardVariants.success,
      trend: { value: '+8.2%', isPositive: true }
    },
    {
      title: 'Staked Amount',
      value: '1,250 GOLD',
      subtitle: 'Earning 12.5% APY',
      icon: 'Lock' as any,
      gradient: DashboardCardVariants.warning,
      trend: { value: '+2.1%', isPositive: true }
    },
    {
      title: 'Total Users',
      value: '50,234',
      subtitle: 'Active traders',
      icon: 'Users' as any,
      gradient: DashboardCardVariants.info,
      trend: { value: '+15.3%', isPositive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <ModernDashboardCard
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          gradient={card.gradient}
          trend={card.trend}
          onClick={() => console.log(`Clicked ${card.title}`)}
        />
      ))}
    </div>
  );
} 
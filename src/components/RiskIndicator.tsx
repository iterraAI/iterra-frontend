import { Shield, AlertTriangle, AlertOctagon, XOctagon } from 'lucide-react';

interface RiskIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskIndicator({ riskLevel, riskScore, size = 'md' }: RiskIndicatorProps) {
  const config = {
    low: {
      icon: Shield,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      label: 'Low Risk',
      emoji: '✅'
    },
    medium: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      label: 'Medium Risk',
      emoji: '⚠️'
    },
    high: {
      icon: AlertOctagon,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      label: 'High Risk',
      emoji: '🔶'
    },
    critical: {
      icon: XOctagon,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'CRITICAL Risk',
      emoji: '🚨'
    }
  };

  const { icon: Icon, color, bg, border, label, emoji } = config[riskLevel];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${bg} ${border} border-2 rounded-lg ${sizeClasses[size]} font-semibold ${color}`}>
      <Icon size={iconSizes[size]} />
      <span>{emoji} {label}</span>
      {riskScore !== undefined && (
        <span className="ml-1 opacity-75">({riskScore}%)</span>
      )}
    </div>
  );
}


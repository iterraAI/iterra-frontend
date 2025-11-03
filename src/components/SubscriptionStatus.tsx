import { useQuery } from '@tanstack/react-query'
import { authenticatedGet } from '../utils/api'
import { Crown, Star, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface SubscriptionData {
  subscription: {
    plan: string
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
    monthlyUsage?: number // Deprecated
    credits?: {
      balance: number
      allocated: number
      used: number
      monthlyAllocated: number
    }
  }
  recentPayments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    description: string
    createdAt: string
  }>
}

interface SubscriptionStatusProps {
  className?: string
}

export default function SubscriptionStatus({ className = '' }: SubscriptionStatusProps) {
  const { data: subscriptionData, isLoading } = useQuery<SubscriptionData>({
    queryKey: ['subscription-details'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/payments/subscription')
      return res.data
    }
  })

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return <Zap className="text-blue-600" size={20} />
      case 'PRO':
        return <Star className="text-purple-600" size={20} />
      case 'PRO_PLUS':
        return <Star className="text-indigo-600" size={20} />
      case 'TEAMS':
        return <Crown className="text-yellow-600" size={20} />
      case 'ENTERPRISE':
        return <Crown className="text-orange-600" size={20} />
      default:
        return <Zap className="text-gray-600" size={20} />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-600" size={16} />
      case 'cancelled':
        return <AlertCircle className="text-red-600" size={16} />
      case 'past_due':
        return <Clock className="text-yellow-600" size={16} />
      default:
        return <AlertCircle className="text-gray-600" size={16} />
    }
  }

  const getPlanCredits = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return 15
      case 'PRO':
        return 200
      case 'PRO_PLUS':
        return 400
      case 'TEAMS':
        return 1000
      case 'ENTERPRISE':
        return 0 // Custom
      default:
        return 0
    }
  }

  const getUsagePercentage = (used: number, allocated: number) => {
    if (allocated === 0 || allocated === -1) return 0
    return Math.round((used / allocated) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const { subscription } = subscriptionData || {}
  
  // Get credits data (prefer new format, fallback to old)
  const creditsAllocated = subscription?.credits?.allocated || getPlanCredits(subscription?.plan || 'FREE')
  const creditsBalance = subscription?.credits?.balance ?? (creditsAllocated - (subscription?.monthlyUsage || 0))
  const creditsUsed = subscription?.credits?.used || (creditsAllocated - creditsBalance)
  
  const usagePercentage = getUsagePercentage(creditsUsed, creditsAllocated)
  const usageColor = getUsageColor(usagePercentage)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getPlanIcon(subscription?.plan || 'FREE')}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {subscription?.plan || 'FREE'} Plan
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon(subscription?.status || 'active')}
          <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
            {subscription?.status || 'active'}
          </span>
        </div>
      </div>

      {/* Credit Balance */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Credits</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {creditsBalance.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / {creditsAllocated === 0 ? 'Custom' : creditsAllocated === -1 ? '∞' : creditsAllocated.toLocaleString()}
          </span>
        </div>
        {creditsAllocated > 0 && (
          <>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  usagePercentage >= 90 ? 'bg-red-500' :
                  usagePercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            {usagePercentage >= 80 && (
              <div className={`mt-2 text-xs px-2 py-1 rounded-full ${usageColor}`}>
                {usagePercentage >= 90 ? '⚠️ Credits running low' : '💡 Consider upgrading'}
              </div>
            )}
          </>
        )}
      </div>

      {/* Period Info */}
      {subscription?.currentPeriodEnd && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {subscription.status === 'active' ? 'Renews on' : 'Expires on'}:{' '}
          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
        </div>
      )}

      {/* Upgrade Prompt */}
      {subscription?.plan === 'FREE' && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 py-2 px-3 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  )
}

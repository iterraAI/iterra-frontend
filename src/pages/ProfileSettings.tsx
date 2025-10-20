import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  User, 
  BarChart3, 
  CreditCard, 
  Settings, 
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Crown,
  Star
} from 'lucide-react'
import { authenticatedGet } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Loader from '../components/Loader'
import ThemeSwitcher from '../components/ThemeSwitcher'
import logo from '../assets/logo_new.png'


interface UsageStats {
  totalSolutions: number
  monthlySolutions: number
  monthlyLimit: number
  lastResetDate: string
}

export default function ProfileSettings() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'billing' | 'settings'>('overview')

  // Fetch subscription data (use same query key as SubscriptionStatus component)
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription-details'],
    queryFn: async () => {
      try {
        const res = await authenticatedGet('/api/payments/subscription')
        return res.data
      } catch (error) {
        console.error('Failed to fetch subscription data:', error)
        // Return fallback data with correct structure
        return {
          success: true,
          subscription: {
            plan: 'FREE',
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            monthlyUsage: 0
          },
          recentPayments: []
        }
      }
    },
    enabled: !!user
  })

  // Fetch usage stats
  const { data: usageStats, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      try {
        const res = await authenticatedGet('/api/payments/usage/stats')
        return res.data
      } catch (error) {
        console.error('Failed to fetch usage stats:', error)
        // Return fallback data
        return {
          totalSolutions: 0,
          monthlySolutions: 0,
          monthlyLimit: 10,
          lastResetDate: new Date().toISOString()
        }
      }
    },
    enabled: !!user
  })

  const isLoading = subscriptionLoading || usageLoading

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'usage', name: 'Usage', icon: BarChart3 },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ] as const

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return <Star className="text-gray-500" size={20} />
      case 'PRO':
        return <Zap className="text-blue-500" size={20} />
      case 'ENTERPRISE':
        return <Crown className="text-purple-500" size={20} />
      default:
        return <Star className="text-gray-500" size={20} />
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">Free</span>
      case 'PRO':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">Pro</span>
      case 'ENTERPRISE':
        return <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">Enterprise</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">Free</span>
    }
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading profile settings..." />
  }

  return (
    <div className="min-h-screen ">
    {/* <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50/30 dark:bg-[var(--bg-secondary)]"> */}
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="pl-4 pr-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Kodin" className='h-12 w-42' />
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
                <ArrowRight size={18} />
              </Link>
              {/* <ThemeSwitcher /> */}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6">
                <img
                  src={user?.avatarUrl}
                  alt={user?.username}
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-green-500"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <div className="mt-2">
                  {getPlanBadge(subscriptionData?.subscription?.plan || 'FREE')}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account Overview</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account and subscription details</p>
                  </div>

                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlanIcon(subscriptionData?.subscription?.plan || 'FREE')}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {subscriptionData?.subscription?.plan || 'FREE'} Plan
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Status: <span className="capitalize">{subscriptionData?.subscription?.status || 'active'}</span>
                          </p>
                        </div>
                      </div>
                      <Link to="/pricing" className="btn btn-primary">
                        Upgrade Plan
                      </Link>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="text-blue-500" size={20} />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Monthly Usage</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {usageStats?.monthlySolutions || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        of {subscriptionData?.subscription?.plan === 'ENTERPRISE' ? '∞' : 
                            subscriptionData?.subscription?.plan === 'PRO' ? '100' : '10'} solutions
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Success Rate</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">87%</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average success rate</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="text-purple-500" size={20} />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Member Since</h4>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Account created</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Usage Statistics</h2>
                    <p className="text-gray-600 dark:text-gray-300">Track your AI solution usage and limits</p>
                  </div>

                  {/* Usage Overview */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Current Month Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solutions Used</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {usageStats?.monthlySolutions || 0} / {usageStats?.monthlyLimit === -1 ? '∞' : usageStats?.monthlyLimit || 10}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: usageStats?.monthlyLimit === -1 ? '0%' : 
                                `${Math.min(((usageStats?.monthlySolutions || 0) / (usageStats?.monthlyLimit || 10)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {usageStats?.totalSolutions || 0}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Total Solutions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {usageStats?.monthlySolutions || 0}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">This Month</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Tips */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">💡 Usage Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Use specific and detailed issue descriptions for better AI solutions</li>
                      <li>• Review and validate solutions before implementing them</li>
                      <li>• Upgrade to Pro or Enterprise for higher usage limits</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Billing & Subscription</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your subscription and payment details</p>
                  </div>

                  {/* Current Subscription */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Current Subscription</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {subscriptionData?.subscription?.plan || 'FREE'} Plan
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Status: <span className="capitalize">{subscriptionData?.subscription?.status || 'active'}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${subscriptionData?.subscription?.plan === 'PRO' ? '15' : subscriptionData?.subscription?.plan === 'ENTERPRISE' ? '50' : '0'}/month
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Next billing date</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {subscriptionData?.subscription?.currentPeriodEnd ? 
                              new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString() : 
                              'N/A'
                            }
                          </p>
                        </div>
                        <Link to="/pricing" className="btn btn-primary">
                          Change Plan
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Methods</h3>
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 dark:text-gray-300 mb-4">No payment methods on file</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payment methods will be added when you upgrade to a paid plan
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account Settings</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and security</p>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={user?.username || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Choose your preferred theme</p>
                        </div>
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">GitHub Authentication</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Connected via GitHub OAuth
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={20} />
                          <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

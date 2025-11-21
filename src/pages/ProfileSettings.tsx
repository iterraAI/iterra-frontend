import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  User,
  BarChart3,
  CreditCard,
  Settings,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { authenticatedGet } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import Loader from '../components/Loader'
import ThemeSwitcher from '../components/ThemeSwitcher'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'


interface UsageHistoryItem {
  id: string
  date: string
  model: string
  repository: string
  credits: number
}

interface UsageHistoryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UsageStats {
  totalSolutions: number
  monthlySolutions: number
  monthlyLimit: number
  credits?: {
    balance: number
    allocated: number
    used: number
    usagePercentage: number
  }
  usageHistory?: UsageHistoryItem[]
  pagination?: UsageHistoryPagination
  lastResetDate: string
}

export default function ProfileSettings() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'billing' | 'settings'>('overview')
  const [usageFilterDays, setUsageFilterDays] = useState<number | null>(7) // Default to 7 days
  const [usagePage, setUsagePage] = useState(1)

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

  // Fetch usage stats with pagination and filtering
  const { data: usageStats, isLoading: usageLoading } = useQuery<UsageStats>({
    queryKey: ['usage-stats', usageFilterDays, usagePage],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        if (usageFilterDays) params.append('days', usageFilterDays.toString())
        params.append('page', usagePage.toString())
        params.append('limit', '100')

        const res = await authenticatedGet(`/api/payments/usage/stats?${params.toString()}`)
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
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
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
            <div className="sticky top-24">
              {/* User Info - Minimal */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.avatarUrl}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.username}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div>
                  {getPlanBadge(subscriptionData?.subscription?.plan || 'FREE')}
                </div>
              </div>

              {/* Navigation Tabs - Minimal */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${activeTab === tab.id
                          ? 'text-green-600 dark:text-green-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                    >
                      <Icon size={16} />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content - Minimal */}
          <div className="lg:col-span-3">
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Current Plan */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {subscriptionData?.subscription?.plan || 'FREE'}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {subscriptionData?.subscription?.status || 'active'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subscriptionData?.subscription?.plan === 'PRO' ? '$20/month' :
                            subscriptionData?.subscription?.plan === 'PRO_PLUS' ? '$50/month' :
                              subscriptionData?.subscription?.plan === 'TEAMS' ? '$150/month' :
                                subscriptionData?.subscription?.plan === 'ENTERPRISE' ? 'Custom pricing' :
                                  'Free'}
                        </p>
                      </div>
                      {subscriptionData?.subscription?.plan !== 'ENTERPRISE' && (
                        <Link to="/pricing" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                          Change plan
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Credits</p>
                      <p className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                        {subscriptionData?.subscription?.credits?.balance?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '0.0'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        of {subscriptionData?.subscription?.credits?.allocated?.toLocaleString() || '0'} allocated
                      </p>
                    </div>
                    {subscriptionData?.subscription?.credits?.allocated > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full transition-all"
                          style={{
                            width: `${100 - ((subscriptionData?.subscription?.credits?.balance || 0) / (subscriptionData?.subscription?.credits?.allocated || 1) * 100)}%`
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Solutions</p>
                      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {usageStats?.totalSolutions || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {usageStats?.monthlySolutions || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Credits Used</p>
                      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {(subscriptionData?.subscription?.credits?.used || usageStats?.credits?.used || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div className="space-y-8">
                  {/* Credits Usage */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Credits</p>
                        <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                          {(subscriptionData?.subscription?.credits?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / {subscriptionData?.subscription?.credits?.allocated?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Used</p>
                        <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                          {(subscriptionData?.subscription?.credits?.used || usageStats?.credits?.used || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </p>
                      </div>
                    </div>
                    {subscriptionData?.subscription?.credits?.allocated > 0 && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full transition-all"
                          style={{
                            width: `${Math.min(((subscriptionData?.subscription?.credits?.used || 0) / (subscriptionData?.subscription?.credits?.allocated || 1)) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Solutions Stats */}
                  <div className="grid grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Solutions</p>
                      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {usageStats?.totalSolutions || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {usageStats?.monthlySolutions || 0}
                      </p>
                    </div>
                  </div>

                  {/* Reset Date */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reset Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {subscriptionData?.subscription?.currentPeriodEnd ?
                        new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) :
                        'N/A'}
                    </p>
                  </div>

                  {/* Usage History - Table Style */}
                  <div>
                    {/* Filters */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setUsageFilterDays(1)
                            setUsagePage(1)
                          }}
                          className={`px-3 py-1 text-xs rounded transition-colors ${usageFilterDays === 1
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                          1d
                        </button>
                        <button
                          onClick={() => {
                            setUsageFilterDays(7)
                            setUsagePage(1)
                          }}
                          className={`px-3 py-1 text-xs rounded transition-colors ${usageFilterDays === 7
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                          7d
                        </button>
                        <button
                          onClick={() => {
                            setUsageFilterDays(30)
                            setUsagePage(1)
                          }}
                          className={`px-3 py-1 text-xs rounded transition-colors ${usageFilterDays === 30
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                          30d
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    {usageStats?.usageHistory && usageStats.usageHistory.length > 0 ? (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Model
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Repository
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Credits
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {usageStats.usageHistory.map((job) => (
                              <tr
                                key={job.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                              >
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                  {(() => {
                                    const date = new Date(job.date)
                                    const month = date.toLocaleDateString('en-US', { month: 'short' })
                                    const day = date.getDate()
                                    const time = date.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })
                                    return `${month} ${day}, ${time}`
                                  })()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                  {job.model}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                  {job.repository}
                                </td>
                                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                                  {job.credits.toFixed(1)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        {usageStats.pagination && usageStats.pagination.totalPages > 1 && (
                          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Showing {((usageStats.pagination.page - 1) * 100) + 1} - {Math.min(usageStats.pagination.page * 100, usageStats.pagination.total)} of {usageStats.pagination.total} events
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Rows per page: <span className="font-medium">100</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setUsagePage(1)}
                                  disabled={usageStats.pagination.page === 1}
                                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  ««
                                </button>
                                <button
                                  onClick={() => setUsagePage(p => Math.max(1, p - 1))}
                                  disabled={usageStats.pagination.page === 1}
                                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  «
                                </button>
                                <span className="px-3 py-1 text-xs text-gray-900 dark:text-gray-100">
                                  Page {usageStats.pagination.page} of {usageStats.pagination.totalPages}
                                </span>
                                <button
                                  onClick={() => setUsagePage(p => Math.min(usageStats.pagination!.totalPages, p + 1))}
                                  disabled={usageStats.pagination.page === usageStats.pagination.totalPages}
                                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  »
                                </button>
                                <button
                                  onClick={() => setUsagePage(usageStats.pagination!.totalPages)}
                                  disabled={usageStats.pagination.page === usageStats.pagination.totalPages}
                                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  »»
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No usage history yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  {/* Current Subscription */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Plan</p>
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {subscriptionData?.subscription?.plan || 'FREE'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Status: <span className="capitalize">{subscriptionData?.subscription?.status || 'active'}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Price</p>
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                          ${subscriptionData?.subscription?.plan === 'PRO' ? '20' :
                            subscriptionData?.subscription?.plan === 'PRO_PLUS' ? '50' :
                              subscriptionData?.subscription?.plan === 'TEAMS' ? '150' :
                                subscriptionData?.subscription?.plan === 'ENTERPRISE' ? 'Custom' : '0'}/month
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next billing date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {subscriptionData?.subscription?.currentPeriodEnd ?
                            new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString() :
                            'N/A'
                          }
                        </p>
                      </div>
                      <Link to="/pricing" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                        Change Plan
                      </Link>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">Payment Methods</p>
                    <div className="text-center py-6">
                      <CreditCard className="mx-auto text-gray-400 mb-3" size={32} />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">No payment methods on file</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment methods will be added when you upgrade to a paid plan
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Account Information */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 font-medium">Account Information</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                          Username
                        </label>
                        <input
                          type="text"
                          value={user?.username || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 font-medium">Preferences</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">Theme</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                      </div>
                      <ThemeSwitcher />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 font-medium">Security</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">GitHub Authentication</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Connected via GitHub OAuth
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={16} />
                        <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
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

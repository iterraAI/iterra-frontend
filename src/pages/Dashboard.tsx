import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AlertCircle, GitPullRequest, CheckCircle, TrendingUp, ArrowRight, Zap, GitFork } from 'lucide-react'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

export default function Dashboard() {
  const { data: issues, isLoading: issuesLoading, error: issuesError } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/issues')
      return res.data.issues
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false
  })

  const { data: prs, isLoading: prsLoading, error: prsError } = useQuery({
    queryKey: ['prs'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/prs')
      return res.data.pullRequests
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false
  })

  const { data: validations, isLoading: validationsLoading, error: validationsError } = useQuery({
    queryKey: ['validations'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/validations/pending')
      return res.data.solutions
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false
  })

  const isLoading = issuesLoading || prsLoading || validationsLoading
  const hasError = issuesError || prsError || validationsError

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading your dashboard..." />
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-4">There was an error loading your data. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Issues',
      value: (issues && Array.isArray(issues) ? issues.length : 0),
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/issues'
    },
    {
      name: 'Pending Validations',
      value: (validations && Array.isArray(validations) ? validations.length : 0),
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/validations'
    },
    {
      name: 'Pull Requests',
      value: (prs && Array.isArray(prs) ? prs.length : 0),
      icon: GitPullRequest,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/pull-requests'
    },
    {
      name: 'Success Rate',
      value: '87%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '#'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Here's your bug resolution overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link 
              key={stat.name} 
              to={stat.link} 
              className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.name}</p>
              <p className={`text-4xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300`}>{stat.value}</p>
              <div className="mt-3 flex items-center text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                <span>View details</span>
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="mr-2 text-green-600" size={24} />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/contribute" className="block group">
              <button className="btn btn-primary w-full justify-center text-base group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <GitFork size={20} />
                <span>Contribute to Open Source</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/repositories" className="block group">
              <button className="btn btn-outline w-full justify-center text-base group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                🔄 Sync My Repositories
              </button>
            </Link>
            <Link to="/issues" className="block group">
              <button className="btn btn-secondary w-full justify-center text-base group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                📋 View All Issues
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {(issues && Array.isArray(issues) ? issues.slice(0, 4) : []).map((issue: any) => (
              <Link 
                key={issue._id} 
                to={`/issues/${issue._id}/solve`}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 hover:bg-white transition-all border border-gray-200 hover:border-green-300 hover:shadow-md hover:-translate-y-0.5 group duration-200"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-green-600 transition-colors">
                    {issue.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">#{issue.issueNumber} • {issue.repoFullName}</p>
                </div>
                <span className={`ml-3 px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${
                  issue.status === 'pr_created' ? 'bg-green-100 text-green-700 border border-green-200' :
                  issue.status === 'solved' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  issue.status === 'closed' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                  'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {issue.status}
                </span>
              </Link>
            ))}
            {(!issues || !Array.isArray(issues) || issues.length === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-600 font-medium mb-2">No issues yet</p>
                <p className="text-gray-500 text-sm mb-4">Start by syncing your repositories or contributing to open source</p>
                <Link to="/repositories" className="btn btn-primary text-sm">
                  Sync Repositories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started Card (if no issues) */}
      {(!issues || issues.length === 0) && (
        <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Welcome to Bug Resolve!</h3>
              <p className="text-gray-600 mb-4">
                Get started by syncing your GitHub repositories or contribute to popular open-source projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/repositories" className="btn btn-primary">
                  Sync My Repos
                </Link>
                <Link to="/contribute" className="btn btn-outline">
                  Contribute to Open Source
                </Link>
              </div>
            </div>
            <div className="hidden md:block text-6xl">🚀</div>
          </div>
        </div>
      )}
    </div>
  )
}

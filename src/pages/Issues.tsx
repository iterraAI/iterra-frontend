import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AlertCircle, Sparkles, ExternalLink, RefreshCw, CheckCircle2, XCircle, Loader as LoaderIcon } from 'lucide-react'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

type TabType = 'all' | 'open' | 'closed'

export default function Issues() {
  const [activeTab, setActiveTab] = useState<TabType>('open')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/issues')
      return res.data
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pr_created':
        return 'bg-purple-100 text-purple-700'
      case 'solved':
        return 'bg-blue-100 text-blue-700'
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'open':
      case 'pending':
        return 'bg-green-100 text-green-700'
      case 'closed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pr_created':
      case 'solved':
        return <CheckCircle2 className="text-purple-600" size={20} />
      case 'analyzing':
        return <LoaderIcon className="text-yellow-600 animate-spin" size={20} />
      case 'failed':
        return <XCircle className="text-red-600" size={20} />
      case 'closed':
        return <CheckCircle2 className="text-gray-600" size={20} />
      case 'open':
      case 'pending':
      default:
        return <AlertCircle className="text-orange-600" size={20} />
    }
  }

  // Determine if issue is "closed" (solved/pr_created/failed/closed) or "open"
  const isIssueClosed = (status: string) => {
    return ['solved', 'pr_created', 'failed', 'closed'].includes(status)
  }

  // Filter issues based on active tab
  const filteredIssues = data?.issues?.filter((issue: any) => {
    if (activeTab === 'all') return true
    if (activeTab === 'open') return !isIssueClosed(issue.status)
    if (activeTab === 'closed') return isIssueClosed(issue.status)
    return true
  }) || []

  // Count issues by status
  const counts = {
    all: data?.issues?.length || 0,
    open: data?.issues?.filter((issue: any) => !isIssueClosed(issue.status)).length || 0,
    closed: data?.issues?.filter((issue: any) => isIssueClosed(issue.status)).length || 0
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading your issues..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Issues</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Select an issue to solve with AI
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs - GitHub Style */}
      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-[var(--border-primary)]">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'open'
                ? 'border-green-600 text-green-700 bg-green-50 dark:bg-[rgba(16,185,129,0.08)]'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#141519]'
            }`}
          >
            <AlertCircle size={18} />
            <span>Open</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#1e1f23] text-gray-600 dark:text-gray-300'
            }`}>
              {counts.open}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('closed')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'closed'
                ? 'border-purple-600 text-purple-700 bg-purple-50 dark:bg-[#1a1323]'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#141519]'
            }`}
          >
            <CheckCircle2 size={18} />
            <span>Closed</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'closed' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 dark:bg-[#1e1f23] text-gray-600 dark:text-gray-300'
            }`}>
              {counts.closed}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-700 bg-blue-50 dark:bg-[#101520]'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#141519]'
            }`}
          >
            <span>All</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-[#1e1f23] text-gray-600 dark:text-gray-300'
            }`}>
              {counts.all}
            </span>
          </button>
        </div>

        {/* Issues List */}
        <div className="p-4 space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                {activeTab === 'open' && 'No open issues'}
                {activeTab === 'closed' && 'No closed issues'}
                {activeTab === 'all' && 'No issues found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {activeTab === 'all' 
                  ? 'Fetch issues from your repositories to get started'
                  : `Switch to another tab to see ${activeTab === 'open' ? 'closed' : 'open'} issues`
                }
              </p>
              {activeTab === 'all' && (
                <Link to="/repositories">
                  <button className="btn btn-primary mt-4">
                    Go to Repositories
                  </button>
                </Link>
              )}
            </div>
          ) : (
            filteredIssues.map((issue: any) => (
              <div key={issue._id} className="border border-gray-200 dark:border-[var(--border-primary)] rounded-lg p-4 hover:shadow-md transition-all bg-white dark:bg-[var(--card-bg)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                      issue.status === 'pr_created' || issue.status === 'solved' ? 'bg-purple-100 dark:bg-[#2a193d]' :
                      issue.status === 'analyzing' ? 'bg-yellow-100 dark:bg-[#2a210f]' :
                      issue.status === 'failed' ? 'bg-red-100 dark:bg-[#2a1212]' :
                      issue.status === 'closed' ? 'bg-gray-100 dark:bg-[#1e1f23]' : 'bg-orange-100 dark:bg-[#2a1e12]'
                    }`}>
                      {getStatusIcon(issue.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{issue.title}</h3>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">#{issue.issueNumber}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {issue.body || 'No description provided'}
                      </p>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{issue.repoFullName}</span>
                        {issue.labels?.map((label: string) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-blue-100 dark:bg-[#1e1f23] text-blue-700 dark:text-gray-300 text-xs rounded"
                          >
                            {label}
                          </span>
                        ))}
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(issue.status)}`}>
                          {issue.status === 'pr_created' ? 'PR Created' : 
                           issue.status === 'pending' ? 'open' : issue.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(issue.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-3">
                        <a
                          href={issue.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                        >
                          <span>View on GitHub</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {!isIssueClosed(issue.status) && (
                      <Link to={`/issues/${issue._id}/solve`}>
                        <button className="btn btn-primary flex items-center space-x-2 text-sm whitespace-nowrap">
                          <Sparkles size={16} />
                          <span>Solve with AI</span>
                        </button>
                      </Link>
                    )}
                    {issue.status === 'solved' && (
                      <Link to={`/validations`}>
                        <button className="btn btn-secondary text-sm whitespace-nowrap">
                          View Solution
                        </button>
                      </Link>
                    )}
                    {issue.status === 'pr_created' && (
                      <Link to={`/pull-requests`}>
                        <button className="btn btn-secondary text-sm whitespace-nowrap">
                          View PR
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

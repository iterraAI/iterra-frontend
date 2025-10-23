import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitPullRequest, ExternalLink, RefreshCw, CheckCircle, GitMerge, XCircle, AlertTriangle, Tag } from 'lucide-react'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

type TabType = 'all' | 'open' | 'closed'

export default function PullRequests() {
  const [activeTab, setActiveTab] = useState<TabType>('open')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['pull-requests'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/prs')
      return res.data
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'merged':
        return 'bg-purple-100 text-purple-700'
      case 'open':
        return 'bg-green-100 text-green-700'
      case 'closed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'merged':
        return <GitMerge className="text-purple-600" size={24} />
      case 'open':
        return <GitPullRequest className="text-green-600" size={24} />
      case 'closed':
        return <XCircle className="text-red-600" size={24} />
      default:
        return <GitPullRequest className="text-gray-600" size={24} />
    }
  }

  // Filter PRs based on active tab
  const filteredPRs = data?.pullRequests?.filter((pr: any) => {
    if (activeTab === 'all') return true
    if (activeTab === 'open') return pr.status === 'open'
    if (activeTab === 'closed') return pr.status === 'closed' || pr.status === 'merged'
    return true
  }) || []

  // Count PRs by status
  const counts = {
    all: data?.pullRequests?.length || 0,
    open: data?.pullRequests?.filter((pr: any) => pr.status === 'open').length || 0,
    closed: data?.pullRequests?.filter((pr: any) => pr.status === 'closed' || pr.status === 'merged').length || 0
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading pull requests..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pull Requests</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track all pull requests created by Kodin
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          <span>Sync Status</span>
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
            <GitPullRequest size={18} />
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
            <CheckCircle size={18} />
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

        {/* PR List */}
        <div className="p-4 space-y-4">
          {filteredPRs.length === 0 ? (
            <div className="text-center py-12">
              <GitPullRequest className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                {activeTab === 'open' && 'No open pull requests'}
                {activeTab === 'closed' && 'No closed pull requests'}
                {activeTab === 'all' && 'No pull requests yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {activeTab === 'all' 
                  ? 'Create your first PR by validating and approving a solution'
                  : `Switch to another tab to see ${activeTab === 'open' ? 'closed' : 'open'} PRs`
                }
              </p>
            </div>
          ) : (
            filteredPRs.map((pr: any) => (
              <div key={pr._id} className="border border-gray-200 dark:border-[var(--border-primary)] rounded-lg p-4 hover:shadow-md transition-all bg-white dark:bg-[var(--card-bg)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                      pr.status === 'merged' ? 'bg-purple-100 dark:bg-[#2a193d]' :
                      pr.status === 'open' ? 'bg-green-100 dark:bg-[rgba(16,185,129,0.12)]' : 
                      pr.status === 'closed' ? 'bg-red-100 dark:bg-[#2a1212]' : 'bg-gray-100 dark:bg-[#1e1f23]'
                    }`}>
                      {getStatusIcon(pr.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{pr.title}</h3>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">#{pr.prNumber}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {pr.repoFullName} • {pr.branchName} → {pr.baseBranch}
                      </p>
                      <div className="flex items-center space-x-4 flex-wrap gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(pr.status)}`}>
                          {pr.status}
                        </span>
                        {pr.status === 'merged' && (
                          <span className="flex items-center space-x-1 text-xs text-purple-600">
                            <GitMerge size={14} />
                            <span>Merged</span>
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(pr.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {/* Enhanced PR Metadata */}
                      {pr.metadata && (
                        <div className="mt-3 space-y-2">
                          {/* Labels */}
                          {pr.metadata.labels && pr.metadata.labels.length > 0 && (
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              <Tag size={14} className="text-gray-500 dark:text-gray-400" />
                              {pr.metadata.labels.map((label: string, idx: number) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    label === 'bug' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    label === 'enhancement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    label === 'security' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                    label === 'performance' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    label === 'ui' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                    label === 'documentation' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                  }`}
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Breaking Changes Warning */}
                          {pr.metadata.hasBreakingChanges && (
                            <div className="flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-md border border-orange-200 dark:border-orange-900/50">
                              <AlertTriangle size={16} />
                              <span className="font-medium">Contains Breaking Changes</span>
                            </div>
                          )}
                          
                          {/* Repository Guidelines Badge */}
                          {pr.metadata.generatedWithGuidelines && (
                            <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle size={14} />
                              <span>Follows repository guidelines</span>
                            </div>
                          )}
                        </div>
                      )}
                      {pr.htmlUrl && (
                        <div className="mt-3">
                          <a
                            href={pr.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                          >
                            <span>View on GitHub</span>
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {pr.htmlUrl && (
                      <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-primary text-sm">
                          View PR
                        </button>
                      </a>
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

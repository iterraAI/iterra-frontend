import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import toast from 'react-hot-toast'
import { GitBranch, RefreshCw, ExternalLink, Lock, CheckCircle, Settings, AlertCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { authenticatedGet, authenticatedPost } from '../utils/api'
import { useEffect } from 'react'

export default function Repositories() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/github/repositories')
      return res.data
    }
  })

  // Check for authorization callback
  useEffect(() => {
    const authorized = searchParams.get('authorized')
    const error = searchParams.get('error')
    
    if (authorized === 'true') {
      toast.success('Repository access authorized successfully!')
      refetch()
      // Clean up URL
      window.history.replaceState({}, '', '/repositories')
    } else if (error) {
      toast.error('Failed to authorize repository access')
      // Clean up URL
      window.history.replaceState({}, '', '/repositories')
    }
  }, [searchParams, refetch])

  const syncMutation = useMutation({
    mutationFn: async ({ owner, repo }: { owner: string; repo: string }) => {
      const res = await authenticatedPost(`/api/github/repositories/${owner}/${repo}/sync`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Repository synced successfully')
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
      // Invalidate issues when fetching from repos
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
    onError: () => {
      toast.error('Failed to sync repository')
    }
  })

  const fetchIssuesMutation = useMutation({
    mutationFn: async ({ owner, repo }: { owner: string; repo: string }) => {
      const res = await authenticatedGet(`/api/github/repositories/${owner}/${repo}/issues`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(`Fetched ${data.count} issues`)
      // Invalidate issues to refresh the list
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      navigate('/issues')
    },
    onError: () => {
      toast.error('Failed to fetch issues')
    }
  })

  const handleFetchIssues = (fullName: string) => {
    const [owner, repo] = fullName.split('/')
    fetchIssuesMutation.mutate({ owner, repo })
  }

  const handleAuthorizeRepositories = () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      toast.error('Please login first')
      return
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/github/repos?token=${token}`
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading repositories..." />
  }

  // Check if repository authorization is required
  const requiresAuthorization = data?.requiresAuthorization === true

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Repositories</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your GitHub repositories and sync issues
          </p>
        </div>
        {!requiresAuthorization && (
          <button
            onClick={() => refetch()}
            className="btn btn-primary flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Repository Authorization Required */}
      {requiresAuthorization && (
        <div className="card border-2 border-green-500 dark:border-emerald-500 bg-gradient-to-br from-white to-green-50 dark:from-[var(--card-bg)] dark:to-[rgba(16,185,129,0.05)]">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-green-100 dark:bg-[rgba(16,185,129,0.12)] rounded-xl flex items-center justify-center">
                <Lock className="text-green-600 dark:text-emerald-400" size={32} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Repository Access Required
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To protect your privacy, we only request access to your repositories when you need them. 
                Click the button below to authorize Kodin to access your GitHub repositories.
              </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>You choose which repositories</strong> - On GitHub's page, select "Only select repositories" and pick specific repos
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Secure & Safe</strong> - You can revoke access at any time from your GitHub settings
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Read & Write Access</strong> - Required to create branches and submit pull requests
                  </p>
                </div>
              </div>

              <button
                onClick={handleAuthorizeRepositories}
                className="btn btn-primary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <Lock size={20} />
                <span>Authorize Repository Access</span>
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                By authorizing, you'll be redirected to GitHub to grant permissions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Repository Access Management Card */}
      {!requiresAuthorization && (
        <div className="card bg-blue-50 dark:bg-[rgba(59,130,246,0.05)] border border-blue-200 dark:border-blue-900">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-[rgba(59,130,246,0.12)] rounded-lg flex items-center justify-center">
                <Settings className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Manage Repository Access
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Don't see all your repositories? Click "Re-authorize" below and <strong>select specific repositories</strong> you want to work with.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAuthorizeRepositories}
                  className="btn btn-secondary text-sm flex items-center space-x-2"
                >
                  <Lock size={16} />
                  <span>Re-authorize Access</span>
                </button>
                <a
                  href="https://github.com/settings/installations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-sm flex items-center space-x-2"
                >
                  <ExternalLink size={16} />
                  <span>Manage on GitHub</span>
                </a>
              </div>
              <div className="mt-3 p-3 bg-blue-100 dark:bg-[rgba(59,130,246,0.1)] rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>How to select specific repositories:</strong>
                    <ol className="mt-1 ml-4 list-decimal space-y-1">
                      <li>Click "Re-authorize Access" button</li>
                      <li>On GitHub, click the <strong>"Repositories"</strong> dropdown</li>
                      <li>Choose <strong>"Only select repositories"</strong></li>
                      <li>Select the specific repos you want to work with</li>
                      <li>Click "Authorize" to confirm</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repositories List */}
      {!requiresAuthorization && (
        <div className="grid gap-4">
          {data?.repositories?.map((repo: any) => (
          <div key={repo._id} className="card hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-green-100 dark:bg-[rgba(16,185,129,0.12)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <GitBranch className="text-green-600 dark:text-emerald-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">{repo.name}</h3>
                    {repo.isPrivate && (
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-[#1e1f23] text-gray-700 dark:text-gray-300 text-xs rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{repo.fullName}</p>
                  {repo.description && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-3">
                    {repo.language && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-emerald-400 mr-1"></span>
                        {repo.language}
                      </span>
                    )}
                    <a
                      href={repo.htmlUrl}
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
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => handleFetchIssues(repo.fullName)}
                  disabled={fetchIssuesMutation.isPending}
                  className="btn btn-primary text-sm whitespace-nowrap"
                >
                  {fetchIssuesMutation.isPending ? 'Fetching...' : 'Fetch Issues'}
                </button>
                <button
                  onClick={() => {
                    const [owner, repoName] = repo.fullName.split('/')
                    syncMutation.mutate({ owner, repo: repoName })
                  }}
                  disabled={syncMutation.isPending}
                  className="btn btn-secondary text-sm"
                >
                  {syncMutation.isPending ? 'Syncing...' : 'Sync'}
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {!requiresAuthorization && data?.repositories?.length === 0 && (
        <div className="card text-center py-12">
          <GitBranch className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No repositories found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Click refresh to sync your GitHub repositories
          </p>
        </div>
      )}
    </div>
  )
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import toast from 'react-hot-toast'
import { GitBranch, RefreshCw, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { authenticatedGet, authenticatedPost } from '../utils/api'

export default function Repositories() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/github/repositories')
      return res.data
    }
  })

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

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading repositories..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Repositories</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your GitHub repositories and sync issues
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-primary flex items-center space-x-2"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

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

      {data?.repositories?.length === 0 && (
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

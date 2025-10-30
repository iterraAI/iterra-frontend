import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Github, 
  Twitter, 
  Linkedin,
  RefreshCw,
  Search,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react'
import Loader from '../components/Loader'
import { adminAPI } from '../utils/api'

interface WaitlistEntry {
  _id: string
  name?: string
  email: string
  githubId: string
  githubUsername?: string
  twitterHandle?: string
  linkedinUrl?: string
  whyUseKodin?: string
  sharedOnX: boolean
  sharedOnLinkedIn: boolean
  sharingCompletedAt?: string
  status: 'pending_submission' | 'pending_sharing' | 'pending_review' | 'approved' | 'rejected' | 'expired'
  createdAt: string
  updatedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null)
  const queryClient = useQueryClient()

  // Fetch waitlist entries
  const { data: responseData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-waitlist'],
    queryFn: async () => {
      const res = await adminAPI.getWaitlistEntries()
      return res.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true
  })

  // Extract entries array from response
  const entries = responseData?.entries || []

  // Approve entry mutation
  const approveMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const res = await adminAPI.approveEntry(entryId)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-waitlist'] })
      setSelectedEntry(null)
    }
  })

  // Reject entry mutation
  const rejectMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const res = await adminAPI.rejectEntry(entryId)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-waitlist'] })
      setSelectedEntry(null)
    }
  })

  // Generate new code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const res = await adminAPI.generateNewCode(entryId)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-waitlist'] })
      setSelectedEntry(null)
    }
  })

  // Filter entries based on search and status
  const filteredEntries = entries?.filter((entry: WaitlistEntry) => {
    const matchesSearch = 
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.githubId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.githubUsername?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  // Get status counts
  const statusCounts = entries?.reduce((acc: any, entry: WaitlistEntry) => {
    acc[entry.status] = (acc[entry.status] || 0) + 1
    return acc
  }, {}) || {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_submission': return 'text-yellow-600 bg-yellow-100'
      case 'pending_sharing': return 'text-blue-600 bg-blue-100'
      case 'pending_review': return 'text-orange-600 bg-orange-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'expired': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'pending_review': return <Clock className="w-4 h-4" />
      case 'pending_sharing': return <RefreshCw className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading admin dashboard..." />
  }

  if (error) {
    console.error('AdminDashboard error:', error)
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-center">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to load admin dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error instanceof Error ? error.message : 'There was an error loading the waitlist data.'}
          </p>
          <button 
            onClick={() => refetch()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage waitlist entries and access codes</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{entries?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statusCounts.pending_review || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statusCounts.approved || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statusCounts.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or GitHub ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending_submission">Pending Submission</option>
              <option value="pending_sharing">Pending Sharing</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">GitHub</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEntries.map((entry: WaitlistEntry) => (
                <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Github className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.githubUsername || entry.githubId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {entry.githubId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {entry.twitterHandle && (
                        <div className="flex items-center text-blue-500">
                          <Twitter className="w-4 h-4" />
                        </div>
                      )}
                      {entry.linkedinUrl && (
                        <div className="flex items-center text-blue-600">
                          <Linkedin className="w-4 h-4" />
                        </div>
                      )}
                      {!entry.twitterHandle && !entry.linkedinUrl && (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      <span className="ml-1 capitalize">{entry.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        View
                      </button>
                      {entry.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => approveMutation.mutate(entry._id)}
                            disabled={approveMutation.isPending}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(entry._id)}
                            disabled={rejectMutation.isPending}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {entry.status === 'approved' && (
                        <button
                          onClick={() => generateCodeMutation.mutate(entry._id)}
                          disabled={generateCodeMutation.isPending}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Entry Details</h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedEntry.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedEntry.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedEntry.githubUsername || selectedEntry.githubId} (ID: {selectedEntry.githubId})
                  </p>
                </div>

                {selectedEntry.twitterHandle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">@{selectedEntry.twitterHandle}</p>
                  </div>
                )}

                {selectedEntry.linkedinUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
                    <a 
                      href={selectedEntry.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {selectedEntry.linkedinUrl}
                    </a>
                  </div>
                )}

                {selectedEntry.whyUseKodin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Why use Kodin?</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedEntry.whyUseKodin}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}>
                    {getStatusIcon(selectedEntry.status)}
                    <span className="ml-1 capitalize">{selectedEntry.status.replace('_', ' ')}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedEntry.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedEntry.reviewedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reviewed</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedEntry.reviewedAt).toLocaleString()} by {selectedEntry.reviewedBy}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {selectedEntry.status === 'pending_review' && (
                  <>
                    <button
                      onClick={() => {
                        approveMutation.mutate(selectedEntry._id)
                        setSelectedEntry(null)
                      }}
                      disabled={approveMutation.isPending}
                      className="btn btn-primary"
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        rejectMutation.mutate(selectedEntry._id)
                        setSelectedEntry(null)
                      }}
                      disabled={rejectMutation.isPending}
                      className="btn btn-danger"
                    >
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
                {selectedEntry.status === 'approved' && (
                  <button
                    onClick={() => {
                      generateCodeMutation.mutate(selectedEntry._id)
                      setSelectedEntry(null)
                    }}
                    disabled={generateCodeMutation.isPending}
                    className="btn btn-primary"
                  >
                    {generateCodeMutation.isPending ? 'Generating...' : 'Generate New Code'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

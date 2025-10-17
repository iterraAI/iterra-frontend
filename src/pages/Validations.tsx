import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle, FileCode, AlertTriangle, Trash2 } from 'lucide-react'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

export default function Validations() {
  const queryClient = useQueryClient()
  
  const { data, isLoading } = useQuery({
    queryKey: ['validations'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/validations/pending')
      return res.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (solutionId: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('auth_token')
      await axios.delete(`${apiUrl}/api/validations/${solutionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    },
    onSuccess: () => {
      toast.success('Solution deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['validations'] })
    },
    onError: () => {
      toast.error('Failed to delete solution')
    }
  })

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading validations..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validations</h1>
        <p className="text-gray-600 mt-2">
          Review AI-generated solutions before creating pull requests
        </p>
      </div>

      {data?.solutions?.length > 0 && (
        <div className="card bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-yellow-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-lg text-yellow-900">Human Validation Required</h3>
              <p className="text-gray-700 text-sm mt-1">
                These AI-generated solutions need your review. Validate them to ensure quality
                before creating pull requests. This is the 30% human part of our 70/30 approach.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {data?.solutions?.map((solution: any) => (
          <div key={solution._id} className="card hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-yellow-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {solution.issueId?.title || 'Issue'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {solution.analysis?.substring(0, 200)}...
                  </p>
                  <div className="flex items-center flex-wrap gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileCode size={16} className="text-gray-500" />
                      <span className="text-gray-600">
                        {solution.filesChanged?.length || 0} files changed
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {solution.aiModel}
                    </span>
                    <span className={`font-semibold ${getConfidenceColor(solution.confidence)}`}>
                      {solution.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex gap-2">
                <Link to={`/validations/${solution._id}`}>
                  <button className="btn btn-primary text-sm whitespace-nowrap">
                    Review & Validate
                  </button>
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this solution?')) {
                      deleteMutation.mutate(solution._id)
                    }
                  }}
                  className="btn btn-danger text-sm p-2"
                  title="Delete solution"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.solutions?.length === 0 && (
        <div className="card text-center py-12">
          <CheckCircle className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No pending validations</h3>
          <p className="text-gray-500 mt-2">
            Generate solutions for issues to start validating
          </p>
          <Link to="/issues">
            <button className="btn btn-primary mt-4">
              Go to Issues
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import axios from 'axios'
import { authenticatedPost } from '../utils/api'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Edit, FileCode, AlertCircle, AlertTriangle, Lightbulb, CheckSquare, Shield } from 'lucide-react'
import RiskIndicator from '../components/RiskIndicator'
import ChangeStats from '../components/ChangeStats'
import DiffViewer from '../components/DiffViewer'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

export default function ValidationDetail() {
  const { solutionId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [comments, setComments] = useState('')
  const [editMode, setEditMode] = useState<number | null>(null)
  const [editedContent, setEditedContent] = useState('')

  // Fetch solution details
  const { data: solution, isLoading } = useQuery({
    queryKey: ['solution', solutionId],
    queryFn: async () => {
      // For now, we'll get it from validations
      const res = await authenticatedGet('/api/validations/pending')
      const sol = res.data.solutions.find((s: any) => s._id === solutionId)
      return sol
    }
  })

  // Validate mutation
  const validateMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await authenticatedPost(`/api/validations/${solutionId}/validate`, { status, comments })
      return res.data
    },
    onSuccess: (data) => {
      if (data.githubUrl) {
        // PR was created!
        toast.success(
          <div>
            <div className="font-bold">✅ PR Created Successfully!</div>
            <a 
              href={data.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              View on GitHub →
            </a>
          </div>,
          { duration: 10000 }
        )
      } else {
        toast.success('Solution validated successfully!')
      }
      // Invalidate specific queries instead of broad invalidation
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      queryClient.invalidateQueries({ queryKey: ['prs'] })
      // Don't invalidate issues as it affects dashboard
      setTimeout(() => navigate('/pull-requests'), 2000)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Validation failed')
    }
  })

  // Modify mutation
  const modifyMutation = useMutation({
    mutationFn: async (modifications: any[]) => {
      const res = await authenticatedPost(`/api/validations/${solutionId}/modify`, { modifications, comments })
      return res.data
    },
    onSuccess: () => {
      toast.success('Solution modified successfully!')
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      setEditMode(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Modification failed')
    }
  })

  const handleEdit = (index: number, content: string) => {
    setEditMode(index)
    setEditedContent(content)
  }

  const handleSaveEdit = (filename: string, originalContent: string) => {
    const modifications = [{
      filename,
      originalContent,
      modifiedContent: editedContent,
      reason: comments || 'Manual modification'
    }]
    modifyMutation.mutate(modifications)
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Loading solution details..." />
  }

  if (!solution) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="mx-auto text-gray-400" size={48} />
        <h3 className="mt-4 text-lg font-medium">Solution not found</h3>
      </div>
    )
  }

  // Extract enhanced metadata
  const metadata = solution.metadata || {};
  const classification = metadata.classification || {};
  const validation = metadata.validation || {};
  const riskLevel: 'low' | 'medium' | 'high' | 'critical' = validation.riskLevel || (metadata.riskScore > 70 ? 'high' : metadata.riskScore > 40 ? 'medium' : 'low');

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Validate Solution</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Review this AI-generated solution carefully before creating a pull request
        </p>
      </div>

      {/* Issue Info + Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">{solution.issueId?.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Issue #{solution.issueId?.issueNumber} • {solution.metadata?.repository}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-[#1e1f23] text-blue-700 dark:text-gray-300 text-sm rounded-lg font-medium">
              🤖 {solution.aiModel}
            </span>
            {classification.type && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-[#2a193d] text-purple-700 dark:text-gray-300 text-sm rounded-lg font-medium">
                📝 {classification.type}
              </span>
            )}
            {classification.complexity && (
              <span className={`px-3 py-1 text-sm rounded-lg font-medium ${
                classification.complexity === 'simple' ? 'bg-green-100 text-green-700 dark:bg-[rgba(16,185,129,0.12)] dark:text-emerald-400' :
                classification.complexity === 'complex' ? 'bg-orange-100 text-orange-700 dark:bg-[#2a1e12] dark:text-orange-400' :
                'bg-yellow-100 text-yellow-700 dark:bg-[#2a210f] dark:text-yellow-400'
              }`}>
                ⚡ {classification.complexity}
              </span>
            )}
            <span className={`px-3 py-1 text-sm rounded-lg font-medium ${
              solution.confidence >= 80 ? 'bg-green-100 text-green-700 dark:bg-[rgba(16,185,129,0.12)] dark:text-emerald-400' :
              solution.confidence >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-[#2a210f] dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-[#2a1212] dark:text-red-400'
            }`}>
              🎯 {solution.confidence}% confidence
            </span>
          </div>
        </div>

        {/* Risk Score Card */}
        <div className="card bg-gradient-to-br from-gray-50 to-white dark:from-[var(--card-bg)] dark:to-[var(--card-bg)] border-2 dark:border-[var(--border-primary)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold dark:text-gray-100">Risk Assessment</h3>
            <Shield className="text-gray-400" size={24} />
          </div>
          <div className="flex justify-center mb-4">
            <RiskIndicator 
              riskLevel={riskLevel} 
              riskScore={metadata.riskScore || validation.riskLevel === 'critical' ? 90 : validation.riskLevel === 'high' ? 70 : validation.riskLevel === 'medium' ? 40 : 20} 
              size="lg" 
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {riskLevel === 'low' && '✅ Changes look safe'}
            {riskLevel === 'medium' && '⚠️ Review carefully'}
            {riskLevel === 'high' && '🔶 High risk - test thoroughly'}
            {riskLevel === 'critical' && '🚨 CRITICAL - manual review required'}
          </p>
        </div>
      </div>

      {/* Change Statistics */}
      {validation.stats && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileCode size={24} />
            <span className="dark:text-gray-100">Change Statistics</span>
          </h3>
          <ChangeStats stats={validation.stats} />
        </div>
      )}

      {/* Warnings */}
      {validation.warnings && validation.warnings.length > 0 && (
        <div className="card bg-yellow-50 dark:bg-[#1f1a0a] border-2 border-yellow-200 dark:border-[var(--border-primary)]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-800 dark:text-gray-100">
            <AlertTriangle size={24} />
            Warnings ({validation.warnings.length})
          </h3>
          <ul className="space-y-2">
            {validation.warnings.map((warning: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-yellow-800 dark:text-gray-300">
                <span className="text-yellow-600 mt-1">⚠️</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {validation.suggestions && validation.suggestions.length > 0 && (
        <div className="card bg-blue-50 dark:bg-[#101520] border-2 border-blue-200 dark:border-[var(--border-primary)]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800 dark:text-gray-100">
            <Lightbulb size={24} />
            AI Suggestions
          </h3>
          <ul className="space-y-2">
            {validation.suggestions.map((suggestion: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-gray-300">
                <span className="text-blue-600 mt-1">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Suggestions */}
      {metadata.testSuggestions && metadata.testSuggestions.length > 0 && (
        <div className="card bg-green-50 dark:bg-[rgba(16,185,129,0.06)] border-2 border-green-200 dark:border-[var(--border-primary)]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800 dark:text-gray-100">
            <CheckSquare size={24} />
            Testing Checklist
          </h3>
          <ul className="space-y-2">
            {metadata.testSuggestions.map((test: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-gray-300">
                <input type="checkbox" className="mt-1" />
                <span>{test}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">AI Analysis</h3>
        <div className="bg-gray-50 dark:bg-[var(--card-bg)] border dark:border-[var(--border-primary)] p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{solution.analysis}</p>
        </div>
      </div>

      {/* Proposed Solution */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Proposed Solution</h3>
        <div className="bg-gray-50 dark:bg-[var(--card-bg)] border dark:border-[var(--border-primary)] p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{solution.proposedSolution}</p>
        </div>
      </div>

      {/* Files Changed - Side-by-Side Diff */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCode className="text-green-600" size={24} />
            <h3 className="text-xl font-bold">Files Changed</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Red = Removed | Green = Added</p>
        </div>
        <div className="space-y-4">
          {solution.filesChanged?.map((file: any, index: number) => (
            <div key={index}>
              <DiffViewer
                filename={file.filename}
                oldContent={file.originalContent || ''}
                newContent={file.content}
                action={file.action}
              />
              {editMode !== index && (
                <button
                  onClick={() => handleEdit(index, file.content)}
                  className="btn btn-secondary text-xs py-1 px-3 mt-2"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit This File
                </button>
              )}
              {editMode === index && (
                <div className="p-4 bg-gray-50 dark:bg-[var(--card-bg)] border dark:border-[var(--border-primary)] rounded-lg mt-2">
                  <label className="block text-sm font-medium mb-2">Edit File Content:</label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="input font-mono text-sm"
                    rows={15}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(file.filename, file.content)}
                      disabled={modifyMutation.isPending}
                      className="btn btn-primary text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="btn btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Form */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h3 className="text-xl font-bold mb-4">Validation Decision</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comments / Feedback</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="input"
            rows={4}
            placeholder="Add your comments about this solution..."
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => validateMutation.mutate('approved')}
            disabled={validateMutation.isPending}
            className="btn btn-primary flex items-center space-x-2"
          >
            <CheckCircle size={20} />
            <span>Approve & Create PR</span>
          </button>
          <button
            onClick={() => validateMutation.mutate('rejected')}
            disabled={validateMutation.isPending}
            className="btn btn-danger flex items-center space-x-2"
          >
            <XCircle size={20} />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  )
}

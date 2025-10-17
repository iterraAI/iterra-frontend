import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Sparkles, Code, FileCode, AlertCircle, Loader as LoaderIcon } from 'lucide-react'
import ProgressTracker, { AI_ANALYSIS_STEPS } from '../components/ProgressTracker'
import DiffViewer from '../components/DiffViewer'
import Loader from '../components/Loader'
import { authenticatedGet } from '../utils/api'

export default function IssueSolver() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile')
  const [solution, setSolution] = useState<any>(null)
  const [analysisStep, setAnalysisStep] = useState(0)

  // Fetch issue details
  const { data: issueData, isLoading: issueLoading } = useQuery({
    queryKey: ['issue', issueId],
    queryFn: async () => {
      const res = await authenticatedGet(`/api/issues/${issueId}`)
      return res.data.issue
    }
  })

  // Fetch available AI models
  const { data: modelsData } = useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/ai/models')
      return res.data
    }
  })

  // Generate solution mutation with progress simulation
  const generateMutation = useMutation({
    mutationFn: async () => {
      // Simulate progress through steps
      setAnalysisStep(0);
      setTimeout(() => setAnalysisStep(1), 1000);   // Classification
      setTimeout(() => setAnalysisStep(2), 3000);   // Context gathering
      setTimeout(() => setAnalysisStep(3), 6000);   // Solution generation
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await axios.post(
        `${apiUrl}/api/ai/generate-solution`,
        { issueId, modelId: selectedModel },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      
      setAnalysisStep(4); // Complete
      return res.data
    },
    onSuccess: (data) => {
      toast.success('Solution generated successfully!')
      setSolution(data.solution)
      // Don't auto-redirect - let user review first
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to generate solution')
      setAnalysisStep(0)
    }
  })

  if (issueLoading) {
    return <Loader variant="fullPage" text="Loading issue details..." />
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Solve Issue with AI</h1>
        <p className="text-white/80 mt-2">
          Use AI to analyze and generate a solution for this issue
        </p>
      </div>

      {/* Issue Details */}
      <div className="card">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold">{issueData?.title}</h2>
              <span className="text-gray-500">#{issueData?.issueNumber}</span>
            </div>
            <p className="text-gray-600 mb-4">{issueData?.repoFullName}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {issueData?.body || 'No description provided'}
              </p>
            </div>
            {issueData?.labels?.length > 0 && (
              <div className="flex items-center space-x-2 mt-4">
                {issueData.labels.map((label: string) => (
                  <span
                    key={label}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      {generateMutation.isPending && (
        <div className="card bg-gradient-to-br from-primary-50 to-white">
          <h3 className="text-xl font-bold mb-2 text-center">🤖 AI is Working...</h3>
          <ProgressTracker currentStep={analysisStep} steps={AI_ANALYSIS_STEPS} />
        </div>
      )}

      {/* AI Model Selection */}
      {!solution && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Select AI Model</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {modelsData?.models?.map((model: any) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedModel === model.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={selectedModel === model.id}
                    onChange={() => setSelectedModel(model.id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">{model.name}</p>
                    <p className="text-sm text-gray-600">{model.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="btn btn-primary mt-6 flex items-center space-x-2 mx-auto"
          >
            {generateMutation.isPending ? (
              <>
                <LoaderIcon className="animate-spin" size={20} />
                <span>Generating Solution...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Solution</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Solution Display */}
      {solution && (
        <div className="space-y-6">
          {/* Analysis */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="text-primary-600" size={24} />
              <h3 className="text-xl font-bold">AI Analysis</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{solution.analysis}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Confidence: {solution.confidence}%
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                {solution.aiModel}
              </span>
            </div>
          </div>

          {/* Proposed Solution */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Proposed Solution</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{solution.proposedSolution}</p>
            </div>
          </div>

          {/* Files Changed - Side-by-Side Diff */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileCode className="text-green-600" size={24} />
                <h3 className="text-xl font-bold">Files Changed</h3>
              </div>
              <p className="text-sm text-gray-500">Red = Removed | Green = Added</p>
            </div>
            <div className="space-y-4">
              {solution.filesChanged?.map((file: any, index: number) => (
                <DiffViewer
                  key={index}
                  filename={file.filename}
                  oldContent={file.originalContent || ''}
                  newContent={file.content}
                  action={file.action}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="card bg-primary-50 border-2 border-primary-200">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>
            <p className="text-gray-700 mb-4">
              Review the solution above. When ready, proceed to validation to approve or reject it.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/validations/${solution._id}`)}
                className="btn btn-primary text-lg px-8 py-3"
              >
                ✅ Review & Validate
              </button>
              <button
                onClick={() => {
                  setSolution(null)
                  generateMutation.reset()
                }}
                className="btn btn-secondary"
              >
                🔄 Generate New Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

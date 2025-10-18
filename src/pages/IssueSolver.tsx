import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Sparkles, Code, FileCode, AlertCircle, Loader as LoaderIcon, Crown } from 'lucide-react'
import ProgressTracker, { AI_ANALYSIS_STEPS } from '../components/ProgressTracker'
import DiffViewer from '../components/DiffViewer'
import Loader from '../components/Loader'
import UpgradePrompt from '../components/UpgradePrompt'
import { authenticatedGet } from '../utils/api'

export default function IssueSolver() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile')
  const [solution, setSolution] = useState<any>(null)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'model_access' | 'usage_limit' | 'premium_feature'>('premium_feature')

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

  // Fetch user subscription details
  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription-details'],
    queryFn: async () => {
      const res = await authenticatedGet('/api/payments/subscription')
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
      const errorData = error.response?.data
      
      // Handle subscription-related errors
      if (errorData?.error === 'Premium subscription required') {
        setUpgradeReason('model_access')
        setShowUpgradePrompt(true)
      } else if (errorData?.error === 'Usage limit exceeded') {
        setUpgradeReason('usage_limit')
        setShowUpgradePrompt(true)
      } else {
        toast.error(errorData?.error || 'Failed to generate solution')
      }
      
      setAnalysisStep(0)
    }
  })

  // Handle model selection with payment checks
  const handleModelSelect = (modelId: string) => {
    const model = modelsData?.allModels?.find((m: any) => m.id === modelId)
    const userPlan = subscriptionData?.subscription?.plan || 'FREE'
    
    // Check if user has access to this model
    if (model && model.provider !== 'groq' && userPlan === 'FREE') {
      setUpgradeReason('model_access')
      setShowUpgradePrompt(true)
      return
    }
    
    setSelectedModel(modelId)
  }

  if (issueLoading) {
    return <Loader variant="fullPage" text="Loading issue details..." />
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Solve Issue with AI</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Use AI to analyze and generate a solution for this issue
        </p>
      </div>

      {/* Issue Details */}
      <div className="card">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-100 dark:bg-[#2a1e12] rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold dark:text-gray-100">{issueData?.title}</h2>
              <span className="text-gray-500 dark:text-gray-400">#{issueData?.issueNumber}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{issueData?.repoFullName}</p>
            <div className="bg-gray-50 dark:bg-[var(--card-bg)] border dark:border-[var(--border-primary)] p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {issueData?.body || 'No description provided'}
              </p>
            </div>
            {issueData?.labels?.length > 0 && (
              <div className="flex items-center space-x-2 mt-4">
                {issueData.labels.map((label: string) => (
                  <span
                    key={label}
                    className="px-3 py-1 bg-blue-100 dark:bg-[#1e1f23] text-blue-700 dark:text-gray-300 text-sm rounded"
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
        <div className="card bg-gradient-to-br from-primary-50 to-white dark:from-[rgba(16,185,129,0.06)] dark:to-[var(--card-bg)]">
          <h3 className="text-xl font-bold mb-2 text-center dark:text-gray-100">🤖 AI is Working...</h3>
          <ProgressTracker currentStep={analysisStep} steps={AI_ANALYSIS_STEPS} />
        </div>
      )}

      {/* AI Model Selection */}
      {!solution && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Select AI Model</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {modelsData?.allModels?.map((model: any) => {
              const isAccessible = modelsData?.models?.some((m: any) => m.id === model.id)
              const userPlan = subscriptionData?.subscription?.plan || 'FREE'
              const requiresUpgrade = model.provider !== 'groq' && userPlan === 'FREE'
              
              return (
                <div
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                    selectedModel === model.id
                      ? 'border-green-600 bg-green-50 dark:bg-[rgba(16,185,129,0.08)]'
                      : isAccessible
                      ? 'border-gray-200 dark:border-[var(--border-primary)] hover:border-green-300'
                      : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                  }`}
                >
                  {requiresUpgrade && (
                    <div className="absolute top-2 right-2">
                      <Crown className="text-orange-500" size={16} />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={selectedModel === model.id}
                      onChange={() => handleModelSelect(model.id)}
                      className="w-4 h-4"
                      disabled={!isAccessible}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold dark:text-gray-100">{model.name}</p>
                        {requiresUpgrade && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                            Pro Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{model.description}</p>
                      {requiresUpgrade && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                          Upgrade to Pro to access this model
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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
              <Code className="text-green-600" size={24} />
              <h3 className="text-xl font-bold dark:text-gray-100">AI Analysis</h3>
            </div>
            <div className="bg-gray-50 dark:bg-[var(--card-bg)] border dark:border-[var(--border-primary)] p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{solution.analysis}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Confidence: {solution.confidence}%
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-[#1e1f23] text-blue-700 dark:text-gray-300 text-sm rounded">
                {solution.aiModel}
              </span>
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
                <h3 className="text-xl font-bold dark:text-gray-100">Files Changed</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Red = Removed | Green = Added</p>
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
          <div className="card bg-primary-50 dark:bg-[rgba(16,185,129,0.06)] border-2 border-primary-200 dark:border-[var(--border-primary)]">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Next Steps</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
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

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        reason={upgradeReason}
        currentPlan={subscriptionData?.subscription?.plan || 'FREE'}
      />
    </div>
  )
}

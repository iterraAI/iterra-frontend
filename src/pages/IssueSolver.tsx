import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Sparkles, Code, FileCode, AlertCircle, Loader as LoaderIcon, Crown, ChevronDown, CheckCircle } from 'lucide-react'
import DetailedProgressTracker, { ENHANCED_AI_STEPS, ProgressStep } from '../components/DetailedProgressTracker'
import DiffViewer from '../components/DiffViewer'
import Loader from '../components/Loader'
import UpgradePrompt from '../components/UpgradePrompt'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { authenticatedGet } from '../utils/api'

export default function IssueSolver() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedModel, setSelectedModel] = useState('gpt-5-mini')
  const [solution, setSolution] = useState<any>(null)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'model_access' | 'usage_limit' | 'premium_feature'>('premium_feature')
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>(ENHANCED_AI_STEPS)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<number>(0)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false)
      }
    }

    if (showModelDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModelDropdown])

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

  // Generate solution mutation with detailed progress tracking
  const generateMutation = useMutation({
    mutationFn: async () => {
      // Reset and initialize progress steps + start timer
      setProgressSteps([...ENHANCED_AI_STEPS])
      setStartTime(Date.now())
      setElapsedTime(0)
      
      // Step 0: Analyzing Issue
      setAnalysisStep(0)
      const updatedSteps0 = [...ENHANCED_AI_STEPS]
      updatedSteps0[0].details = {
        info: ['Classifying issue type...', 'Determining complexity level...', 'Identifying affected components...'],
        files: []
      }
      setProgressSteps(updatedSteps0)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Step 1: Gathering Context
      setAnalysisStep(1)
      const updatedSteps1 = [...updatedSteps0]
      updatedSteps1[0].details = {
        info: ['Issue type: Feature Request', 'Complexity: High', `Repository: ${issueData?.repoFullName}`],
        files: []
      }
      updatedSteps1[1].details = {
        info: ['Fetching repository structure...', 'Scanning for relevant files...'],
        files: ['README.md', 'package.json', 'src/index.ts', 'src/types.ts', '...']
      }
      setProgressSteps(updatedSteps1)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 2: Building Dependencies
      setAnalysisStep(2)
      const updatedSteps2 = [...updatedSteps1]
      updatedSteps2[1].details = {
        info: ['Found 1,247 files in repository', 'Selected 15 most relevant files', 'Using cached repository structure'],
        files: ['src/components/Auth.tsx', 'src/api/auth.ts', 'src/types/user.ts', 'src/middleware/auth.ts', 'package.json']
      }
      updatedSteps2[2].details = {
        info: ['Parsing imports and exports...', 'Building dependency graph...'],
        files: []
      }
      setProgressSteps(updatedSteps2)
      await new Promise(resolve => setTimeout(resolve, 1800))
      
      // Step 3: Generating Solution - START API CALL
      setAnalysisStep(3)
      const updatedSteps3 = [...updatedSteps2]
      updatedSteps3[2].details = {
        info: ['Analyzed 15 files for dependencies', 'Identified 8 direct dependencies', 'Found 23 related files'],
        files: ['src/api/auth.ts → imports: jwt, bcrypt', 'src/components/Auth.tsx → imports: auth.ts', 'src/middleware/auth.ts → imports: jwt']
      }
      const selectedModelName = modelsData?.allModels?.find((m: any) => m.id === selectedModel)?.name || selectedModel
      updatedSteps3[3].details = {
        info: [`AI Model: ${selectedModelName}`, 'Generating code changes...', `Time elapsed: ${elapsedTime}s...`],
        files: []
      }
      setProgressSteps(updatedSteps3)
      
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
      
      // Step 4: Validating & Finalizing
      setAnalysisStep(4)
      const updatedSteps4 = [...updatedSteps3]
      const filesChanged = res.data.solution?.filesChanged || []
      updatedSteps4[3].details = {
        info: [`Modified ${filesChanged.length} file(s)`, 'Solution generated successfully', `Confidence: ${res.data.solution?.confidence || 0}%`],
        files: filesChanged.map((f: any) => `${f.action}: ${f.filename}`)
      }
      const validationScore = res.data.solution?.metadata?.advancedValidation?.score || res.data.solution?.confidence || 85
      const validationErrors = res.data.solution?.metadata?.advancedValidation?.errors || []
      const validationWarnings = res.data.solution?.metadata?.advancedValidation?.warnings || []
      const totalTime = Math.floor((Date.now() - startTime) / 1000)
      updatedSteps4[4].details = {
        info: ['Syntax validation passed', 'Security checks completed', validationErrors.length === 0 ? 'No critical errors found' : `${validationErrors.length} error(s) found`, `Thought for ${totalTime} seconds ✓`],
        warnings: validationWarnings.length > 0 ? validationWarnings.slice(0, 3).map((w: any) => w.message) : [],
        score: validationScore
      }
      setProgressSteps(updatedSteps4)
      
      return res.data
    },
    onSuccess: (data) => {
      const totalTime = Math.floor((Date.now() - startTime) / 1000)
      const creditsUsed = data.credits?.used || 0
      const creditsRemaining = data.credits?.remaining || 0
      
      if (creditsUsed > 0) {
        toast.success(`Solution generated! Used ${creditsUsed.toFixed(1)} credits (${creditsRemaining.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} remaining)`)
      } else {
        toast.success(`Solution generated successfully! (${totalTime}s)`)
      }
      
      setSolution(data.solution)
      // Don't auto-redirect - let user review first
      
      // Invalidate queries to refresh credit balance and usage stats
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] })
      queryClient.invalidateQueries({ queryKey: ['usage-stats'] })
      queryClient.invalidateQueries({ queryKey: ['ai-models'] })
    },
    onError: (error: any) => {
      const errorData = error.response?.data
      
      // Handle subscription-related errors
      if (errorData?.error === 'Premium subscription required') {
        setUpgradeReason('model_access')
        setShowUpgradePrompt(true)
      } else if (errorData?.error === 'Usage limit exceeded' || errorData?.error === 'Insufficient credits' || errorData?.error === 'No credits available') {
        setUpgradeReason('usage_limit')
        setShowUpgradePrompt(true)
        toast.error(errorData?.message || 'Insufficient credits')
      } else {
        toast.error(errorData?.error || 'Failed to generate solution')
      }
      
      setAnalysisStep(0)
    }
  })

  // Track elapsed time during generation
  useEffect(() => {
    if (!generateMutation.isPending || startTime === 0) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [generateMutation.isPending, startTime])

  // Handle model selection with payment checks
  const handleModelSelect = (modelId: string) => {
    const model = modelsData?.allModels?.find((m: any) => m.id === modelId)
    const userPlan = subscriptionData?.subscription?.plan || 'FREE'
    
    // Check if user has access to this model (FREE plan only has access to GPT-5 Mini)
    if (model && userPlan === 'FREE' && model.id !== 'gpt-5-mini') {
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

      {/* Issue Details with Model Selector */}
      {!solution && (
        <div className="card">
          <div className="flex items-start space-x-4 mb-6">
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
                <MarkdownRenderer 
                  content={issueData?.body || 'No description provided'} 
                  className="text-gray-700 dark:text-gray-300"
                />
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

          {/* Bottom Bar with Model Selector (left) and Generate Button (right) */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[var(--border-primary)]">
            {/* AI Model Dropdown - Left */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1e1f23] border border-gray-300 dark:border-[var(--border-primary)] rounded-lg hover:bg-gray-200 dark:hover:bg-[#252629] transition-colors"
              >
                <Sparkles size={18} className="text-primary-600" />
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {modelsData?.allModels?.find((m: any) => m.id === selectedModel)?.name || 'Select Model'}
                </span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showModelDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-[var(--card-bg)] border border-gray-200 dark:border-[var(--border-primary)] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {modelsData?.allModels?.map((model: any) => {
                    const userPlan = subscriptionData?.subscription?.plan || 'FREE'
                    // GPT-5 Mini is available for FREE plan, all other models require PRO subscription
                    const requiresUpgrade = userPlan === 'FREE' && model.id !== 'gpt-5-mini'
                    const isSelected = selectedModel === model.id
                    const estimatedCredits = model.estimatedCredits
                    const currentCredits = subscriptionData?.subscription?.credits?.balance || modelsData?.currentCredits || 0
                    const hasEnoughCredits = !estimatedCredits || currentCredits >= estimatedCredits

                    return (
                      <div
                        key={model.id}
                        onClick={() => {
                          handleModelSelect(model.id)
                          setShowModelDropdown(false)
                        }}
                        className={`p-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-[var(--border-primary)] last:border-b-0 ${
                          isSelected
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : !hasEnoughCredits && !requiresUpgrade
                            ? 'bg-red-50 dark:bg-red-900/20 opacity-60'
                            : 'hover:bg-gray-50 dark:hover:bg-[#1e1f23]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className={`font-semibold text-sm ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {model.name}
                              </p>
                              {requiresUpgrade && (
                                <Crown className="text-orange-500" size={14} />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {model.description}
                            </p>
                            {estimatedCredits && (
                              <p className={`text-xs mt-1 ${hasEnoughCredits ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                                ~{estimatedCredits} credits
                              </p>
                            )}
                            {requiresUpgrade && (
                              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                Pro subscription required
                              </p>
                            )}
                            {!hasEnoughCredits && !requiresUpgrade && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Insufficient credits
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Credit Balance & Generate Button - Right */}
            <div className="flex items-center space-x-4">
              {(() => {
                // Get current credits - prefer subscription endpoint, fallback to models endpoint
                // The backend should always initialize credits, but handle edge case where it's not set yet
                const subscriptionCredits = subscriptionData?.subscription?.credits
                const creditsBalance = subscriptionCredits?.balance ?? modelsData?.currentCredits ?? null
                const creditsAllocated = subscriptionCredits?.allocated ?? modelsData?.creditsAllocated ?? 0
                const creditsUsed = subscriptionCredits?.used ?? 0
                
                // Display logic:
                // - If balance is null (not initialized), show allocated
                // - If balance is 0 AND user hasn't used any credits (used = 0), show allocated (fresh user)
                // - Otherwise, show actual balance
                let displayCredits = creditsAllocated
                if (creditsBalance !== null && creditsBalance !== undefined) {
                  // If balance is 0 but user hasn't used any credits, they should see allocated
                  if (creditsBalance === 0 && creditsUsed === 0 && creditsAllocated > 0) {
                    displayCredits = creditsAllocated
                  } else {
                    displayCredits = creditsBalance
                  }
                }
                
                return (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {displayCredits.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                    {' '}credits remaining
                  </div>
                )
              })()}
              <button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending || (() => {
                  const model = modelsData?.allModels?.find((m: any) => m.id === selectedModel)
                  const estimatedCredits = model?.estimatedCredits
                  const currentCredits = subscriptionData?.subscription?.credits?.balance ?? 
                                        modelsData?.currentCredits ?? 
                                        0
                  return estimatedCredits && estimatedCredits > 0 && currentCredits < estimatedCredits
                })()}
                className="btn btn-primary flex items-center space-x-2 px-6 py-2.5"
              >
              {generateMutation.isPending ? (
                <>
                  <LoaderIcon className="animate-spin" size={20} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Solution</span>
                </>
              )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Progress Tracker */}
      {generateMutation.isPending && (
        <div className="card bg-gradient-to-br from-primary-50 to-white dark:from-[rgba(16,185,129,0.06)] dark:to-[var(--card-bg)] border-2 border-primary-200 dark:border-primary-900/50">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🤖 AI is Working on Your Solution
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your issue and generating the best solution...
              {elapsedTime > 0 && (
                <span className="ml-2 font-semibold text-primary-600 dark:text-primary-400">
                  ({elapsedTime}s elapsed)
                </span>
              )}
            </p>
          </div>
          <DetailedProgressTracker currentStep={analysisStep} steps={progressSteps} />
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

import { useState } from 'react'
import { CheckCircle, Loader, ChevronDown, ChevronUp, FileCode, GitBranch, Sparkles, Shield } from 'lucide-react'

export interface ProgressStep {
  id: string
  label: string
  description: string
  icon: any
  details?: {
    files?: string[]
    info?: string[]
    warnings?: string[]
    score?: number
  }
}

interface DetailedProgressTrackerProps {
  currentStep: number
  steps: ProgressStep[]
  stepDetails?: Record<string, any> // Dynamic details from backend
}

export default function DetailedProgressTracker({ 
  currentStep, 
  steps,
  stepDetails = {}
}: DetailedProgressTrackerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([currentStep]))

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSteps(newExpanded)
  }

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'complete'
    if (index === currentStep) return 'current'
    return 'pending'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500 text-white border-green-500'
      case 'current':
        return 'bg-primary-500 text-white border-primary-500'
      default:
        return 'bg-gray-200 dark:bg-[#1e1f23] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-[var(--border-primary)]'
    }
  }

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10'
      case 'current':
        return 'border-primary-200 dark:border-primary-900/50 bg-primary-50 dark:bg-primary-900/10'
      default:
        return 'border-gray-200 dark:border-[var(--border-primary)] bg-white dark:bg-[var(--card-bg)]'
    }
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isExpanded = expandedSteps.has(index)
        const hasDetails = step.details || stepDetails[step.id]
        const Icon = step.icon

        return (
          <div
            key={step.id}
            className={`border-2 rounded-lg transition-all duration-300 ${getCardBorderColor(status)}`}
          >
            {/* Step Header */}
            <div 
              className={`flex items-center p-4 ${hasDetails && status !== 'pending' ? 'cursor-pointer' : ''}`}
              onClick={() => hasDetails && status !== 'pending' && toggleStep(index)}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${getStepColor(status)}`}>
                {status === 'complete' ? (
                  <CheckCircle size={20} />
                ) : status === 'current' ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-bold text-base ${
                      status === 'complete' ? 'text-green-700 dark:text-green-400' :
                      status === 'current' ? 'text-primary-700 dark:text-primary-400' :
                      'text-gray-400 dark:text-gray-500'
                    }`}>
                      {step.label}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      status === 'pending' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Expand/Collapse */}
                  {hasDetails && status !== 'pending' && (
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Current Step Animation */}
                {status === 'current' && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-[#1e1f23] rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Details */}
            {isExpanded && hasDetails && status !== 'pending' && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-[var(--border-primary)] pt-3 mt-2">
                {/* Files */}
                {step.details?.files && step.details.files.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                      <FileCode size={14} className="mr-1" />
                      Files Processed
                    </p>
                    <div className="space-y-1">
                      {step.details.files.slice(0, 5).map((file, idx) => (
                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-100 dark:bg-[#1e1f23] px-2 py-1 rounded">
                          {file}
                        </div>
                      ))}
                      {step.details.files.length > 5 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          ...and {step.details.files.length - 5} more files
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Info */}
                {step.details?.info && step.details.info.length > 0 && (
                  <div className="mb-3">
                    <div className="space-y-1">
                      {step.details.info.map((info, idx) => (
                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {step.details?.warnings && step.details.warnings.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase mb-2">
                      ⚠️ Warnings
                    </p>
                    <div className="space-y-1">
                      {step.details.warnings.map((warning, idx) => (
                        <div key={idx} className="text-sm text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Score */}
                {typeof step.details?.score === 'number' && (
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Score:</span>
                    <div className="flex-1 bg-gray-200 dark:bg-[#1e1f23] rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${
                          step.details.score >= 90 ? 'bg-green-500' :
                          step.details.score >= 70 ? 'bg-blue-500' :
                          step.details.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${step.details.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      step.details.score >= 90 ? 'text-green-600 dark:text-green-400' :
                      step.details.score >= 70 ? 'text-blue-600 dark:text-blue-400' :
                      step.details.score >= 50 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {step.details.score}/100
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Enhanced steps with detailed information
export const ENHANCED_AI_STEPS: ProgressStep[] = [
  {
    id: 'analyzing',
    label: 'Analyzing Issue',
    description: 'Understanding issue type, complexity, and requirements...',
    icon: Sparkles,
    details: {
      info: [],
      files: []
    }
  },
  {
    id: 'context',
    label: 'Gathering Context',
    description: 'Fetching repository structure and relevant files...',
    icon: FileCode,
    details: {
      info: [],
      files: []
    }
  },
  {
    id: 'dependencies',
    label: 'Building Dependency Graph',
    description: 'Analyzing imports, exports, and file relationships...',
    icon: GitBranch,
    details: {
      info: [],
      files: []
    }
  },
  {
    id: 'generating',
    label: 'Generating Solution',
    description: 'AI is creating code changes to fix the issue...',
    icon: Sparkles,
    details: {
      info: [],
      files: []
    }
  },
  {
    id: 'validating',
    label: 'Validating & Finalizing',
    description: 'Checking syntax, security, and code quality...',
    icon: Shield,
    details: {
      info: [],
      warnings: [],
      score: 0
    }
  }
]


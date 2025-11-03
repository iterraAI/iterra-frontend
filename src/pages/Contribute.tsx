import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
// import axios from 'axios'
import { authenticatedPost } from '../utils/api'
import toast from 'react-hot-toast'
import { ExternalLink, GitFork, AlertCircle, CheckCircle2, Loader as LoaderIcon, Sparkles } from 'lucide-react'
import Loader from '../components/Loader'
import MarkdownRenderer from '../components/MarkdownRenderer'

interface ParsedUrl {
  owner: string
  repo: string
  issueNumber?: number
  type: 'issue' | 'repo'
}

// interface IssuePreview {
//   id: number
//   number: number
//   title: string
//   body: string
//   state: string
//   htmlUrl: string
//   labels: string[]
//   language?: string
//   repoFullName: string
// }

export default function Contribute() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [parsed, setParsed] = useState<ParsedUrl | null>(null)
  const [issuePreview, setIssuePreview] = useState<any | null>(null)
  const [step, setStep] = useState<'input' | 'preview' | 'importing'>('input')

  // Parse URL mutation
  const parseMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await authenticatedPost('/api/contributions/parse-url', { url })
      return res.data
    },
    onSuccess: async (data) => {
      if (data.parsed.type === 'issue') {
        setParsed(data.parsed)
        // Automatically fetch issue details
        fetchIssueMutation.mutate(data.parsed)
      } else {
        toast.error('Please provide a GitHub issue URL, not just a repository URL')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Invalid URL')
    }
  })

  // Fetch issue details mutation
  const fetchIssueMutation = useMutation({
    mutationFn: async (parsed: ParsedUrl) => {
      const res = await authenticatedPost('/api/contributions/fetch-issue', {
        owner: parsed.owner,
        repo: parsed.repo,
        issueNumber: parsed.issueNumber
      })
      return res.data
    },
    onSuccess: (data) => {
      setIssuePreview(data)
      setStep('preview')
      
      if (data.alreadyImported) {
        toast.success('This issue is already in your dashboard!')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to fetch issue details')
    }
  })

  // Import issue mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      if (!parsed) throw new Error('No issue parsed')
      
      setStep('importing')
      
      const res = await authenticatedPost('/api/contributions/import-issue', {
        owner: parsed.owner,
        repo: parsed.repo,
        issueNumber: parsed.issueNumber
      })
      return res.data
    },
    onSuccess: (data) => {
      toast.success('Issue imported successfully!')
      
      if (data.fork.isNew) {
        toast.success(`Fork created: ${data.fork.fullName}`, { duration: 5000 })
      }
      
      // Navigate to solve page
      navigate(`/issues/${data.issue._id}/solve`)
    },
    onError: (error: any) => {
      setStep('preview')
      const errorData = error.response?.data
      
      // Handle repository authorization required
      if (errorData?.requiresAuthorization) {
        toast.error(errorData.message || 'Repository access required', { duration: 5000 })
        
        // Redirect to authorization if URL is provided
        if (errorData.authorizationUrl) {
          setTimeout(() => {
            window.location.href = errorData.authorizationUrl
          }, 2000)
        } else {
          // Fallback: redirect to repositories page
          setTimeout(() => {
            const token = localStorage.getItem('auth_token')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            if (token) {
              window.location.href = `${apiUrl}/api/auth/github/repos?token=${token}`
            } else {
              navigate('/repositories')
            }
          }, 2000)
        }
        return
      }
      
      toast.error(errorData?.error || errorData?.message || 'Failed to import issue')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      toast.error('Please enter a GitHub issue URL')
      return
    }
    parseMutation.mutate(url)
  }

  const handleImport = () => {
    if (issuePreview?.alreadyImported) {
      navigate(`/issues/${issuePreview.existingIssueId}/solve`)
    } else {
      importMutation.mutate()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <GitFork className="text-green-600" />
          <span>Contribute to Open Source</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Solve issues from any public GitHub repository with AI assistance
        </p>
      </div>

      {/* Input Card */}
      {step === 'input' && (
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Import a GitHub Issue</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste GitHub Issue URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/facebook/react/issues/12345"
                className="w-full px-4 py-3 border border-gray-300 dark:border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent  text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                // className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={parseMutation.isPending}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Example: https://github.com/facebook/react/issues/12345
              </p>
            </div>

            <button
              type="submit"
              disabled={parseMutation.isPending || fetchIssueMutation.isPending}
              className="btn btn-primary w-full flex items-center justify-center space-x-2"
            >
              {(parseMutation.isPending || fetchIssueMutation.isPending) ? (
                <>
                  <LoaderIcon className="animate-spin" size={20} />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Fetch Issue</span>
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 p-4">
            <h3 className="font-semibold text-blue-900 dark:text-gray-100 mb-2 flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>How it works</span>
            </h3>
            <ol className="text-sm text-blue-800 dark:text-gray-300 space-y-1 ml-6 list-decimal">
              <li>Paste a GitHub issue URL</li>
              <li>We'll fetch the issue details and create a fork if needed</li>
              <li>Our AI will analyze and solve the issue</li>
              <li>Review and validate the solution</li>
              <li>Create a PR from your fork to the original repository</li>
            </ol>
          </div>
        </div>
      )}

      {/* Preview Card */}
      {step === 'preview' && issuePreview && (
        <div className="card max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Issue Preview</h2>
            </div>
            <button
              onClick={() => {
                setStep('input')
                setParsed(null)
                setIssuePreview(null)
              }}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              ← Back
            </button>
          </div>

          {/* Repository Info */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-[var(--card-bg)] rounded-lg border dark:border-[var(--border-primary)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Repository</p>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{issuePreview.repository.fullName}</p>
                {issuePreview.repository.language && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-[rgba(16,185,129,0.12)] text-blue-700 dark:text-emerald-400 text-xs rounded">
                    {issuePreview.repository.language}
                  </span>
                )}
              </div>
              <a
                href={issuePreview.repository.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>View on GitHub</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Issue Details */}
          <div className="border border-gray-200 dark:border-[var(--border-primary)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{issuePreview.issue.title}</h3>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">#{issuePreview.issue.number}</span>
                </div>
                
                {issuePreview.issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {issuePreview.issue.labels.map((label: string) => (
                      <span
                        key={label}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-[#1e1f23] text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <MarkdownRenderer 
                content={issuePreview.issue.body || 'No description provided'} 
                className="text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Fork Notice */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-[#1f1a0a] border border-yellow-200 dark:border-[var(--border-primary)] rounded-lg">
            <div className="flex items-start space-x-3">
              <GitFork className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-gray-100 mb-1">Fork Required</h4>
                <p className="text-sm text-yellow-800 dark:text-gray-300">
                  {issuePreview.alreadyImported
                    ? 'This issue is already imported. You can continue solving it.'
                    : 'This repository will be forked to your GitHub account. You\'ll create a PR from your fork to the original repository.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => window.open(issuePreview.issue.htmlUrl, '_blank')}
              className="btn btn-secondary"
            >
              View on GitHub
            </button>
            <button
              onClick={handleImport}
              disabled={importMutation.isPending}
              className="btn btn-primary flex items-center space-x-2"
            >
              {importMutation.isPending ? (
                <>
                  <LoaderIcon className="animate-spin" size={20} />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>{issuePreview.alreadyImported ? 'Continue Solving' : 'Import & Solve with AI'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Importing State */}
      {step === 'importing' && (
        <div className="max-w-3xl mx-auto">
          <Loader variant="fullPage" text="Importing issue and creating fork..." />
        </div>
      )}
    </div>
  )
}


import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Github, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import Loader from '../components/Loader'

export default function Auth() {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  const handleGitHubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/github`
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Authenticating..." />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container-custom py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold gradient-text-primary">Kodin</span>
          </a>
          
          <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="card text-center space-y-8 animate-slide-up">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Github className="text-white" size={40} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome to Kodin
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Sign in to start solving issues with AI
              </p>
            </div>

            {/* GitHub Sign In Button */}
            <button
              onClick={handleGitHubLogin}
              className="btn btn-primary w-full text-lg py-4 group"
            >
              <Github size={24} />
              <span>Continue with GitHub</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[var(--card-bg)] text-gray-500 dark:text-gray-400">Why GitHub?</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-green-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Instant Access</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Connect your repos and start solving</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Secure & Private</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">We never store your code</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-purple-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">AI-Powered</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Smart solutions in seconds</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to Kodin's{' '}
              <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              New to Kodin?{' '}
              <a href="/#features" className="text-green-600 hover:underline font-medium">
                Learn how it works
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container-custom py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2025 Kodin
        </div>
      </footer>
    </div>
  )
}


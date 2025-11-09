import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Github, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'
import Loader from '../components/Loader'
import axios from 'axios'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'

export default function Auth() {
  const { user, isLoading, setToken, checkAuth } = useAuthStore()
  const navigate = useNavigate()
  const [demoUsername, setDemoUsername] = useState('')
  const [demoPassword, setDemoPassword] = useState('')
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)

  const demoLoginEnabled = import.meta.env.VITE_DEMO_LOGIN_ENABLED === 'true'

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  const handleGitHubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/github`
  }

  const handleDemoLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!demoLoginEnabled) return

    setDemoError(null)
    setDemoLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

      const response = await axios.post(
        `${apiUrl}/api/auth/demo/login`,
        { username: demoUsername, password: demoPassword },
        { withCredentials: true }
      )

      const token = response.data?.token as string | undefined

      if (!token) {
        throw new Error('Missing auth token')
      }

      setToken(token)
      await checkAuth()
      navigate('/dashboard')
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setDemoError(error.response.data.message)
      } else if (error?.response?.data?.error) {
        setDemoError(error.response.data.error)
      } else {
        setDemoError('Unable to complete demo login')
      }
    } finally {
      setDemoLoading(false)
    }
  }

  if (isLoading) {
    return <Loader variant="fullPage" text="Authenticating..." />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pl-0 pr-4 py-2">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 group">
            <img src={lightLogo} alt="Kodin" className="h-10 dark:hidden" />
            <img src={darkLogo} alt="Kodin" className="h-10 hidden dark:block" />
          </a>
          <a
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Back to Home →
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="grid gap-6 lg:gap-10 lg:grid-cols-2">
            <div className="card h-full p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl uppercase tracking-wide text-[#F26522] font-bold">
                    YC Demo Access
                  </h2>
                  {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    YC Demo Access
                  </h2> */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                    Use the shared demo credentials to jump straight into the product.
                  </p>
                </div>

                {demoLoginEnabled ? (
                  <form className="space-y-4" onSubmit={handleDemoLogin}>
                    <div className="space-y-1.5 pt-16">
                      <label
                        htmlFor="demo-username"
                        className="text-sm font-medium text-[#F26522]"
                      >
                        Username
                      </label>
                      <input
                        id="demo-username"
                        type="text"
                        value={demoUsername}
                        onChange={(event) => setDemoUsername(event.target.value)}
                        className="input w-full"
                        placeholder="username"
                        autoComplete="username"
                        disabled={demoLoading}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="demo-password"
                        className="text-sm font-medium text-[#F26522]"
                      >
                        Password
                      </label>
                      <input
                        id="demo-password"
                        type="password"
                        value={demoPassword}
                        onChange={(event) => setDemoPassword(event.target.value)}
                        className="input w-full"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={demoLoading}
                        required
                      />
                    </div>

                    {demoError && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {demoError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-secondary w-full py-3"
                      disabled={demoLoading}
                    >
                      {demoLoading ? 'Signing in…' : 'Continue with Demo Credentials'}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-white/5 p-6 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      Demo access isn’t active.
                    </p>
                    <p>
                      Set{' '}
                      <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">
                        VITE_DEMO_LOGIN_ENABLED=true
                      </code>{' '}
                      and the backend demo env vars to enable this experience.
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 pt-6">
                Need the credentials? Contact the Kodin team—we rotate them regularly to keep the sandbox clean.
              </p>
            </div>

            <div className="card h-full p-8 flex flex-col space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Github className="text-white" size={40} />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Continue with GitHub
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Secure OAuth verification for teams that prefer to authorize their own repositories.
                </p>
              </div>

              <button
                onClick={handleGitHubLogin}
                className="btn btn-primary w-full text-lg py-4 group"
              >
                <Github size={24} />
                <span>Sign in with GitHub</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-[var(--card-bg)] text-sm text-gray-500 dark:text-gray-400">
                    Why GitHub?
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                    <Zap className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Instant Access</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Connect your repos and start solving.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <Shield className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Secure & Private</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">We never store your code.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">AI-Powered</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Smart solutions and validated PRs in minutes.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
                By continuing, you agree to Kodin's{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

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

      <footer className="container-custom py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2025 Kodin
        </div>
      </footer>
    </div>
  )
}


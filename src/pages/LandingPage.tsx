import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { 
  Sparkles, 
  Zap, 
  Shield, 
  GitBranch, 
  Bot,
  CheckCircle2,
  ArrowRight,
  Github,
  Code,
  Rocket
} from 'lucide-react'
// import logo from '../assets/logo_new.png'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function LandingPage() {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    // Store URL in localStorage before redirect
    localStorage.setItem('pendingIssueUrl', url.trim())
    navigate('/auth')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="pr-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              {/* Show dark logo in light mode, light logo in dark mode */}
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                How It Works
              </a>
              <a href="#benefits" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Benefits
              </a>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Pricing
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link to="/auth" className="btn btn-primary">
                Get Started
                <ArrowRight size={18} />
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div> */}

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <div className="hidden dark:block absolute inset-0" style={{
              background: 'radial-gradient(800px circle at 50% 40%, rgba(16,185,129,0.15), transparent 40%)'
            }} />
            <div className="dark:hidden absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.25) 0%, #ffffff 70%)'
            }} />
          </div>

          {/* bottom glowing arc (emerald theme) */}
          <div className="pointer-events-none absolute inset-x-[-5%] bottom-0 h-28">
            {/* Dark mode arc */}
            <div
              className="hidden dark:block absolute inset-x-0 bottom-0 h-full"
              style={{
                background:
                  'radial-gradient(1200px 140px at 50% 100%, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.18) 35%, rgba(16,185,129,0.06) 60%, transparent 70%)',
                filter: 'blur(6px)'
              }}
            />
            <div className="hidden dark:block absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-80" />

            {/* Light mode arc */}
            <div
              className="dark:hidden absolute inset-x-0 bottom-0 h-full"
              style={{
                background:
                  'radial-gradient(1200px 140px at 50% 100%, rgba(34,197,94,0.28) 0%, rgba(34,197,94,0.14) 35%, rgba(34,197,94,0.05) 60%, transparent 70%)',
                filter: 'blur(6px)'
              }}
            />
            <div className="dark:hidden absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-70" />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header Content */}
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 rounded-full px-4 py-1">
                <Sparkles className="text-green-600 dark:text-emerald-400" size={16} />
                <span className="text-green-700 dark:text-emerald-300 text-sm font-semibold">AI-Powered GitHub Issue Resolution</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                Solve bugs With
                <span className="gradient-text"> Kodin</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Solve any GitHub issue by importing the issue URL.
              </p>
            </div>

            {/* Import Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-[var(--card-bg)] rounded-2xl shadow-xl border border-gray-100 dark:border-[var(--border-primary)] p-8">
                <form onSubmit={handleImport} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Paste GitHub Issue URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/facebook/react/issues/12345"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary px-6 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Sparkles size={20} />
                        Import Issue
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Example: https://github.com/facebook/react/issues/12345
                    </p>
                  </div>
                </form>

                {/* Features List */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {[
                    'Auto PR Creation',
                    'AI Code Analysis',
                    'Instant Solutions',
                  ].map(label => (
                    <div key={label} className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={16} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center justify-center gap-8 text-gray-600 dark:text-gray-300 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-green-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github size={20} className="text-green-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium">GitHub Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-green-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium">Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-alt">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Everything You Need to Solve Issues
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make bug resolution effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Bot className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Semantic AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced semantic file matching with 100% accuracy, intent detection, and intelligent codebase understanding for precise solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <GitBranch className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Smart File Detection</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                File existence verification prevents duplicates, targets existing files for modification, and creates PRs with 98/100 quality score.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Code className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Production-Grade Validation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced validation with syntax checking, security scans, and best practices enforcement. Achieves 98/100 quality score with automatic error recovery.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Production-grade security with comprehensive error handling, input sanitization, and secure GitHub OAuth integration with monitoring.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Lightning Performance</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                2-3x faster processing with intelligent caching, Redis optimization, and 90%+ automatic error recovery for maximum efficiency.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-feature group bg-[var(--card-bg)] border border-[var(--border-primary)]">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Universal Compatibility</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Works with React, Vue, Angular, Django, Flask, Go, Rust, Java, Python - any language or framework. True universal compatibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From issue to PR in 4 simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Connect GitHub</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Authenticate with GitHub OAuth. Choose which repositories to grant access to for seamless integration.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select an Issue</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Choose any issue from your repos or import external issues from open-source projects.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Enhanced AI Processing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Semantic file matching, intent detection, and file existence verification ensure 100% accuracy with 98/100 quality score.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review & Create PR</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Review the solution, make adjustments if needed, and create a pull request with one click.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link to="/auth" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
              Get Started Free
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section section-alt">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  Why Developers Love Kodin
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Streamline your development workflow with AI-powered issue resolution.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">100% File Discovery Accuracy</h3>
                      <p className="text-gray-600 dark:text-gray-300">Semantic matching and intent detection find the right files every time</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">2-3x Faster Processing</h3>
                      <p className="text-gray-600 dark:text-gray-300">Intelligent caching and Redis optimization for lightning-fast results</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">98/100 Quality Score</h3>
                      <p className="text-gray-600 dark:text-gray-300">Production-grade validation with automatic error recovery</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Universal Compatibility</h3>
                      <p className="text-gray-600 dark:text-gray-300">Works with any language, framework, or project structure</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Key Benefits */}
              <div className="grid grid-cols-2 gap-6">
                <div className="card text-center">
                  <Bot className="mx-auto text-green-600 dark:text-emerald-400 mb-3" size={40} />
                  <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">Semantic AI</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">100% file discovery</div>
                </div>
                <div className="card text-center">
                  <GitBranch className="mx-auto text-blue-600 dark:text-blue-400 mb-3" size={40} />
                  <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">Smart Detection</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">File existence verification</div>
                </div>
                <div className="card text-center">
                  <Shield className="mx-auto text-purple-600 dark:text-purple-400 mb-3" size={40} />
                  <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">Enterprise</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">Production monitoring</div>
                </div>
                <div className="card text-center">
                  <Code className="mx-auto text-orange-600 dark:text-orange-400 mb-3" size={40} />
                  <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">98/100 Quality</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">Advanced validation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Accelerate Your Development?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Start using Kodin today. Let AI assist with debugging while you focus on building great products.
          </p>
          <Link to="/auth" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-2xl inline-flex items-center gap-2">
            <Github size={24} />
            <span>Get Started Free</span>
            <ArrowRight size={20} />
          </Link>
          <p className="text-sm opacity-75">Free to start • Requires GitHub account</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">Kodin</span> */}
                <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
                <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
              </div>
              <p className="text-gray-600 text-sm">
                Your AI pair programmer for debugging issues.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><a href="#features" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Benefits</a></li>
                <li><Link to="/pricing" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><Link to="/dashboard" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">GitHub</a></li>
                <li><Link to="/auth" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><a href="#" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-600 dark:hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className=" mt-12 pt-8 text-center text-gray-800 text-sm">
            © 2025 Kodin
          </div>
        </div>
      </footer>
    </div>
  )
}

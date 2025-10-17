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
  Rocket,
  Users,
  // TrendingUp
} from 'lucide-react'
import logo from '../assets/logo_new.png'

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
        <div className="pl-4 pr-4">
          <div className="flex items-center justify-between h-16">
            {/* <div className="flex items-center space-x-8"> */}
              <div className="flex items-center space-x-2">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold gradient-text-primary">Bug Resolve</span> */}
                <img src={logo} alt="Iterra AI" className='h-12 w-42' />
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  How It Works
                </a>
                <a href="#benefits" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Benefits
                </a>
              </div>
            {/* </div> */}
            {/* Logo */}

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {/* <Link to="/auth" className="btn btn-outline">
                Sign In
              </Link> */}
              <Link to="/auth" className="btn btn-primary">
                Get Started
                <ArrowRight size={18} />
              </Link>
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
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at 50% 40%,
                  rgba(34, 197, 94, 0.25) 0%,
                  rgba(255, 255, 255, 1) 70%
                )
              `
            }}
          ></div>

          {/* bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header Content */}
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-1">
                <Sparkles className="text-green-600" size={16} />
                <span className="text-green-700 text-sm font-semibold">AI-Powered GitHub Issue Resolution</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                Solve bugs With
                <span className="gradient-text"> Iterra AI</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Solve any GitHub issue by importing the issue URL.
              </p>
            </div>

            {/* Import Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <form onSubmit={handleImport} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Paste GitHub Issue URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/facebook/react/issues/12345"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary px-6 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Sparkles size={20} />
                        Import Issue
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Example: https://github.com/facebook/react/issues/12345
                    </p>
                  </div>
                </form>

                {/* Features List */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={16} />
                    <span className="text-sm text-gray-600">Auto PR Creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={16} />
                    <span className="text-sm text-gray-600">AI Code Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={16} />
                    <span className="text-sm text-gray-600">Instant Solutions</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-green-600" />
                  <span className="text-sm font-medium">500+ Developers</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch size={20} className="text-green-600" />
                  <span className="text-sm font-medium">10K+ Issues Solved</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-green-600" />
                  <span className="text-sm font-medium">30s Average Response</span>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Everything You Need to Solve Issues
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make bug resolution effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Bot className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI models analyze your issues, understand context, and generate accurate solutions in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <GitBranch className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Auto PR Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically creates pull requests with solutions. Review, approve, and merge with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Code className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Code Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Generates production-ready code fixes with proper syntax, best practices, and comprehensive testing.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your code never leaves your repository. We only read what's necessary and never store sensitive data.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Get solutions in under 30 seconds. Save hours of debugging time and ship faster.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-feature group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Open Source Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Contribute to any public repository. Fork, solve, and create PRs automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect GitHub</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Sign in with GitHub and connect your repositories. We'll automatically sync your open issues.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select an Issue</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Generates Solution</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our AI analyzes the issue, understands your codebase, and generates a comprehensive solution.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Create PR</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Review the solution, make adjustments if needed, and create a pull request with one click.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link to="/auth" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
              Try It Now - It's Free
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
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Why Developers Love Iterra AI
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join hundreds of developers who are shipping faster and building better software.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Save 10+ Hours Weekly</h3>
                      <p className="text-gray-600">Automate repetitive debugging and focus on features</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Ship Faster</h3>
                      <p className="text-gray-600">Resolve issues in minutes, not hours or days</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Better Code Quality</h3>
                      <p className="text-gray-600">AI follows best practices and coding standards</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Contribute to Open Source</h3>
                      <p className="text-gray-600">Help popular projects with AI-powered solutions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="card text-center">
                  <div className="text-5xl font-black gradient-text-primary mb-2">10x</div>
                  <div className="text-gray-600 font-medium">Faster Resolution</div>
                </div>
                <div className="card text-center">
                  <div className="text-5xl font-black gradient-text-primary mb-2">95%</div>
                  <div className="text-gray-600 font-medium">Accuracy Rate</div>
                </div>
                <div className="card text-center">
                  <div className="text-5xl font-black gradient-text-primary mb-2">30s</div>
                  <div className="text-gray-600 font-medium">Avg Response Time</div>
                </div>
                <div className="card text-center">
                  <div className="text-5xl font-black gradient-text-primary mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Happy Developers</div>
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
            Ready to Solve Issues 10x Faster?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Join Iterra AI today and let AI handle the debugging while you focus on building amazing products.
          </p>
          <Link to="/auth" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-2xl inline-flex items-center gap-2">
            <Github size={24} />
            <span>Get Started Free</span>
            <ArrowRight size={20} />
          </Link>
          <p className="text-sm opacity-75">No credit card required • GitHub account needed</p>
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
                <span className="text-xl font-bold">Bug Resolve</span> */}
                <img src={logo} alt="Iterra AI" className='h-12 w-42' />
              </div>
              <p className="text-gray-800 text-sm">
                Your AI pair programmer for debugging issues.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className=" mt-12 pt-8 text-center text-gray-800 text-sm">
            © 2025 Iterra AI
          </div>
        </div>
      </footer>
    </div>
  )
}

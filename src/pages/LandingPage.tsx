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
  AlertCircle,
  // X,
  Twitter,
} from 'lucide-react'
// import logo from '../assets/logo_new.png'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import { Spotlight } from '../components/ui/Spotlight'
import { TextGenerateEffect } from '../components/ui/TextGenerateEffect'
import { Timeline } from '../components/ui/Timeline'
import { AnimatedPlaceholder } from '../components/ui/AnimatedPlaceholder'
import { motion } from 'framer-motion'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function LandingPage() {
  const { user, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [statusBanner, setStatusBanner] = useState<{
    show: boolean
    status: string
    message: string
  } | null>(null)

  // Check waitlist status if user is logged in (but don't redirect)
  useEffect(() => {
    const checkStatus = async () => {
      if (!user || isLoading) {
        setStatusBanner(null)
        return
      }

      try {
        const { waitlistAPI } = await import('../utils/api')
        const response = await waitlistAPI.checkStatus()
        const data = response.data

        // Only show banner if user doesn't have access
        if (!data.hasAccess) {
          const status = data.waitlistStatus || 'not_submitted'
          const hasEntry = data.hasWaitlistEntry || false

          if (hasEntry) {
            // User has submitted waitlist - show status
            const statusMessages: Record<string, { message: string; color: string }> = {
              'pending_review': { message: 'Your application is under review', color: 'yellow' },
              'pending_sharing': { message: 'Your application is pending', color: 'blue' },
              'approved': { message: 'Your application has been approved! Check your email for access code.', color: 'green' },
              'rejected': { message: 'Your application was not approved', color: 'red' },
              'expired': { message: 'Your access code has expired', color: 'orange' }
            }

            const statusInfo = statusMessages[status] || { message: 'Your application status is being checked', color: 'gray' }
            setStatusBanner({
              show: true,
              status,
              message: statusInfo.message
            })
          } else {
            // User hasn't submitted waitlist
            setStatusBanner({
              show: true,
              status: 'not_submitted',
              message: 'Join the waitlist to get early access'
            })
          }
        } else {
          // User has access - no banner needed
          setStatusBanner(null)
        }
      } catch (error) {
        console.error('Error checking status for banner:', error)
        // Don't show banner on error
        setStatusBanner(null)
      }
    }

    checkStatus()
  }, [user, isLoading])

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

  const features = [
    {
      title: "Semantic AI Analysis",
      description: "Advanced semantic file matching with 100% accuracy, intent detection, and intelligent codebase understanding.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20" />,
      icon: <Bot className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Smart File Detection",
      description: "File existence verification prevents duplicates and targets existing files for modification.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20" />,
      icon: <GitBranch className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Production-Grade Validation",
      description: "Advanced validation with syntax checking, security scans, and best practices enforcement.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20" />,
      icon: <Code className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Enterprise Security",
      description: "Production-grade security with comprehensive error handling and input sanitization.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20" />,
      icon: <Shield className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "Lightning Performance",
      description: "2-3x faster processing with intelligent caching and Redis optimization.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20" />,
      icon: <Zap className="h-4 w-4 text-pink-500" />,
    },
    {
      title: "Universal Compatibility",
      description: "Works with React, Vue, Angular, Django, Flask, Go, Rust, Java, Python.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20" />,
      icon: <Rocket className="h-4 w-4 text-indigo-500" />,
    },
  ];

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
              {user && !isLoading && (
                <Link to="/application-status" className="btn btn-secondary text-sm">
                  Check Status
                </Link>
              )}
              <Link to="/auth" className="btn btn-primary">
                {user ? 'Dashboard' : 'Get Started'}
                <ArrowRight size={18} />
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Status Banner (for logged-in users without access) */}
      {statusBanner && statusBanner.show && (
        <div className={(() => {
          const status = statusBanner.status
          if (status === 'approved') return 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800'
          if (status === 'pending_review') return 'bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800'
          if (status === 'not_submitted') return 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800'
          return 'bg-gray-50 dark:bg-gray-900/20 border-b border-gray-200 dark:border-gray-800'
        })()}>
          <div className="container-custom py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className={(() => {
                  const status = statusBanner.status
                  if (status === 'approved') return 'text-green-600 dark:text-green-400'
                  if (status === 'pending_review') return 'text-yellow-600 dark:text-yellow-400'
                  if (status === 'not_submitted') return 'text-blue-600 dark:text-blue-400'
                  return 'text-gray-600 dark:text-gray-400'
                })()} size={20} />
                <p className={(() => {
                  const status = statusBanner.status
                  if (status === 'approved') return 'text-sm font-medium text-green-800 dark:text-green-200'
                  if (status === 'pending_review') return 'text-sm font-medium text-yellow-800 dark:text-yellow-200'
                  if (status === 'not_submitted') return 'text-sm font-medium text-blue-800 dark:text-blue-200'
                  return 'text-sm font-medium text-gray-800 dark:text-gray-200'
                })()}>
                  {statusBanner.message}
                </p>
              </div>
              <Link
                to="/application-status"
                className={(() => {
                  const status = statusBanner.status
                  if (status === 'approved') return 'text-sm font-semibold text-green-700 dark:text-green-300 hover:underline'
                  if (status === 'pending_review') return 'text-sm font-semibold text-yellow-700 dark:text-yellow-300 hover:underline'
                  if (status === 'not_submitted') return 'text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline'
                  return 'text-sm font-semibold text-gray-700 dark:text-gray-300 hover:underline'
                })()}
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-10 pb-32 overflow-hidden">
        {/* Animated Background - Inspired by IgnytLabs */}
        <div className="absolute inset-0 z-0">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="hidden dark:block absolute inset-0" style={{
              background: 'radial-gradient(800px circle at 50% 40%, rgba(16,185,129,0.15), transparent 40%)'
            }} />
            <div className="dark:hidden absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.25) 0%, #ffffff 70%)'
            }} />
          </div>

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-20 dark:opacity-10"
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 600,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                y: [null, Math.random() * 600 - 300],
                x: [null, Math.random() * 200 - 100],
                opacity: [null, Math.random() * 0.5 + 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Floating Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Animated Lines */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
              style={{
                top: `${20 + i * 30}%`,
                left: 0,
                right: 0,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scaleX: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
            />
          ))}

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
            <div className="text-center space-y-6 py-12 relative z-10">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 rounded-full px-4 py-1"
              >
                <Sparkles className="text-green-600 dark:text-emerald-400" size={16} />
                <span className="text-green-700 dark:text-emerald-300 text-sm font-semibold">AI-Powered GitHub Issue Resolution</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                Solve bugs With
                <span className="gradient-text"> Kodin</span>
              </h1>

              <div className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                <TextGenerateEffect words="Solve any GitHub issue by importing the issue URL." />
              </div>
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
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder=""
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100"
                        />
                        {!url && (
                          <div className="absolute inset-y-0 left-4 right-4 flex items-center pointer-events-none">
                            <AnimatedPlaceholder
                              placeholders={[
                                'https://github.com/facebook/react/issues/12345',
                                'https://github.com/vercel/next.js/issues/67890',
                                'https://github.com/microsoft/vscode/issues/54321',
                                'https://github.com/nodejs/node/issues/98765',
                              ]}
                            />
                          </div>
                        )}
                      </div>
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
                  ].map((label, idx) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={16} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                    </motion.div>
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
      <section id="features" className="section section-alt relative overflow-hidden">
        {/* Subtle animated background grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 dark:bg-green-500/10 border border-green-500/20 dark:border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Production-Ready PRs</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
              Built for{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Speed & Precision</span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade features that make AI-powered debugging feel like magic
            </p>
          </motion.div>

          {/* Feature Cards - Premium Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                {/* Animated gradient border */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-green-500/50 via-blue-500/50 to-purple-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />

                {/* Card */}
                <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 transition-all duration-300 group-hover:border-transparent">
                  {/* Floating icon container */}
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 flex items-center justify-center border border-gray-200 dark:border-gray-800 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <motion.div
                    className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                  >
                    <ArrowRight size={16} className="text-green-600 dark:text-green-400" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Bar - Inspired by modern AI apps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-8 md:p-12 overflow-hidden">
              {/* Animated background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />

              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "100%", label: "Accuracy", sublabel: "File Discovery" },
                  { value: "3x", label: "Faster", sublabel: "Than Manual" },
                  { value: "98/100", label: "Quality", sublabel: "AI Score" },
                  { value: "24/7", label: "Available", sublabel: "Always On" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.sublabel}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-white dark:bg-neutral-950">
        <Timeline data={[
          {
            title: "Connect",
            content: (
              <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                  Authenticate with GitHub OAuth. Choose which repositories to grant access to for seamless integration.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg">
                    <Github className="text-black dark:text-white mb-2" />
                    <span className="text-sm font-medium">Secure OAuth</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg">
                    <Shield className="text-green-600 mb-2" />
                    <span className="text-sm font-medium">Granular Access</span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            title: "Select",
            content: (
              <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                  Choose any issue from your repos or import external issues from open-source projects.
                </p>
                <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-green-600" size={16} />
                    <span className="font-mono text-xs">issue #123</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fix memory leak in production server...</p>
                </div>
              </div>
            ),
          },
          {
            title: "Process",
            content: (
              <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                  Semantic file matching, intent detection, and file existence verification ensure 100% accuracy with 98/100 quality score.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Semantic Analysis</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Intent Detection</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Code Generation</span>
                </div>
              </div>
            ),
          },
          {
            title: "Review",
            content: (
              <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                  Review the solution, make adjustments if needed, and create a pull request with one click.
                </p>
                <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="text-purple-600" />
                    <span className="text-sm font-medium">feat/fix-memory-leak</span>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white text-xs rounded-lg">Create PR</button>
                </div>
              </div>
            ),
          },
        ]} />

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/auth" className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
            Get Started Free
            <ArrowRight size={20} />
          </Link>
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
      <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            {/* Brand - Takes more space */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center space-x-2">
                <img src={lightLogo} alt="Kodin" className='h-10 w-auto dark:hidden' />
                <img src={darkLogo} alt="Kodin" className='h-10 w-auto hidden dark:block' />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                AI-powered GitHub issue resolution that transforms how developers debug and ship code.
              </p>

              {/* Social links or additional info */}
              <div className="flex items-center gap-4">
                <motion.a
                  href="https://x.com/kodindotpro"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Twitter size={18} />
                </motion.a>
              </div>
            </div>

            {/* Links - Organized in columns */}
            <div className="md:col-span-7 grid grid-cols-3 gap-8">
              {/* Product */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">Product</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Features', href: '#features' },
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Pricing', to: '/pricing' },
                    { label: 'Benefits', href: '#benefits' },
                  ].map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">Resources</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Dashboard', to: '/dashboard' },
                    { label: 'Documentation', href: '#' },
                    { label: 'API Reference', href: '#' },
                    { label: 'Support', href: '#' },
                  ].map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-1 group"
                        >
                          {link.label}
                          <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 tracking-wide">Legal</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Privacy', href: '#' },
                    { label: 'Terms', href: '#' },
                    { label: 'Security', href: '#' },
                    { label: 'Cookies', href: '#' },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 Kodin. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                {/* <span className="text-xs text-gray-500 dark:text-gray-500">
                  Built with AI
                </span> */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

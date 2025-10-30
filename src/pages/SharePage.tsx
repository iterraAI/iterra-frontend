import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Twitter, Linkedin, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { waitlistAPI } from '../utils/api'

export default function SharePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sharedOnX, setSharedOnX] = useState(location.state?.sharedOnX || false)
  const [sharedOnLinkedIn, setSharedOnLinkedIn] = useState(location.state?.sharedOnLinkedIn || false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const email = location.state?.email || sessionStorage.getItem('waitlistEmail') || ''

  useEffect(() => {
    if (!email) {
      navigate('/waitlist')
    }
  }, [email, navigate])

  const appUrl = 'https://kodin.pro'
  const shareText = encodeURIComponent('🚀 Excited to try @kodin_app - AI-powered GitHub issue resolution! Can\'t wait to see how it automates bug fixing. #AI #GitHub #DevTools')

  const handleShareX = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(appUrl)}`
    window.open(shareUrl, '_blank', 'width=550,height=420')
    setSharedOnX(true)
  }

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`
    window.open(shareUrl, '_blank', 'width=550,height=420')
    setSharedOnLinkedIn(true)
  }

  const handleContinue = async () => {
    if (!sharedOnX || !sharedOnLinkedIn) {
      setError('Please share on both X (Twitter) and LinkedIn to continue')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await waitlistAPI.updateSharing({
        email,
        sharedOnX,
        sharedOnLinkedIn
      })

      if (response.data.success) {
        if (response.data.requiresReview) {
          navigate('/verify-code', { 
            state: { 
              email,
              message: 'Thank you for sharing! Your application is now under review. We\'ll send you an access code via email once approved.'
            } 
          })
        } else {
          navigate('/verify-code', { state: { email } })
        }
      }
    } catch (error: any) {
      console.error('Error updating sharing status:', error)
      setError(error.response?.data?.error || 'Failed to update. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <div className="hidden dark:block absolute inset-0" style={{
              background: 'radial-gradient(800px circle at 50% 40%, rgba(16,185,129,0.15), transparent 40%)'
            }} />
            <div className="dark:hidden absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.25) 0%, #ffffff 70%)'
            }} />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 rounded-full px-4 py-1">
                <Sparkles className="text-green-600 dark:text-emerald-400" size={16} />
                <span className="text-green-700 dark:text-emerald-300 text-sm font-semibold">Almost There!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                Share Kodin to Get
                <span className="gradient-text"> Early Access</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300">
                Help us spread the word by sharing on X (Twitter) and LinkedIn
              </p>
            </div>

            {/* Share Card */}
            <div className="bg-white dark:bg-[var(--card-bg)] rounded-2xl shadow-xl border border-gray-100 dark:border-[var(--border-primary)] p-8">
              <div className="space-y-6">
                {/* Share on X */}
                <div className={`p-6 rounded-xl border-2 transition-all ${
                  sharedOnX 
                    ? 'border-green-500 bg-green-50 dark:bg-emerald-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        sharedOnX 
                          ? 'bg-green-500' 
                          : 'bg-black dark:bg-white'
                      }`}>
                        <Twitter className={`${sharedOnX ? 'text-white' : 'text-white dark:text-black'}`} size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Share on X (Twitter)</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {sharedOnX ? 'Shared ✓' : 'Click to share with your followers'}
                        </p>
                      </div>
                    </div>
                    {sharedOnX && (
                      <CheckCircle2 className="text-green-500" size={24} />
                    )}
                  </div>
                  {!sharedOnX && (
                    <button
                      onClick={handleShareX}
                      className="mt-4 w-full btn btn-outline"
                    >
                      Share on X
                    </button>
                  )}
                </div>

                {/* Share on LinkedIn */}
                <div className={`p-6 rounded-xl border-2 transition-all ${
                  sharedOnLinkedIn 
                    ? 'border-green-500 bg-green-50 dark:bg-emerald-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        sharedOnLinkedIn 
                          ? 'bg-green-500' 
                          : 'bg-blue-600'
                      }`}>
                        <Linkedin className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Share on LinkedIn</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {sharedOnLinkedIn ? 'Shared ✓' : 'Click to share with your network'}
                        </p>
                      </div>
                    </div>
                    {sharedOnLinkedIn && (
                      <CheckCircle2 className="text-green-500" size={24} />
                    )}
                  </div>
                  {!sharedOnLinkedIn && (
                    <button
                      onClick={handleShareLinkedIn}
                      className="mt-4 w-full btn btn-outline"
                    >
                      Share on LinkedIn
                    </button>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={!sharedOnX || !sharedOnLinkedIn || isSubmitting}
                  className="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  After sharing, click "Continue" to proceed with your application
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


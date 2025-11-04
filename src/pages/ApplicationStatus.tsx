import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { waitlistAPI } from '../utils/api'
import Loader from '../components/Loader'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'

type WaitlistStatus = 'pending_sharing' | 'pending_review' | 'approved' | 'rejected' | 'expired' | 'not_submitted'

export default function ApplicationStatus() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuthStore()
  const [statusData, setStatusData] = useState<{
    waitlistStatus: WaitlistStatus
    hasWaitlistEntry: boolean
    email: string | null
    hasAccess: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      if (authLoading) return

      try {
        const response = await waitlistAPI.checkStatus()
        const data = response.data

        // If user has access, redirect to dashboard
        if (data.hasAccess) {
          navigate('/dashboard', { replace: true })
          return
        }

        // Set status data
        setStatusData({
          waitlistStatus: data.waitlistStatus || 'not_submitted',
          hasWaitlistEntry: data.hasWaitlistEntry || false,
          email: data.email || data.waitlistEmail || null,
          hasAccess: data.hasAccess || false
        })
      } catch (error: any) {
        console.error('Error checking status:', error)
        // On error, assume not submitted
        setStatusData({
          waitlistStatus: 'not_submitted',
          hasWaitlistEntry: false,
          email: null,
          hasAccess: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [authLoading, navigate])

  if (authLoading || isLoading) {
    return <Loader variant="fullPage" text="Checking your application status..." />
  }

  if (!statusData) {
    return <Loader variant="fullPage" text="Loading..." />
  }

  const getStatusConfig = () => {
    switch (statusData.waitlistStatus) {
      case 'approved':
        return {
          icon: CheckCircle2,
          title: 'Application Approved!',
          description: 'Your application has been approved. You should have received an access code via email.',
          color: 'green',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-700 dark:text-green-300',
          iconColor: 'text-green-600 dark:text-green-400'
        }
      case 'pending_review':
        return {
          icon: Clock,
          title: 'Application Under Review',
          description: 'Your application is currently being reviewed by our team. We\'ll notify you once a decision has been made.',
          color: 'yellow',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'pending_sharing':
        return {
          icon: Clock,
          title: 'Application Pending',
          description: 'Your application is pending. Please complete the required steps to proceed.',
          color: 'blue',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-300',
          iconColor: 'text-blue-600 dark:text-blue-400'
        }
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Application Not Approved',
          description: 'Unfortunately, your application was not approved at this time. You can reapply if you believe this was an error.',
          color: 'red',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-300',
          iconColor: 'text-red-600 dark:text-red-400'
        }
      case 'expired':
        return {
          icon: AlertCircle,
          title: 'Access Code Expired',
          description: 'Your access code has expired. Please contact support or reapply for access.',
          color: 'orange',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-700 dark:text-orange-300',
          iconColor: 'text-orange-600 dark:text-orange-400'
        }
      default:
        return {
          icon: AlertCircle,
          title: 'No Application Found',
          description: 'You haven\'t submitted a waitlist application yet. Join the waitlist to get early access.',
          color: 'gray',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-700 dark:text-gray-300',
          iconColor: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-[#0a0a0b] dark:to-[#0e0f12]">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
            </Link>
            <div className="flex items-center space-x-3">
              {user && (
                <Link to="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              )}
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-2xl p-8 shadow-xl`}>
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className={`${statusConfig.iconColor} bg-white dark:bg-[#0a0a0b] rounded-full p-4 shadow-lg`}>
                  <StatusIcon size={48} />
                </div>
              </div>

              {/* Title */}
              <h1 className={`text-3xl font-bold ${statusConfig.textColor}`}>
                {statusConfig.title}
              </h1>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {statusConfig.description}
              </p>

              {/* Email Display */}
              {statusData.email && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail size={18} />
                  <span className="text-sm">{statusData.email}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {statusData.waitlistStatus === 'approved' && (
                  <>
                    <Link to="/verify-code" className="btn btn-primary">
                      Verify Access Code
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                      Back to Home
                    </Link>
                  </>
                )}
                {statusData.waitlistStatus === 'pending_review' && (
                  <>
                    <Link to="/" className="btn btn-secondary">
                      Back to Home
                    </Link>
                    <Link to="/waitlist" className="btn btn-outline">
                      View Waitlist
                    </Link>
                  </>
                )}
                {statusData.waitlistStatus === 'not_submitted' && (
                  <>
                    <Link to="/waitlist" className="btn btn-primary">
                      Join Waitlist
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                      Back to Home
                    </Link>
                  </>
                )}
                {statusData.waitlistStatus === 'rejected' && (
                  <>
                    <Link to="/waitlist" className="btn btn-primary">
                      Reapply
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                      Back to Home
                    </Link>
                  </>
                )}
                {statusData.waitlistStatus === 'expired' && (
                  <>
                    <Link to="/waitlist" className="btn btn-primary">
                      Reapply
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                      Back to Home
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>
              Questions? Contact us at{' '}
              <a href="mailto:support@kodin.pro" className="text-green-600 dark:text-green-400 hover:underline">
                support@kodin.pro
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


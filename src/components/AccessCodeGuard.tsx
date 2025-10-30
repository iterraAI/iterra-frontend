import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { waitlistAPI } from '../utils/api'
import { useAuthStore } from '../store/authStore'

interface AccessCodeGuardProps {
  children: React.ReactNode
}

export default function AccessCodeGuard({ children }: AccessCodeGuardProps) {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) {
        console.log('[AccessCodeGuard] Waiting for authLoading, user:', user)
        return
      }
      try {
        console.log('[AccessCodeGuard] Calling /api/waitlist/status. user:', user)
        const response = await waitlistAPI.checkStatus()
        console.log('[AccessCodeGuard] API response:', response.data)
        if (response.data.hasAccess) {
          setHasAccess(true)
        } else {
          console.log('[AccessCodeGuard] No access, redirecting to /waitlist')
          navigate('/waitlist', { replace: true })
        }
      } catch (error) {
        console.error('[AccessCodeGuard] Error checking access status:', error)
        navigate('/waitlist', { replace: true })
      } finally {
        setIsChecking(false)
      }
    }
    checkAccess()
  }, [navigate, authLoading, user])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-[#0a0a0b] dark:to-[#0e0f12]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null // Navigate will happen
  }

  return <>{children}</>
}


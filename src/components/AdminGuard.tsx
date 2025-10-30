import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth check to complete first
      if (authLoading) {
        return
      }

      // Check if user is authenticated
      if (!user) {
        console.log('❌ No user authenticated, redirecting to auth')
        navigate('/auth', { replace: true })
        return
      }

      // Check if user is admin by checking their email against admin emails
      // This is a simple check - in production you might want to make an API call
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim().toLowerCase()) || []
      const userEmail = user.email?.toLowerCase()

      if (userEmail && adminEmails.includes(userEmail)) {
        console.log('✅ Admin access granted for:', userEmail)
        setIsAdmin(true)
      } else {
        console.log('❌ Admin access denied for:', userEmail)
        navigate('/dashboard', { replace: true })
      }

      setIsChecking(false)
    }

    checkAdminAccess()
  }, [navigate, authLoading, user])

  if (isChecking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-[#0a0a0b] dark:to-[#0e0f12]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Navigate will happen
  }

  return <>{children}</>
}

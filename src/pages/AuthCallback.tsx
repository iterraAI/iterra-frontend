import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { waitlistAPI } from '../utils/api'
import Loader from '../components/Loader'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setToken, checkAuth } = useAuthStore()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token')
      
      if (token) {
        // Store the token
        setToken(token)
        
        // Verify the token and get user data
        await checkAuth()
        
        // Check if user has access and determine routing
        try {
          console.log('🔍 Checking access status after authentication...')
          const response = await waitlistAPI.checkStatus()
          console.log('📊 Access status response:', response.data)
          
          if (response.data.hasAccess) {
            // User has access (test user or verified access code)
            console.log('✅ User has access, redirecting to dashboard')
            navigate('/dashboard', { replace: true })
          } else {
            // Intelligent routing based on waitlist status
            const waitlistStatus = response.data.waitlistStatus || 'not_submitted'
            const hasWaitlistEntry = response.data.hasWaitlistEntry || false
            
            console.log(`📋 Waitlist status: ${waitlistStatus}, hasEntry: ${hasWaitlistEntry}`)
            
            if (hasWaitlistEntry) {
              // User has submitted waitlist - show status page
              console.log('📄 User has waitlist entry, redirecting to status page')
              navigate('/application-status', { replace: true })
            } else {
              // User hasn't submitted waitlist - redirect to waitlist form
              console.log('📝 User has not submitted waitlist, redirecting to waitlist form')
              navigate('/waitlist', { replace: true })
            }
          }
        } catch (error) {
          console.error('❌ Error checking access status:', error)
          // On error, redirect to application status page (will show appropriate message)
          navigate('/application-status', { replace: true })
        }
      } else {
        // No token found, redirect to home
        console.error('No token received from OAuth callback')
        navigate('/')
      }
    }

    handleAuthCallback()
  }, [searchParams, setToken, checkAuth, navigate])

  return <Loader variant="fullPage" text="Completing authentication..." />
}

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
        
        // Check if user has access (test user or access code)
        try {
          console.log('🔍 Checking access status after authentication...')
          const response = await waitlistAPI.checkStatus()
          console.log('📊 Access status response:', response.data)
          
          if (response.data.hasAccess) {
            // User has access (test user or verified access code)
            console.log('✅ User has access, redirecting to dashboard')
            navigate('/dashboard')
          } else {
            // User needs to go through waitlist
            console.log('⚠️ User needs waitlist, redirecting to waitlist')
            navigate('/waitlist')
          }
        } catch (error) {
          console.error('❌ Error checking access status:', error)
          // On error, redirect to waitlist
          navigate('/waitlist')
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

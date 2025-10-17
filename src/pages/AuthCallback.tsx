import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
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
        
        // Redirect to dashboard
        navigate('/dashboard')
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

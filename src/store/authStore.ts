import { create } from 'zustand'
import axios from 'axios'

interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  token: string | null
  checkAuth: () => Promise<void>
  setToken: (token: string) => void
  logout: () => Promise<void>
}

// Helper function to get token from localStorage
const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// Helper function to store token in localStorage
const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token)
}

// Helper function to remove token from localStorage
const removeToken = (): void => {
  localStorage.removeItem('auth_token')
}

// Helper function to create axios instance with auth header
const createAuthenticatedRequest = (token: string) => {
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  token: getStoredToken(),
  
  setToken: (token: string) => {
    storeToken(token)
    set({ token })
  },
  
  checkAuth: async () => {
    const { token } = get()
    
    if (!token) {
      set({ user: null, isLoading: false })
      return
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const authenticatedRequest = createAuthenticatedRequest(token)
      const response = await authenticatedRequest.get(`${apiUrl}/api/auth/me`)
      set({ user: response.data, isLoading: false })
    } catch (error) {
      console.log('Auth check failed:', error)
      // Token is invalid, remove it
      removeToken()
      set({ user: null, token: null, isLoading: false })
    }
  },
  
  logout: async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      await axios.post(`${apiUrl}/api/auth/logout`)
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Always clear local state regardless of API call
      removeToken()
      set({ user: null, token: null })
      window.location.href = '/'
    }
  }
}))

import axios from 'axios'

// Get the API base URL from environment variables
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000'
}

// Get the JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('auth_token')
}

// Create an authenticated axios instance
export const createAuthenticatedRequest = () => {
  const apiUrl = getApiUrl()
  const token = getToken()
  
  return axios.create({
    baseURL: apiUrl,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  })
}

// Helper function for making authenticated GET requests
export const authenticatedGet = async (endpoint: string) => {
  const apiUrl = getApiUrl()
  const token = getToken()
  
  console.log('🔍 Frontend API call:', `${apiUrl}${endpoint}`)
  console.log('🎫 Token present:', token ? 'Yes' : 'No')
  console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'None')
  
  const response = await axios.get(`${apiUrl}${endpoint}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  })
  
  return response
}

// Helper function for making authenticated POST requests
export const authenticatedPost = async (endpoint: string, data?: any) => {
  const apiUrl = getApiUrl()
  const token = getToken()
  
  const response = await axios.post(`${apiUrl}${endpoint}`, data, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  })
  
  return response
}

// Helper function for making authenticated PUT requests
export const authenticatedPut = async (endpoint: string, data?: any) => {
  const apiUrl = getApiUrl()
  const token = getToken()
  
  const response = await axios.put(`${apiUrl}${endpoint}`, data, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  })
  
  return response
}

// Helper function for making authenticated DELETE requests
export const authenticatedDelete = async (endpoint: string) => {
  const apiUrl = getApiUrl()
  const token = getToken()
  
  const response = await axios.delete(`${apiUrl}${endpoint}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined
    }
  })
  
  return response
}

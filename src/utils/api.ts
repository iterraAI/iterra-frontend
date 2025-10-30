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
    },
    withCredentials: true // For sessions
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
    },
    withCredentials: true
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
    },
    withCredentials: true
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
    },
    withCredentials: true
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
    },
    withCredentials: true
  })
  
  return response
}

// Waitlist API functions
export const waitlistAPI = {
  submit: async (data: { 
    name?: string
    email: string
    githubId: string
    githubUsername?: string
    twitterHandle?: string
    linkedinUrl?: string
    motivation?: string
  }) => {
    const apiUrl = getApiUrl()
    return axios.post(`${apiUrl}/api/waitlist/submit`, data, {
      withCredentials: true
    })
  },

  updateSharing: async (data: {
    email: string
    sharedOnX: boolean
    sharedOnLinkedIn: boolean
  }) => {
    const apiUrl = getApiUrl()
    return axios.post(`${apiUrl}/api/waitlist/update-sharing`, data, {
      withCredentials: true
    })
  },

  verifyCode: async (data: {
    email: string
    accessCode: string
  }) => {
    const apiUrl = getApiUrl()
    return axios.post(`${apiUrl}/api/waitlist/verify-code`, data, {
      withCredentials: true
    })
  },

  checkStatus: async () => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.get(`${apiUrl}/api/waitlist/status`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
      },
      withCredentials: true
    })
  }
}

// Admin API functions
export const adminAPI = {
  getWaitlistEntries: async () => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.get(`${apiUrl}/api/admin/waitlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  getWaitlistEntry: async (id: string) => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.get(`${apiUrl}/api/admin/waitlist/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  approveEntry: async (id: string) => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.post(`${apiUrl}/api/admin/waitlist/${id}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  rejectEntry: async (id: string) => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.post(`${apiUrl}/api/admin/waitlist/${id}/reject`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  },

  generateNewCode: async (id: string) => {
    const apiUrl = getApiUrl()
    const token = getToken()
    return axios.post(`${apiUrl}/api/admin/waitlist/${id}/generate-code`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

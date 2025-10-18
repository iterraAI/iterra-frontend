import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Repositories from './pages/Repositories'
import Issues from './pages/Issues'
import IssueSolver from './pages/IssueSolver'
import Validations from './pages/Validations'
import ValidationDetail from './pages/ValidationDetail'
import PullRequests from './pages/PullRequests'
import Contribute from './pages/Contribute'
import Pricing from './pages/Pricing'

function App() {
  const { checkAuth } = useAuthStore()
  
  // Check authentication when app loads
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/repositories" element={<ProtectedRoute><Layout><Repositories /></Layout></ProtectedRoute>} />
        <Route path="/issues" element={<ProtectedRoute><Layout><Issues /></Layout></ProtectedRoute>} />
        <Route path="/issues/:issueId/solve" element={<ProtectedRoute><Layout><IssueSolver /></Layout></ProtectedRoute>} />
        <Route path="/validations" element={<ProtectedRoute><Layout><Validations /></Layout></ProtectedRoute>} />
        <Route path="/validations/:solutionId" element={<ProtectedRoute><Layout><ValidationDetail /></Layout></ProtectedRoute>} />
        <Route path="/pull-requests" element={<ProtectedRoute><Layout><PullRequests /></Layout></ProtectedRoute>} />
        <Route path="/contribute" element={<ProtectedRoute><Layout><Contribute /></Layout></ProtectedRoute>} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    // Force redirect to home page
    window.location.replace('/')
    return null
  }
  
  return <>{children}</>
}

export default App

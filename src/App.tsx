import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import AccessCodeGuard from './components/AccessCodeGuard'
import AdminGuard from './components/AdminGuard'
import LandingPage from './pages/LandingPage'
import Waitlist from './pages/Waitlist'
import SharePage from './pages/SharePage'
import ThankYou from './pages/ThankYou'
import VerifyCode from './pages/VerifyCode'
import ApplicationStatus from './pages/ApplicationStatus'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Repositories from './pages/Repositories'
import Issues from './pages/Issues'
import IssueSolver from './pages/IssueSolver'
import Validations from './pages/Validations'
import ValidationDetail from './pages/ValidationDetail'
import PullRequests from './pages/PullRequests'
import Contribute from './pages/Contribute'
import Pricing from './pages/Pricing'
import ProfileSettings from './pages/ProfileSettings'

function App() {
  const { checkAuth } = useAuthStore()
  
  // Check authentication when app loads
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        {/* Public routes (no access code required) */}
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/application-status" element={<ApplicationStatus />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Auth routes - NO access guard (so users can log in first) */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Landing page - wrapped with access guard (will redirect to waitlist if no access) */}
        {/* <Route path="/" element={<AccessCodeGuard><LandingPage /></AccessCodeGuard>} /> */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Admin routes - require admin access */}
        <Route path="/admin" element={<AccessCodeGuard><AdminGuard><Layout><AdminDashboard /></Layout></AdminGuard></AccessCodeGuard>} />
        
        {/* Protected routes - require both access code AND authentication */}
        <Route path="/dashboard" element={<AccessCodeGuard><ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/repositories" element={<AccessCodeGuard><ProtectedRoute><Layout><Repositories /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/issues" element={<AccessCodeGuard><ProtectedRoute><Layout><Issues /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/issues/:issueId/solve" element={<AccessCodeGuard><ProtectedRoute><Layout><IssueSolver /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/validations" element={<AccessCodeGuard><ProtectedRoute><Layout><Validations /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/validations/:solutionId" element={<AccessCodeGuard><ProtectedRoute><Layout><ValidationDetail /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/pull-requests" element={<AccessCodeGuard><ProtectedRoute><Layout><PullRequests /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/contribute" element={<AccessCodeGuard><ProtectedRoute><Layout><Contribute /></Layout></ProtectedRoute></AccessCodeGuard>} />
        <Route path="/profile-settings" element={<AccessCodeGuard><ProtectedRoute><ProfileSettings /></ProtectedRoute></AccessCodeGuard>} />
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

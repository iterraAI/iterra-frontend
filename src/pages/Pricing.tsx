import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { authenticatedGet } from '../utils/api'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import PaymentModal from '../components/PaymentModal'
import ThemeSwitcher from '../components/ThemeSwitcher'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  features: string[]
  aiModels: string[]
  monthlyCredits: number
  monthlyLimit?: number // Deprecated: kept for backward compatibility
}

interface PricingData {
  success: boolean
  plans: Plan[]
  count: number
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { user, isLoading: authLoading } = useAuthStore()
  const navigate = useNavigate()

  // Fetch user's current subscription status
  const { data: userSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['subscription-details'],
    queryFn: async () => {
      try {
        const res = await authenticatedGet('/api/payments/subscription')
        return res.data
      } catch (error) {
        console.error('Failed to fetch subscription data:', error)
        return null
      }
    },
    enabled: !!user
  })

  // Default plans data
  const defaultPlans: PricingData = {
    success: true,
    plans: [
      {
        id: 'FREE',
        name: 'Free Tier',
        description: 'Perfect for getting started with AI-powered issue solving',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Basic issue solving',
          'GPT-5 mini only',
          'Standard validation',
          'Community support',
          '15 credits per month'
        ],
        aiModels: ['openai'],
        monthlyCredits: 15,
        monthlyLimit: 15 // Deprecated
      },
      {
        id: 'PRO',
        name: 'Pro Tier',
        description: 'For developers who need access to premium AI models',
        price: 20,
        currency: 'USD',
        interval: 'monthly',
        features: [
          // '200 credits per month',
          'All AI models (GPT-5, Claude)',
          'Advanced validation features',
          'Priority support',
          'Enhanced diff viewer',
          'Risk assessment tools'
        ],
        aiModels: ['openai', 'anthropic'],
        monthlyCredits: 200,
        monthlyLimit: 200 // Deprecated
      },
      {
        id: 'PRO_PLUS',
        name: 'Pro+',
        description: 'For power users who need more credits and advanced features',
        price: 50,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Everything in Pro',
          // '400 credits per month',
          'One-click automated fixes',
          'Auto-apply with rollback',
          'Code refactoring',
          'Everything in Pro'
        ],
        aiModels: ['openai', 'anthropic'],
        monthlyCredits: 400,
        monthlyLimit: 400 // Deprecated
      },
      {
        id: 'TEAMS',
        name: 'Teams',
        description: 'For teams and organizations with high-volume needs',
        price: 150,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Everything in Pro+',
          // '1,000 credits per month',
          'Team workspaces',
          'Collaborative reviews',
          'Approval workflows',
          'Parallel processing (5 concurrent)',
          'Everything in Pro+'
        ],
        aiModels: ['openai', 'anthropic'],
        monthlyCredits: 1000,
        monthlyLimit: 1000 // Deprecated
      },
      {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        description: 'For large organizations with custom needs',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Custom credit allocation',
          'All AI models',
          'On-premise deployment',
          'Custom model fine-tuning',
          'Dedicated support',
          'SLA guarantees',
          'Everything in Teams'
        ],
        aiModels: ['openai', 'anthropic'],
        monthlyCredits: 0, // Custom
        monthlyLimit: -1 // Deprecated
      }
    ],
    count: 5
  }

  // Fetch subscription plans (public endpoint)
  const { data: pricingData, isLoading } = useQuery<PricingData>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/payments/plans')
        return res.data
      } catch (error) {
        console.error('Failed to fetch plans, using default:', error)
        return defaultPlans
      }
    },
    enabled: true, // Always fetch plans, even for non-logged users
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: defaultPlans
  })

  const handleSelectPlan = (planId: string) => {
    if (planId === 'FREE') {
      toast.error('You are already on the Free plan')
      return
    }
    setSelectedPlan(planId)
  }

  const handleUpgrade = async () => {
    if (selectedPlan === 'FREE') {
      toast.error('Please select a paid plan to upgrade')
      return
    }
    
    // If user is not logged in, redirect to auth
    if (!user) {
      navigate('/auth')
      return
    }

    // Check if user is already on the selected plan
    const currentPlan = userSubscription?.subscription?.plan || 'FREE'
    if (currentPlan === selectedPlan) {
      toast.error(`You are already on the ${selectedPlan} plan`)
      return
    }
    
    setShowPaymentModal(true)
  }


  if (isLoading || authLoading || subscriptionLoading) {
    return <Loader variant="fullPage" text="Loading pricing plans..." />
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="pl-4 pr-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Dashboard
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              )}
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your development needs. Start free and scale as you grow.
            </p>
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple, transparent pricing for every developer
            </p>
          </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {pricingData?.plans?.map((plan: Plan) => {
            const isCurrentPlan = user && userSubscription?.subscription?.plan === plan.id
            const isSelected = selectedPlan === plan.id
            const isPopular = plan.id === 'PRO'
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-[var(--bg-secondary)] rounded-lg border transition-all ${
                  isPopular && !isCurrentPlan
                    ? 'border-green-500 dark:border-green-600 shadow-lg'
                    : isCurrentPlan
                    ? 'border-green-500 dark:border-green-600'
                    : isSelected
                    ? 'border-gray-400 dark:border-gray-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {plan.name}
                    </h3>
                    {plan.id !== 'FREE' && (
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">/mo</span>
                      </div>
                    )}
                    {plan.id === 'FREE' && (
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          Free
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Credits - Primary Info */}
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-500">
                      {plan.monthlyCredits === 0 ? 'Custom' : plan.monthlyCredits === -1 ? '∞' : plan.monthlyCredits.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      credits/mo
                    </div>
                  </div>

                  {/* Key Features - Minimal List */}
                  <div className="space-y-2 mb-6">
                    {plan.features.slice(0, 4).map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature.replace(' per month', '').replace(' credits', '')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={plan.id === 'FREE' || !!isCurrentPlan}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isCurrentPlan
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : 
                     isSelected ? 'Selected' : 
                     plan.id === 'FREE' ? 'Get Started' : 'Select'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upgrade Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleUpgrade}
            disabled={selectedPlan === 'FREE' || (user && userSubscription?.subscription?.plan === selectedPlan) || false}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <span>
              {user ? 
                (userSubscription?.subscription?.plan === selectedPlan ? 
                  `Current Plan` : 
                  userSubscription?.subscription?.plan === 'FREE' ? 
                  'Upgrade Now' : 
                  'Change Plan'
                ) : 
                'Sign In to Upgrade'
              }
            </span>
            <ArrowRight size={18} />
          </button>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">
            {user ? 'Secure payment • Cancel anytime' : 'Sign in to upgrade your plan'}
          </p>
        </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={logo} alt="Kodin" className='h-8 w-32' />
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered issue solving for developers worldwide
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer> */}

      {/* Payment Modal */}
      {pricingData?.plans && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          planId={selectedPlan}
                  planName={pricingData.plans.find((p: Plan) => p.id === selectedPlan)?.name || 'Pro Plan'}
                  amount={pricingData.plans.find((p: Plan) => p.id === selectedPlan)?.price || 15}
        />
      )}
    </div>
  )
}

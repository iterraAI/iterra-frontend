import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { authenticatedGet } from '../utils/api'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import PaymentModal from '../components/PaymentModal'
import ThemeSwitcher from '../components/ThemeSwitcher'
import logo from '../assets/logo_new.png'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  features: string[]
  aiModels: string[]
  monthlyLimit: number
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
          'Groq models only (FREE)',
          'Standard validation',
          'Community support',
          '10 solutions per month'
        ],
        aiModels: ['groq'],
        monthlyLimit: 10
      },
      {
        id: 'PRO',
        name: 'Pro Tier',
        description: 'For developers who need access to premium AI models',
        price: 15,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'All AI models (GPT-4o, Claude, Groq)',
          'Advanced validation features',
          'Priority support',
          '100 solutions per month',
          'Enhanced diff viewer',
          'Risk assessment tools'
        ],
        aiModels: ['groq', 'openai', 'anthropic'],
        monthlyLimit: 100
      },
      {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        description: 'For teams and organizations with high-volume needs',
        price: 50,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Unlimited AI solutions',
          'All AI models',
          'API access',
          'Custom integrations',
          'Dedicated support',
          'Team management',
          'Advanced analytics',
          'Priority processing'
        ],
        aiModels: ['groq', 'openai', 'anthropic'],
        monthlyLimit: -1
      }
    ],
    count: 3
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

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'FREE':
        return <Zap className="text-blue-600" size={24} />
      case 'PRO':
        return <Star className="text-purple-600" size={24} />
      case 'ENTERPRISE':
        return <Crown className="text-yellow-600" size={24} />
      default:
        return <Zap className="text-gray-600" size={24} />
    }
  }

  const getPlanBadge = (planId: string) => {
    switch (planId) {
      case 'FREE':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">FREE</span>
      case 'PRO':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">POPULAR</span>
      case 'ENTERPRISE':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">ENTERPRISE</span>
      default:
        return null
    }
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
              <img src={logo} alt="Iterra AI" className='h-12 w-42' />
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingData?.plans?.map((plan: Plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-purple-500 scale-105 shadow-2xl'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:shadow-xl'
              }`}
            >
              {/* Plan Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                {getPlanBadge(plan.id)}
              </div>

              {/* Plan Header */}
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 dark:text-gray-300">/{plan.interval}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* AI Models */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Available AI Models:
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                            {plan.aiModels.map((model: string) => (
                      <span
                        key={model}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {model === 'groq' ? '🆓 Groq' : 
                         model === 'openai' ? '🤖 OpenAI' : 
                         model === 'anthropic' ? '🧠 Claude' : model}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage Limit */}
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Monthly Limit:
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {plan.monthlyLimit === -1 ? 'Unlimited' : `${plan.monthlyLimit} solutions`}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : plan.id === 'FREE'
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                  disabled={plan.id === 'FREE'}
                >
                  {plan.id === 'FREE' ? 'Current Plan' : 
                   selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Button */}
        <div className="text-center">
          <button
            onClick={handleUpgrade}
            disabled={selectedPlan === 'FREE' || (user && userSubscription?.subscription?.plan === selectedPlan) || false}
            className="btn btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
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
            <ArrowRight size={20} />
          </button>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
            {user ? 'Secure payment powered by Razorpay • Cancel anytime' : 'Sign in to access your dashboard and upgrade your plan'}
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white/80 dark:bg-[var(--bg-secondary)] backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What happens if I exceed my limit?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You'll be prompted to upgrade your plan. We'll notify you when you reach 80% of your limit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Is my payment secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Absolutely! We use Razorpay for secure payment processing with industry-standard encryption.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can cancel anytime from your account settings. You'll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={logo} alt="Iterra AI" className='h-8 w-32' />
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

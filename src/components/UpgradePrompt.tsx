import { useState } from 'react'
import { Crown, Star, ArrowRight, X } from 'lucide-react'
import PaymentModal from './PaymentModal'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  reason?: 'model_access' | 'usage_limit' | 'premium_feature'
  modelName?: string
  currentPlan?: string
  className?: string
}

const upgradeReasons = {
  model_access: {
    title: 'Premium AI Model Access Required',
    description: 'Access to premium AI models requires a Pro subscription.',
    features: [
      'Access to all AI models (GPT-4o, Claude, Groq)',
      '100 solutions per month',
      'Priority support',
      'Advanced validation features'
    ]
  },
  usage_limit: {
    title: 'Monthly Limit Reached',
    description: 'You\'ve reached your monthly usage limit. Upgrade to continue solving issues.',
    features: [
      '100 solutions per month (vs 10 free)',
      'Access to premium AI models',
      'Priority processing',
      'Advanced analytics'
    ]
  },
  premium_feature: {
    title: 'Premium Feature',
    description: 'This feature is available only for Pro subscribers.',
    features: [
      'All premium features unlocked',
      'Priority support',
      'Advanced validation tools',
      'Team collaboration features'
    ]
  }
}

export default function UpgradePrompt({ 
  isOpen, 
  onClose, 
  reason = 'premium_feature',
  currentPlan = 'FREE',
  className = ''
}: UpgradePromptProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const reasonConfig = upgradeReasons[reason]

  const handleUpgrade = () => {
    setShowPaymentModal(true)
  }

  const handleClosePayment = () => {
    setShowPaymentModal(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {reasonConfig.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Current plan: {currentPlan}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {reasonConfig.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            With Pro subscription you get:
          </h4>
          <ul className="space-y-2">
            {reasonConfig.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Preview */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Pro Plan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Perfect for developers</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                $15
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">/month</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Star size={18} />
            <span>Upgrade to Pro</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Secure payment • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePayment}
        planId="PRO"
        planName="Pro Plan"
        amount={15}
      />
    </>
  )
}

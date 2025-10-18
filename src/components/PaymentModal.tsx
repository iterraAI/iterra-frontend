import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, CreditCard, Shield, CheckCircle } from 'lucide-react'
import { authenticatedPost } from '../utils/api'
import toast from 'react-hot-toast'

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  planName: string
  amount: number
}

interface OrderData {
  success: boolean
  order: {
    id: string
    amount: number
    currency: string
    receipt: string
  }
  plan: {
    id: string
    name: string
    price: number
  }
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  planId, 
  planName, 
  amount
}: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<'order' | 'payment' | 'success' | 'error'>('order')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const queryClient = useQueryClient()

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await authenticatedPost('/api/payments/create-order', { planId })
      return res.data
    },
    onSuccess: (data: OrderData) => {
      console.log('✅ Order created successfully:', data)
      setOrderData(data)
      setPaymentStep('payment')
      
      // Initialize Razorpay directly with the data instead of relying on state
      initializeRazorpayWithData(data)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create order')
      setPaymentStep('error')
    }
  })

  // Verify payment mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const res = await authenticatedPost('/api/payments/verify-payment', {
        orderId: orderData?.order.id,
        paymentId: paymentData.razorpay_payment_id,
        signature: paymentData.razorpay_signature,
        planId
      })
      return res.data
    },
    onSuccess: () => {
      setPaymentStep('success')
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] })
      queryClient.invalidateQueries({ queryKey: ['ai-models'] })
      toast.success('Payment successful! Your subscription is now active.')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Payment verification failed')
      setPaymentStep('error')
    }
  })


  const initializeRazorpayWithData = (data: OrderData) => {
    console.log('🚀 Initializing Razorpay with order data:', data)
    
    if (window.Razorpay) {
      console.log('✅ Razorpay already loaded, opening modal with data')
      displayRazorpayWithData(data)
      return
    }

    console.log('📥 Loading Razorpay script...')
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully')
      // Small delay to ensure the script is fully initialized
      setTimeout(() => {
        displayRazorpayWithData(data)
      }, 50)
    }
    script.onerror = (error) => {
      console.error('❌ Failed to load Razorpay SDK:', error)
      toast.error('Failed to load Razorpay SDK')
      setPaymentStep('error')
    }
    document.body.appendChild(script)
  }

  const displayRazorpayWithData = (data: OrderData) => {
    if (!window.Razorpay) {
      console.error('❌ Razorpay not available on window object')
      toast.error('Razorpay SDK not loaded')
      setPaymentStep('error')
      return
    }

    console.log('🛒 Opening Razorpay with order:', data.order.id)

    const options = {
      key: 'rzp_test_RSfXcpF1F8PhXj', // Use the test key from your env
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'Iterra AI',
      description: `AI-Powered Issue Solver - ${planName}`,
      order_id: data.order.id,
      image: '/logo_new.png',
      prefill: {
        name: 'Developer',
        email: 'developer@example.com',
        contact: '+91 9999999999'
      },
      theme: {
        color: '#8B5CF6',
        backdrop_color: '#1f2937'
      },
      // Enable multiple payment methods
      method: {
        netbanking: true,
        wallet: true,
        emi: true,
        upi: true,
        card: true
      },
      // Enable international cards
      international: true,
      // Enable retry for failed payments
      retry: {
        enabled: true,
        max_count: 3
      },
      // Enable save card for future payments
      save_card: true,
      // Additional branding
      notes: {
        plan: planName,
        service: 'AI Issue Solver'
      },
      handler: function (response: any) {
        console.log('✅ Payment successful:', response)
        verifyPaymentMutation.mutate(response)
      },
      modal: {
        ondismiss: function() {
          console.log('❌ Payment modal dismissed')
          setPaymentStep('error')
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
      console.log('✅ Razorpay modal opened')
    } catch (error) {
      console.error('❌ Error opening Razorpay modal:', error)
      toast.error('Failed to open payment modal')
      setPaymentStep('error')
    }
  }


  const handleClose = () => {
    setPaymentStep('order')
    setOrderData(null)
    onClose()
  }

  const handleStartPayment = () => {
    createOrderMutation.mutate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Complete Payment
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStep === 'order' && (
            <div className="space-y-6">
              {/* Plan Details */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {planName}
                </h3>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${amount}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-300">/month</span>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  What you'll get:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Access to all AI models (GPT-4o, Claude, Groq)</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>100 AI solutions per month</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500" size={16} />
                    <span>Advanced validation features</span>
                  </li>
                </ul>
              </div>

              {/* Security Notice */}
              <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Shield className="text-green-500 mt-0.5" size={16} />
                <span>Your payment is secure and encrypted. Cancel anytime.</span>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleStartPayment}
                disabled={createOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating order...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Pay ${amount}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {paymentStep === 'payment' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Redirecting to payment...
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You will be redirected to Razorpay secure payment page.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setPaymentStep('error')}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                >
                  Cancel if taking too long
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your {planName} subscription is now active. You can start using premium AI models immediately.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {paymentStep === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <X className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Payment Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                There was an issue processing your payment. Please try again or contact support.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleStartPayment}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Loader2, Sparkles } from 'lucide-react'

interface LoaderProps {
  variant?: 'fullPage' | 'inline' | 'small'
  text?: string
  className?: string
}

export default function Loader({ variant = 'inline', text, className = '' }: LoaderProps) {
  // Full page loader - centered with backdrop
  if (variant === 'fullPage') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Animated icon with gradient background */}
          <div className="relative mx-auto w-20 h-20">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
            
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white animate-pulse" size={24} />
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              {text || 'Loading...'}
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Small loader - for inline use (buttons, etc.)
  if (variant === 'small') {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <Loader2 className="animate-spin text-green-600" size={16} />
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    )
  }

  // Inline loader - for page sections
  return (
    <div className={`flex flex-col items-center justify-center py-16 space-y-4 ${className}`}>
      {/* Spinner with gradient */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 border-r-green-500 animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Text */}
      {text && (
        <p className="text-base font-medium text-gray-800 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Loading skeleton for cards
export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for stats
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}


// import { Link, useLocation } from 'react-router-dom'
// import { CheckCircle2, Sparkles, ArrowRight, Heart } from 'lucide-react'
// import darkLogo from '../assets/logo_dark.png'
// import lightLogo from '../assets/logo_light.png'
// import ThemeSwitcher from '../components/ThemeSwitcher'

// export default function ThankYou() {
//   const location = useLocation()
//   const email = (location.state as any)?.email || ''

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Navigation */}
//       <nav className="bg-transparent backdrop-blur-lg z-50 shadow-sm flex-shrink-0">
//         <div className="pr-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-2">
//               <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
//               <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
//             </div>
//             <div className="flex items-center space-x-3">
//               <ThemeSwitcher />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <section className="relative flex-1 overflow-hidden flex items-center justify-center">
//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0">
//             <div className="hidden dark:block absolute inset-0" style={{
//               background: 'radial-gradient(800px circle at 50% 40%, rgba(16,185,129,0.15), transparent 40%)'
//             }} />
//             <div className="dark:hidden absolute inset-0" style={{
//               background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.25) 0%, #ffffff 70%)'
//             }} />
//           </div>
//         </div>

//         <div className="container-custom relative z-10 w-full">
//           <div className="max-w-full mx-auto">
//             {/* Thank You Card */}
//             <div className="bg-white/90 dark:bg-transparent backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-12 text-center space-y-8">
//               {/* Success Icon */}
//               <div className="flex justify-center">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
//                   <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-4 shadow-lg shadow-green-500/30">
//                     <CheckCircle2 className="text-white" size={48} />
//                   </div>
//                 </div>
//               </div>

//               {/* Thank You Message */}
//               <div className="space-y-4">
//                 <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-6 py-2 shadow-lg shadow-green-500/30">
//                   <Sparkles className="text-white" size={16} />
//                   <span className="font-semibold text-sm">Thank You!</span>
//                 </div>

//                 <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
//                   You're on the waitlist!
//                 </h1>

//                 <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
//                   Thank you for joining the waitlist for <span className="font-bold gradient-text">Kodin</span>
//                 </p>

//                 {email && (
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     We'll notify you at <span className="font-semibold text-green-600 dark:text-emerald-400">{email}</span> when your access is available
//                   </p>
//                 )}
//               </div>

//               {/* Info Section */}
//               <div className="bg-green-50 dark:bg-emerald-950/30 rounded-2xl p-6 space-y-3 border border-green-200 dark:border-emerald-800">
//                 <div className="flex items-start gap-3">
//                   <Heart className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                       What's Next?
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                       Our team will review your application and send you an access code via email. 
//                       We typically respond within 24-48 hours.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <Sparkles className="text-green-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                       Early Access Priority
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                       Share Kodin with your network to get priority access to early features and updates!
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Divider */}
//               <div className="border-t border-gray-200 dark:border-gray-700"></div>

//               {/* Access Token Link */}
//               <Link 
//                 to="/verify-code"
//                 state={{ email }}
//                 className="inline-flex items-center gap-2 text-base font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group"
//               >
//                 <CheckCircle2 className="text-green-500" size={20} />
//                 <span>Do you have an access code? Click here to verify</span>
//                 <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
//               </Link>

//               {/* Back to Home */}
//               <div>
//                 <Link 
//                   to="/"
//                   className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//                 >
//                   ← Back to Home
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Sparkles, ArrowRight, Heart } from 'lucide-react'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function ThankYou() {
  const location = useLocation()
  const email = (location.state as any)?.email || ''

  return (
    <div className="min-h-screen md:h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg z-50 shadow-sm flex-shrink-0">
        <div className="pr-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src={lightLogo} alt="Kodin" className='h-12 w-42 dark:hidden' />
              <img src={darkLogo} alt="Kodin" className='h-12 w-42 hidden dark:block' />
            </div>
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative flex-1 overflow-hidden flex items-center justify-center py-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <div className="hidden dark:block absolute inset-0" style={{
              background: 'radial-gradient(800px circle at 50% 40%, rgba(16,185,129,0.15), transparent 40%)'
            }} />
            <div className="dark:hidden absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.25) 0%, #ffffff 70%)'
            }} />
          </div>
        </div>

        <div className="container-custom relative z-10 w-full">
          <div className="max-w-full mx-auto">
            {/* Thank You Card */}
            <div className="bg-white/90 dark:bg-transparent backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-12 text-center space-y-6 md:space-y-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3 md:p-4 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="text-white" size={48} />
                  </div>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-4 py-1 md:px-6 md:py-2 shadow-lg shadow-green-500/30">
                  <Sparkles className="text-white" size={16} />
                  <span className="font-semibold text-sm">Thank You!</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                  You're on the waitlist!
                </h1>

                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Thank you for joining the waitlist for <span className="font-bold gradient-text">Kodin</span>
                </p>

                {email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We'll notify you at <span className="font-semibold text-green-600 dark:text-emerald-400">{email}</span> when your access is available
                  </p>
                )}
              </div>

              {/* Info Section */}
              <div className="bg-green-50 dark:bg-emerald-950/30 rounded-2xl p-4 md:p-6 space-y-3 border border-green-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <Heart className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      What's Next?
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Our team will review your application and send you an access code via email. 
                      We typically respond within 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="text-green-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Early Access Priority
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Share Kodin with your network to get priority access to early features and updates!
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Access Token Link */}
              <Link 
                to="/verify-code"
                state={{ email }}
                className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group"
              >
                <CheckCircle2 className="text-green-500" size={20} />
                <span>Do you have an access code? Click here to verify</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>

              {/* Back to Home */}
              <div>
                <Link 
                  to="/"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
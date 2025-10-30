// import { useState, useEffect } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { Key, Mail, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'
// import darkLogo from '../assets/logo_dark.png'
// import lightLogo from '../assets/logo_light.png'
// import ThemeSwitcher from '../components/ThemeSwitcher'
// import { waitlistAPI } from '../utils/api'

// export default function VerifyCode() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [email, setEmail] = useState(location.state?.email || sessionStorage.getItem('waitlistEmail') || '')
//   const [accessCode, setAccessCode] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [message, setMessage] = useState<string | null>(location.state?.message || null)

//   useEffect(() => {
//     if (!email) {
//       navigate('/waitlist')
//     }
//   }, [email, navigate])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!email.trim() || !accessCode.trim()) {
//       setError('Please enter both email and access code')
//       return
//     }

//     // Format access code (remove spaces, convert to uppercase)
//     const formattedCode = accessCode.trim().toUpperCase(); // value is always KODIN-XXXX-XXXX now

//     setIsSubmitting(true)
//     setError(null)
//     setMessage(null)

//     try {
//       const response = await waitlistAPI.verifyCode({
//         email: email.trim(),
//         accessCode: formattedCode
//       })

//       if (response.data.success) {
//         // Clear waitlist email from session
//         sessionStorage.removeItem('waitlistEmail')
//         // Redirect to auth page
//         navigate('/auth')
//       }
//     } catch (error: any) {
//       console.error('Code verification error:', error)
//       const errorMessage = error.response?.data?.error || 'Invalid access code. Please try again.'
//       setError(errorMessage)
      
//       // Show status-specific message
//       if (error.response?.data?.status === 'pending_sharing') {
//         setError('Please complete sharing on X and LinkedIn first')
//       } else if (error.response?.data?.status === 'pending_review') {
//         setError('Your application is still under review. We\'ll send you an access code via email once approved.')
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // const handleCodeChange = (value: string) => {
//   //   // Normalize: Remove all non-alphanumerics, uppercase
//   //   let v = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
//   //   // Remove KODIN prefix if present
//   //   if (v.startsWith('KODIN')) v = v.slice(5);
//   //   v = v.slice(0, 8); // 8 chars max after prefix for XXXX-XXXX
//   //   let withDashes = 'KODIN-';
//   //   if (v.length > 4) {
//   //     withDashes += v.slice(0, 4) + '-' + v.slice(4, 8);
//   //   } else {
//   //     withDashes += v;
//   //   }
//   //   setAccessCode(withDashes.slice(0, 14));
//   // }

//   const handleCodeChange = (value: string) => {
//     let v = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
//     if (v.startsWith('KODIN')) v = v.slice(5);
//     v = v.slice(0, 8); // Only 8 chars after prefix
//     // Always build exactly 15 chars: KODIN-XXXX-XXXX
//     let withDashes;
//     if (v.length === 0) withDashes = 'KODIN-';
//     else if (v.length <= 4) withDashes = 'KODIN-' + v;
//     else withDashes = 'KODIN-' + v.slice(0, 4) + '-' + v.slice(4);
//     setAccessCode(withDashes);
//   };

//   return (
//     <div className="h-screen">
//       {/* Navigation */}
//       <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
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
//       <section className="relative pt-20 pb-32 overflow-hidden">
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

//         <div className="container-custom relative z-10">
//           <div className="max-w-2xl mx-auto">
//             {/* Header */}
//             <div className="text-center space-y-4 mb-8">
//               <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 rounded-full px-4 py-1">
//                 <Key className="text-green-600 dark:text-emerald-400" size={16} />
//                 <span className="text-green-700 dark:text-emerald-300 text-sm font-semibold">Verify Access</span>
//               </div>

//               <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
//                 Enter Your
//                 <span className="gradient-text"> Access Code</span>
//               </h1>

//               <p className="text-lg text-gray-600 dark:text-gray-300">
//                 We sent your access code to your email. Check your inbox!
//               </p>
//             </div>

//             {/* Verification Card */}
//             <div className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-gray-100 dark:border-[var(--border-primary)] p-8">
//               {message && (
//                 <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
//                   <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Email
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="your.email@example.com"
//                       required
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100"
//                     />
//                   </div>
//                 </div>

//                 {/* Access Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Access Code
//                   </label>
//                   <div className="relative">
//                     <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="text"
//                       value={accessCode}
//                       onChange={e => handleCodeChange(e.target.value)}
//                       placeholder="KODIN-XXXX-XXXX"
//                       maxLength={15}
//                       required
//                       className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100 font-mono text-lg tracking-widest ${
//                         error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
//                       }`}
//                     />
//                   </div>
//                   <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                     Format: KODIN-XXXX-XXXX (automatically formatted)
//                   </p>
//                 </div>

//                 {error && (
//                   <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
//                     <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
//                     <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                       <span>Verifying...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Verify & Continue</span>
//                       <ArrowRight size={20} />
//                     </>
//                   )}
//                 </button>
//               </form>

//               {/* Help Text */}
//               <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
//                     <span>Check your email for the access code</span>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
//                     <span>Access codes are case-insensitive</span>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
//                     <span>After verification, you'll be redirected to sign in</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Key, Mail, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { waitlistAPI } from '../utils/api'

export default function VerifyCode() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || sessionStorage.getItem('waitlistEmail') || '')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(location.state?.message || null)

  useEffect(() => {
    if (!email) {
      navigate('/waitlist')
    }
  }, [email, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !accessCode.trim()) {
      setError('Please enter both email and access code')
      return
    }

    // Format access code (remove spaces, convert to uppercase)
    const formattedCode = accessCode.trim().toUpperCase(); // value is always KODIN-XXXX-XXXX now

    setIsSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      const response = await waitlistAPI.verifyCode({
        email: email.trim(),
        accessCode: formattedCode
      })

      if (response.data.success) {
        // Clear waitlist email from session
        sessionStorage.removeItem('waitlistEmail')
        // Redirect to auth page
        navigate('/auth')
      }
    } catch (error: any) {
      console.error('Code verification error:', error)
      const errorMessage = error.response?.data?.error || 'Invalid access code. Please try again.'
      setError(errorMessage)
      
      // Show status-specific message
      if (error.response?.data?.status === 'pending_sharing') {
        setError('Please complete sharing on X and LinkedIn first')
      } else if (error.response?.data?.status === 'pending_review') {
        setError('Your application is still under review. We\'ll send you an access code via email once approved.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleCodeChange = (value: string) => {
  //   // Normalize: Remove all non-alphanumerics, uppercase
  //   let v = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  //   // Remove KODIN prefix if present
  //   if (v.startsWith('KODIN')) v = v.slice(5);
  //   v = v.slice(0, 8); // 8 chars max after prefix for XXXX-XXXX
  //   let withDashes = 'KODIN-';
  //   if (v.length > 4) {
  //     withDashes += v.slice(0, 4) + '-' + v.slice(4, 8);
  //   } else {
  //     withDashes += v;
  //   }
  //   setAccessCode(withDashes.slice(0, 14));
  // }

  const handleCodeChange = (value: string) => {
    let v = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (v.startsWith('KODIN')) v = v.slice(5);
    v = v.slice(0, 8); // Only 8 chars after prefix
    // Always build exactly 15 chars: KODIN-XXXX-XXXX
    let withDashes;
    if (v.length === 0) withDashes = 'KODIN-';
    else if (v.length <= 4) withDashes = 'KODIN-' + v;
    else withDashes = 'KODIN-' + v.slice(0, 4) + '-' + v.slice(4);
    setAccessCode(withDashes);
  };

  return (
    <div className="h-screen">
      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-lg sticky top-0 z-50 shadow-sm">
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
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-32 overflow-hidden">
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

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-emerald-900/30 border border-green-200 dark:border-emerald-800 rounded-full px-4 py-1">
                <Key className="text-green-600 dark:text-emerald-400" size={16} />
                <span className="text-green-700 dark:text-emerald-300 text-sm font-semibold">Verify Access</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                Enter Your
                <span className="gradient-text"> Access Code</span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                We sent your access code to your email. Check your inbox!
              </p>
            </div>

            {/* Verification Card */}
            <div className="bg-white dark:bg-transparent rounded-2xl shadow-xl border border-gray-100 dark:border-[var(--border-primary)] p-6 md:p-8">
              {message && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-600 dark:text-blue-400">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Access Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={accessCode}
                      onChange={e => handleCodeChange(e.target.value)}
                      placeholder="KODIN-XXXX-XXXX"
                      maxLength={15}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-[#0b0f1a] text-gray-900 dark:text-gray-100 font-mono text-lg tracking-widest ${
                        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Format: KODIN-XXXX-XXXX (automatically formatted)
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full text-base py-3 md:text-lg md:py-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Check your email for the access code</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>Access codes are case-insensitive</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                    <span>After verification, you'll be redirected to sign in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
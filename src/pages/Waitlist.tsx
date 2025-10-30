// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { Sparkles, Github, ArrowRight, CheckCircle2, Mail, User, MessageSquare, Twitter, Linkedin, Heart } from 'lucide-react'
// import darkLogo from '../assets/logo_dark.png'
// import lightLogo from '../assets/logo_light.png'
// import ThemeSwitcher from '../components/ThemeSwitcher'
// import { waitlistAPI } from '../utils/api'

// export default function Waitlist() {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     githubId: '',
//     githubUsername: '',
//     socialHandle: '',
//     motivation: ''
//   })
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [sharingStatus, setSharingStatus] = useState({
//     sharedOnX: false,
//     sharedOnLinkedIn: false
//   })

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format'
//     }

//     if (!formData.githubId.trim()) {
//       newErrors.githubId = 'GitHub ID is required'
//     } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.githubId)) {
//       newErrors.githubId = 'Invalid GitHub ID format'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const response = await waitlistAPI.submit({
//         name: formData.name.trim() || undefined,
//         email: formData.email.trim(),
//         githubId: formData.githubId.trim(),
//         githubUsername: formData.githubUsername.trim() || undefined,
//         twitterHandle: formData.socialHandle.trim() || undefined,
//         linkedinUrl: formData.socialHandle.trim() || undefined,
//         motivation: formData.motivation.trim() || undefined
//       })

//       if (response.data.success) {
//         // Redirect to thank you page
//         navigate('/thank-you', { state: { email: formData.email.trim() } })
//       }
//     } catch (error: any) {
//       console.error('Waitlist submission error:', error)
//       setErrors({ 
//         submit: error.response?.data?.error || 'Failed to submit. Please try again.' 
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleShare = async (platform: 'x' | 'linkedin') => {
//     const email = formData.email.trim()
//     const shareText = "Excited to join the waitlist for Kodin - AI-powered GitHub issue resolution! 🚀 #AI #GitHub #Coding"
//     const shareUrl = "https://kodin.pro"
    
//     let shareLink = ''
    
//     if (platform === 'x') {
//       shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
//     } else {
//       shareLink = `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
//     }
    
//     // Open in new tab
//     window.open(shareLink, '_blank')
    
//     // Update sharing status
//     const newStatus = { ...sharingStatus, [`sharedOn${platform === 'x' ? 'X' : 'LinkedIn'}`]: true }
//     setSharingStatus(newStatus)
    
//     // Update backend
//     try {
//       await waitlistAPI.updateSharing({
//         email,
//         sharedOnX: newStatus.sharedOnX,
//         sharedOnLinkedIn: newStatus.sharedOnLinkedIn
//       })
//     } catch (error) {
//       console.error('Error updating sharing status:', error)
//     }
//   }

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
//               <Link to="/auth" className="btn btn-primary">
//                 Sign In
//                 <ArrowRight size={18} />
//               </Link>
//               <ThemeSwitcher />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <section className="relative flex-1 overflow-hidden flex items-center">
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

//         <div className="container-custom relative z-10 w-full h-full">
//           <div className="w-full h-full flex flex-col">
//             {/* Header */}
//             <div className="text-center space-y-4 mb-6">
//               <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-6 py-2 shadow-lg shadow-green-500/30">
//                 <Sparkles className="text-white" size={16} />
//                 <span className="font-semibold text-sm">Join the Waitlist</span>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 leading-tight">
//                 Get Early Access to
//                 <span className="gradient-text"> Kodin</span>
//               </h1>

//               <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//                 Be among the first to experience AI-powered GitHub issue resolution
//               </p>
//             </div>

//             {/* Main Content: Left Form (60%) + Right Sharing (40%) */}
//             <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
//               {/* Left Side - Form (60%) */}
//               <div className="col-span-2 flex flex-col overflow-hidden">
//                 <div className="bg-white/90 dark:bg-transparent backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 flex flex-col overflow-hidden">
//                   <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2">
//                     <div className="grid grid-cols-2 gap-3">
//                       {/* Left Column */}
//                       <div className="space-y-3">
//                       {/* Name */}
//                       <div className='pl-2'>
//                         <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
//                           Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
//                         </label>
//                         <div className="relative">
//                           <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                           <input
//                             type="text"
//                             value={formData.name}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             placeholder="Your name"
//                             className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all"
//                           />
//                         </div>
//                       </div>

//                       {/* Email */}
//                       <div className='pl-2'>
//                         <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
//                           Email <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                           <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                           <input
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             placeholder="your.email@example.com"
//                             required
//                             className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all ${
//                               errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
//                             }`}
//                           />
//                         </div>
//                         {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
//                       </div>

//                       {/* GitHub ID */}
//                       <div className='pl-2'>
//                         <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
//                           GitHub ID/Username <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative">
//                           <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                           <input
//                             type="text"
//                             value={formData.githubId}
//                             onChange={(e) => setFormData({ ...formData, githubId: e.target.value })}
//                             placeholder="your-github-username"
//                             required
//                             className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all ${
//                               errors.githubId ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
//                             }`}
//                           />
//                         </div>
//                         {errors.githubId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.githubId}</p>}
//                       </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className="space-y-3">
//                       {/* Social Handle */}
//                       <div className='pl-2'>
//                         <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
//                           X/LinkedIn <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
//                         </label>
//                         <div className="relative">
//                           <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                           <input
//                             type="text"
//                             value={formData.socialHandle}
//                             onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
//                             placeholder="@username or profile URL"
//                             className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all"
//                           />
//                         </div>
//                       </div>

//                       {/* Motivation */}
//                       <div className='pl-2'>
//                         <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
//                           Why do you want to use Kodin? <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
//                         </label>
//                         <div className="relative">
//                           <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
//                           <textarea
//                             value={formData.motivation}
//                             onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
//                             placeholder="Tell us about your use case..."
//                             rows={3}
//                             className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 resize-none transition-all"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     </div>

//                     {errors.submit && (
//                       <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                         <p className="text-xs text-red-600 dark:text-red-400">{errors.submit}</p>
//                       </div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                           <span>Submitting...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>Join Waitlist</span>
//                           <ArrowRight size={20} />
//                         </>
//                       )}
//                     </button>
//                   </form>

//                   {/* Info */}
//                   <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={12} />
//                       <span>We'll review your application and send you an access code via email</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={12} />
//                       <span>Please provide your GitHub ID/Username for better review</span> 
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={12} />
//                       <span>Tell us about your use case for an early access</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={12} />
//                       <span>Sharing on X/LinkedIn is optional, but helps us grow 🚀</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//                       <CheckCircle2 className="text-green-600 dark:text-emerald-400" size={12} />
//                       <span>We'll never store your code</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side - Social Sharing (40%) */}
//               <div className="col-span-1 flex flex-col overflow-hidden">
//                 <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-6 flex flex-col h-full backdrop-blur-sm">
//                   <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-center gap-2">
//                         <Heart className="text-white drop-shadow-lg" size={24} />
//                         <h3 className="text-xl font-bold text-white drop-shadow-lg">
//                           Love Kodin?
//                         </h3>
//                         <Heart className="text-white drop-shadow-lg" size={24} />
//                       </div>
                      
//                       <p className="text-white/95 text-sm leading-relaxed drop-shadow-md">
//                         Help us grow! Every share helps our community get better together 🚀
//                       </p>
//                     </div>

//                     {/* Prominent Social Media Icons */}
//                     <div className="flex flex-col items-center justify-center gap-4">
//                       {/* X/Twitter */}
//                       <button
//                         onClick={() => handleShare('x')}
//                         disabled={sharingStatus.sharedOnX}
//                         className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl transition-all transform hover:scale-105 w-full shadow-2xl ${
//                           sharingStatus.sharedOnX
//                             ? 'bg-white/95 border-4 border-white shadow-green-500/50'
//                             : 'bg-black/90 hover:bg-black border-4 border-white/30 hover:border-white/50'
//                         }`}
//                       >
//                         <Twitter 
//                           size={36} 
//                           className={sharingStatus.sharedOnX ? 'text-green-500' : 'text-white'} 
//                         />
//                         {sharingStatus.sharedOnX && (
//                           <CheckCircle2 className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full border-3 border-white shadow-xl" size={24} />
//                         )}
//                         <span className={`mt-3 text-sm font-bold ${sharingStatus.sharedOnX ? 'text-green-500' : 'text-white'}`}>
//                           Share on X
//                         </span>
//                       </button>

//                       {/* LinkedIn */}
//                       <button
//                         onClick={() => handleShare('linkedin')}
//                         disabled={sharingStatus.sharedOnLinkedIn}
//                         className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl transition-all transform hover:scale-105 w-full shadow-2xl ${
//                           sharingStatus.sharedOnLinkedIn
//                             ? 'bg-white/95 border-4 border-white shadow-green-500/50'
//                             : 'bg-blue-600/90 hover:bg-blue-600 border-4 border-white/30 hover:border-white/50'
//                         }`}
//                       >
//                         <Linkedin 
//                           size={36} 
//                           className={sharingStatus.sharedOnLinkedIn ? 'text-green-500' : 'text-white'} 
//                         />
//                         {sharingStatus.sharedOnLinkedIn && (
//                           <CheckCircle2 className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full border-3 border-white shadow-xl" size={24} />
//                         )}
//                         <span className={`mt-3 text-sm font-bold ${sharingStatus.sharedOnLinkedIn ? 'text-green-500' : 'text-white'}`}>
//                           Share on LinkedIn
//                         </span>
//                       </button>
//                     </div>

//                     <p className="text-white/80 text-xs italic px-2">
//                       "Growing together makes us better"
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Link */}
//             <div className="text-center mt-4 mb-2">
//               <Link 
//                 to="/verify-code" 
//                 className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
//               >
//                 Do you have the access token? <span className='text-green-600 dark:text-green-400 underline'>Click here</span> to verify
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Github, ArrowRight, CheckCircle2, Mail, User, MessageSquare, Twitter, Linkedin, Heart } from 'lucide-react'
import darkLogo from '../assets/logo_dark.png'
import lightLogo from '../assets/logo_light.png'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { waitlistAPI } from '../utils/api'

export default function Waitlist() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubId: '',
    githubUsername: '',
    socialHandle: '',
    motivation: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sharingStatus, setSharingStatus] = useState({
    sharedOnX: false,
    sharedOnLinkedIn: false
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.githubId.trim()) {
      newErrors.githubId = 'GitHub ID is required'
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.githubId)) {
      newErrors.githubId = 'Invalid GitHub ID format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await waitlistAPI.submit({
        name: formData.name.trim() || undefined,
        email: formData.email.trim(),
        githubId: formData.githubId.trim(),
        githubUsername: formData.githubUsername.trim() || undefined,
        twitterHandle: formData.socialHandle.trim() || undefined,
        linkedinUrl: formData.socialHandle.trim() || undefined,
        motivation: formData.motivation.trim() || undefined
      })

      if (response.data.success) {
        // Redirect to thank you page
        navigate('/thank-you', { state: { email: formData.email.trim() } })
      }
    } catch (error: any) {
      console.error('Waitlist submission error:', error)
      setErrors({ 
        submit: error.response?.data?.error || 'Failed to submit. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async (platform: 'x' | 'linkedin') => {
    const email = formData.email.trim()
    const shareText = "Excited to join the waitlist for Kodin - AI-powered GitHub issue resolution! 🚀 #AI #GitHub #Coding"
    const shareUrl = "https://kodin.pro"
    
    let shareLink = ''
    
    if (platform === 'x') {
      shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    } else {
      shareLink = `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    }
    
    // Open in new tab
    window.open(shareLink, '_blank')
    
    // Update sharing status
    const newStatus = { ...sharingStatus, [`sharedOn${platform === 'x' ? 'X' : 'LinkedIn'}`]: true }
    setSharingStatus(newStatus)
    
    // Update backend
    try {
      await waitlistAPI.updateSharing({
        email,
        sharedOnX: newStatus.sharedOnX,
        sharedOnLinkedIn: newStatus.sharedOnLinkedIn
      })
    } catch (error) {
      console.error('Error updating sharing status:', error)
    }
  }

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
              <Link to="/auth" className="btn btn-primary">
                Sign In
                <ArrowRight size={18} />
              </Link>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative flex-1 overflow-hidden flex items-center py-6">
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

        <div className="container-custom relative z-10 w-full h-full">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="text-center space-y-4 mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-6 py-2 shadow-lg shadow-green-500/30">
                <Sparkles className="text-white" size={16} />
                <span className="font-semibold text-sm">Join the Waitlist</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                Get Early Access to
                <span className="gradient-text"> Kodin</span>
              </h1>

              <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Be among the first to experience AI-powered GitHub issue resolution
              </p>
            </div>

            {/* Main Content: Left Form (60%) + Right Sharing (40%) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 overflow-hidden">
              {/* Left Side - Form (60%) */}
              <div className="col-span-1 md:col-span-2 flex flex-col overflow-hidden">
                <div className="bg-white/90 dark:bg-transparent backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-4 md:p-6 flex flex-col overflow-hidden">
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4  pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Left Column */}
                      <div className="space-y-4">
                      {/* Name */}
                      <div className='pl-2'>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className='pl-2'>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            required
                            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all ${
                              errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                      </div>

                      {/* GitHub ID */}
                      <div className='pl-2'>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          GitHub ID/Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={formData.githubId}
                            onChange={(e) => setFormData({ ...formData, githubId: e.target.value })}
                            placeholder="your-github-username"
                            required
                            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all ${
                              errors.githubId ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          />
                        </div>
                        {errors.githubId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.githubId}</p>}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      {/* Social Handle */}
                      <div className='pl-2'>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          X/LinkedIn <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            value={formData.socialHandle}
                            onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                            placeholder="@username or profile URL"
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 transition-all"
                          />
                        </div>
                      </div>

                      {/* Motivation */}
                      <div className='pl-2'>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                          Why do you want to use Kodin? <span className="text-gray-400 font-normal normal-case text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea
                            value={formData.motivation}
                            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                            placeholder="Tell us about your use case..."
                            rows={3}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-[#101520] text-gray-900 dark:text-gray-100 resize-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    </div>

                    {errors.submit && (
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.submit}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      // className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Join Waitlist</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start md:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 md:mt-0" size={12} />
                      <span>We'll review your application and send you an access code via email</span>
                    </div>
                    <div className="flex items-start md:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 md:mt-0" size={12} />
                      <span>Please provide your GitHub ID/Username for better review</span> 
                    </div>
                    <div className="flex items-start md:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 md:mt-0" size={12} />
                      <span>Tell us about your use case for an early access</span>
                    </div>
                    <div className="flex items-start md:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 md:mt-0" size={12} />
                      <span>Sharing on X/LinkedIn is optional, but helps us grow 🚀</span>
                    </div>
                    <div className="flex items-start md:items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 md:mt-0" size={12} />
                      <span>We'll never store your code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Social Sharing (40%) */}
              <div className="col-span-1 flex flex-col overflow-hidden">
                <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col h-full backdrop-blur-sm">
                  <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="text-white drop-shadow-lg" size={24} />
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          Love Kodin?
                        </h3>
                        <Heart className="text-white drop-shadow-lg" size={24} />
                      </div>
                      
                      <p className="text-white/95 text-sm leading-relaxed drop-shadow-md">
                        Help us grow! Every share helps our community get better together 🚀
                      </p>
                    </div>

                    {/* Prominent Social Media Icons */}
                    <div className="flex flex-col items-center justify-center gap-4">
                      {/* X/Twitter */}
                      <button
                        onClick={() => handleShare('x')}
                        disabled={sharingStatus.sharedOnX}
                        className={`group relative flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl transition-all transform hover:scale-105 w-full shadow-2xl ${
                          sharingStatus.sharedOnX
                            ? 'bg-white/95 border-4 border-white shadow-green-500/50'
                            : 'bg-black/90 hover:bg-black border-4 border-white/30 hover:border-white/50'
                        }`}
                      >
                        <Twitter 
                          size={36} 
                          className={sharingStatus.sharedOnX ? 'text-green-500' : 'text-white'} 
                        />
                        {sharingStatus.sharedOnX && (
                          <CheckCircle2 className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full border-3 border-white shadow-xl" size={24} />
                        )}
                        <span className={`mt-3 text-sm font-bold ${sharingStatus.sharedOnX ? 'text-green-500' : 'text-white'}`}>
                          Share on X
                        </span>
                      </button>

                      {/* LinkedIn */}
                      <button
                        onClick={() => handleShare('linkedin')}
                        disabled={sharingStatus.sharedOnLinkedIn}
                        className={`group relative flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl transition-all transform hover:scale-105 w-full shadow-2xl ${
                          sharingStatus.sharedOnLinkedIn
                            ? 'bg-white/95 border-4 border-white shadow-green-500/50'
                            : 'bg-blue-600/90 hover:bg-blue-600 border-4 border-white/30 hover:border-white/50'
                        }`}
                      >
                        <Linkedin 
                          size={36} 
                          className={sharingStatus.sharedOnLinkedIn ? 'text-green-500' : 'text-white'} 
                        />
                        {sharingStatus.sharedOnLinkedIn && (
                          <CheckCircle2 className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full border-3 border-white shadow-xl" size={24} />
                        )}
                        <span className={`mt-3 text-sm font-bold ${sharingStatus.sharedOnLinkedIn ? 'text-green-500' : 'text-white'}`}>
                          Share on LinkedIn
                        </span>
                      </button>
                    </div>

                    <p className="text-white/80 text-xs italic px-2">
                      "Growing together makes us better"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="text-center mt-4 mb-2">
              <Link 
                to="/verify-code" 
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Do you have the access token? <span className='text-green-600 dark:text-green-400 underline'>Click here</span> to verify
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
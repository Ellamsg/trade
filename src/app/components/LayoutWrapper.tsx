// 'use client'
// import { useState, useEffect } from 'react'

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const [showLoader, setShowLoader] = useState(true)
//   const [progress, setProgress] = useState(0)

//   useEffect(() => {
//     // Check if this is the first visit
//     const hasVisited = localStorage.getItem('hasVisited')
    
//     if (hasVisited) {
//       setShowLoader(false)
//       return
//     }

//     // Simulate loading progress
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           localStorage.setItem('hasVisited', 'true')
//           setShowLoader(false) // Hide loader instead of routing
//           return 100
//         }
//         return prev + 1
//       })
//     }, 30) // Adjust speed as needed

//     return () => clearInterval(interval)
//   }, [])

//   if (showLoader) {
//     return (
//       <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
//         <div className="w-full max-w-md px-8">
//           {/* Earth-like loading animation */}
//           <div className="relative mx-auto w-40 h-40 mb-8">
//             <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
//             <div className="absolute inset-4 rounded-full border-4 border-green-500 border-b-transparent animate-spin-reverse"></div>
//             <div className="absolute inset-8 rounded-full border-4 border-purple-500 border-l-transparent animate-spin"></div>
//           </div>
          
//           {/* Progress bar */}
//           <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
//             <div 
//               className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
          
//           {/* Progress text */}
//           <div className="text-center text-white">
//             <p className="text-lg mb-2">Loading your experience...</p>
//             <p className="text-sm text-gray-400">{progress}%</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return <>{children}</>
// }



'use client'
import { useState, useEffect, createContext, useContext } from 'react'

// Create a context to manage loading state across components
const LoadingContext = createContext<{
  setAssetsLoaded: (loaded: boolean) => void
  assetsLoaded: boolean
}>({
  setAssetsLoaded: () => {},
  assetsLoaded: false
})

export const useAssetLoading = () => useContext(LoadingContext)

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)
  const [progress, setProgress] = useState(0)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const visited = localStorage.getItem('hasVisited')
    setHasVisited(!!visited)
    
    if (visited) {
      setShowLoader(false)
      return
    }

    // Start progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        
        // If we reach 100% and assets are loaded, hide loader
        if (newProgress >= 100 && assetsLoaded) {
          clearInterval(interval)
          localStorage.setItem('hasVisited', 'true')
          setTimeout(() => setShowLoader(false), 500) // Small delay for smooth transition
          return 100
        }
        
        // If assets are loaded but progress isn't 100%, speed up
        if (assetsLoaded && newProgress < 100) {
          return Math.min(100, newProgress + 5)
        }
        
        // If progress reaches 100% but assets aren't loaded, slow down
        if (newProgress >= 100 && !assetsLoaded) {
          return 99 // Stay at 99% until assets load
        }
        
        return newProgress
      })
    }, assetsLoaded ? 20 : 50) // Speed up when assets are ready

    return () => clearInterval(interval)
  }, [assetsLoaded])

  // Hide loader immediately if already visited
  if (hasVisited && !showLoader) {
    return (
      <LoadingContext.Provider value={{ setAssetsLoaded, assetsLoaded }}>
        {children}
      </LoadingContext.Provider>
    )
  }

  if (showLoader) {
    return (
      <LoadingContext.Provider value={{ setAssetsLoaded, assetsLoaded }}>
        {/* Render children hidden so they can load */}
        <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
          {children}
        </div>
        
        {/* Loader overlay */}
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
          <div className="w-full max-w-md px-8">
            {/* Earth-like loading animation */}
            <div className="relative mx-auto w-40 h-40 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-green-500 border-b-transparent animate-spin-reverse"></div>
              <div className="absolute inset-8 rounded-full border-4 border-purple-500 border-l-transparent animate-spin"></div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Progress text */}
            <div className="text-center text-white">
              <p className="text-lg mb-2">
                {progress < 50 ? 'Initializing...' : 
                 progress < 90 ? 'Loading 3D assets...' : 
                 assetsLoaded ? 'Ready!' : 'Almost there...'}
              </p>
              <p className="text-sm text-gray-400">{progress}%</p>
            </div>
          </div>
        </div>
      </LoadingContext.Provider>
    )
  }

  return (
    <LoadingContext.Provider value={{ setAssetsLoaded, assetsLoaded }}>
      {children}
    </LoadingContext.Provider>
  )
}
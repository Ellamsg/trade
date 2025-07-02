'use client'
import { useState, useEffect } from 'react'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited')
    
    if (hasVisited) {
      setShowLoader(false)
      return
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          localStorage.setItem('hasVisited', 'true')
          setShowLoader(false) // Hide loader instead of routing
          return 100
        }
        return prev + 1
      })
    }, 30) // Adjust speed as needed

    return () => clearInterval(interval)
  }, [])

  if (showLoader) {
    return (
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Progress text */}
          <div className="text-center text-white">
            <p className="text-lg mb-2">Loading your experience...</p>
            <p className="text-sm text-gray-400">{progress}%</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
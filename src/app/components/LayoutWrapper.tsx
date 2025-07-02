'use client'
import { useState, useEffect } from 'react'
import IntroLoader from './IntroLoader'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited')
    if (hasVisited) {
      setShowLoader(false)
    }
  }, [])

  return (
    <>
      {showLoader && <IntroLoader />}
      {children}
    </>
  )
}
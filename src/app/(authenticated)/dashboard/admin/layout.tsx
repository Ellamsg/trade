// app/admin/layout.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/utils/supabase/clients'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      setAuthChecking(true)
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        // Redirect if not logged in
        if (error || !user) {
          return redirect('/login')
        }
        
        // Get authorized emails from environment variable
        const authorizedEmails = process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS
          ?.split(',')
          .map(email => email.trim()) || []
        
        // Redirect if email not in authorized list
        if (!user.email || !authorizedEmails.includes(user.email)) {
          return redirect('/login')
        }
        
        setUser(user)
      } catch (error) {
        console.error('Auth check failed:', error)
        return redirect('/login')
      } finally {
        setAuthChecking(false)
      }
    }

    checkAuth()
  }, [])

  // Loading overlay
  if (authChecking) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-white">Verifying authorization...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user (should redirect first)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Optional: Add admin navigation/header here */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}
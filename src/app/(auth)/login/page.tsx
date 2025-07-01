'use client'
import Link from 'next/link'
import { signup, login, resendConfirmation } from './action'
import { FcGoogle } from 'react-icons/fc'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const error = searchParams.get('error')
  const email = searchParams.get('email')
  const confirm = searchParams.get('confirm')

  useEffect(() => {
    if (error === 'email_not_confirmed') {
      setShowModal(true)
    }
  }, [error])

  const handleResendConfirmation = async () => {
    if (!email) return
    
    setIsResending(true)
    try {
      await resendConfirmation(email)
    } catch (error) {
      console.error('Failed to resend confirmation:', error)
    } finally {
      setIsResending(false)
    }
  }

  const handleLogin = async (formData: any) => {
    setIsSigningIn(true)
    try {
      await login(formData)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    window.history.replaceState({}, '', '/login')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>

        {confirm === 'email_sent' && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-400 text-sm">
              Check your email for a confirmation link to complete your registration.
            </p>
          </div>
        )}

        {confirm === 'email_resent' && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-400 text-sm">
              Confirmation email has been resent. Please check your inbox.
            </p>
          </div>
        )}

        {error && error !== 'email_not_confirmed' && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">
              {error === 'Invalid login credentials' 
                ? 'Invalid email or password. Please try again.'
                : decodeURIComponent(error)
              }
            </p>
          </div>
        )}

        {/* <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg font-medium transition duration-200 mb-6"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button> */}

        {/* <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div> */}

        <form action={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isSigningIn}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              {/* <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400">
                Forgot?
              </Link> */}
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isSigningIn}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
            
            </label>
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3 cursor-pointer px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-900 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSigningIn ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
            Create one
          </Link>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Confirm Your Email</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-900/20 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <p className="text-gray-300 text-center mb-4">
                Please confirm your email address before signing in. Check your inbox for a confirmation link.
              </p>
              
              {email && (
                <p className="text-sm text-gray-400 text-center">
                  We sent the confirmation email to: <span className="text-white">{email}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {email && (
                <button
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
                >
                  {isResending ? 'Sending...' : 'Resend Confirmation Email'}
                </button>
              )}
              
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
              >
                I'll Check My Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
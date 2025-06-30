import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { signup ,login} from '../login/action'

export default function SigningUp() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Get started with your account</p>
        </div>

        {/* Google Sign-Up Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg font-medium transition duration-200 mb-6"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Full Name"
              />
            </div>
            {/* <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Doe"
              />
            </div> */}
          </div>

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
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum 8 characters with at least one number
            </p>
          </div>

          {/* <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div> */}

          <div className="flex items-start">
            {/* <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
              />
            </div> */}
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-500 hover:text-blue-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-500 hover:text-blue-400">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            formAction={signup}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-900 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
            Sign in
          </Link>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
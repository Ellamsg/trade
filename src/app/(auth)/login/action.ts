

'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/servers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Check if the error is due to email not being confirmed
    if (error.message === 'Email not confirmed') {
      redirect(`/login?error=email_not_confirmed&email=${encodeURIComponent(data.email)}`)
    }
    
    // Handle other authentication errors
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Additional check: verify email is confirmed
  if (signInData.user && !signInData.user.email_confirmed_at) {
    redirect(`/login?error=email_not_confirmed&email=${encodeURIComponent(data.email)}`)
  }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
     
  const signUpData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string, // Store in user_metadata
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` // 👈 Critical fix
    }
  }
     
  const { data, error } = await supabase.auth.signUp(signUpData)
     
  if (error) {
    // Better error handling - redirect with error message
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }
     
  // Optional: Store additional user data in public profiles table
  if (data.user) {
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email, 
        full_name :signUpData.options.data.full_name,                  
        created_at: new Date().toISOString()
      })
  }
     
  revalidatePath('/', 'layout')
  redirect('/login?confirm=email_sent') // Show success message
}

export async function signOut() {
  const supabase = await createClient()
     
  const { error } = await supabase.auth.signOut()
     
  if (error) {
    redirect('/error')
  }
     
  revalidatePath('/', 'layout')
  redirect('/login')
}

// New function to resend confirmation email
export async function resendConfirmation(email: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    }
  })
  
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }
  
  redirect('/login?confirm=email_resent')
}
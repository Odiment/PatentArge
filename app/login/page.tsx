'use client'

import { useState } from 'react'
import { Link, Button } from '@nextui-org/react'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firma_ad, setFirma_ad] = useState('')
  const [view, setView] = useState('sign-in')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    setView('check-email')
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.push('/')
    router.refresh()
  }

  return (
    <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex flex-col w-full px-10 sm:max-w-md justify-center gap-2">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        {view === 'check-email' ? (
          <p className="text-center text-foreground">
            Check <span className="font-bold">{email}</span> to continue signing
            up
          </p>
        ) : (
          <form
            className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="you@example.com"
            />
            {view === 'sign-in' && (
              <>
                <label className="text-md" htmlFor="password">
                  Şifre
                </label>
                <input
                  className="rounded-md px-4 py-2 bg-inherit border mb-6"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                />
                <button className="bg-primary/70 rounded px-4 py-2 text-white font-bold hover:bg-primary mb-6">
                  Giriş
                </button>
                <p className="text-sm text-center">
                  Kaydınız yoksa, lütfen
                  <button
                    className="ml-1  hover:text-primary text-bold"
                    onClick={() => setView('sign-up')}
                  >
                    kayıt talebi oluşturunuz!
                  </button>
                </p>
               
              </>
            )}
            {view === 'sign-up' && (
              <>
                <label className="text-md" htmlFor="password">
                  Firma Adı
                </label>
                <input
                  className="rounded-md px-4 py-2 bg-inherit border mb-6"
                  type="text"
                  name="firma_ad"
                  onChange={(e) => setPassword(e.target.value)}
                  value={firma_ad}
                  placeholder="Firmanızın kısa adını giriniz"
                />

                <button className="bg-primary/70 rounded px-4 py-2 text-white font-bold hover:bg-primary mb-6">
                  Kayıt Talebi Gönder
                </button>
                <p className="text-sm text-center">
                  Zaten bir kaydınız varsa lütfen
                  <button
                    className="ml-1 underline"
                    onClick={() => setView('sign-in')}
                  >
                    Giriş Yapınız
                  </button>
                </p>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  )
}

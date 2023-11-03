'use client'

import { Toaster } from '@/components/ui/toaster'

interface RootLayoutProps {
    children: React.ReactNode
  }

export default function TasarimCardYazLayout({ children }: RootLayoutProps) {
  return (
    <section>
      <div className="container py-4 rounded">
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

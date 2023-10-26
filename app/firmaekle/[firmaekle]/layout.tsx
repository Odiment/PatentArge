'use client'

import { Toaster } from '@/components/ui/toaster'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function IdeaLayout({ children }: RootLayoutProps) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

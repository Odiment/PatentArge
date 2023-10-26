'use client'

import { Toaster } from '@/components/ui/toaster'

export default function IdeaLayout({ children }) {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

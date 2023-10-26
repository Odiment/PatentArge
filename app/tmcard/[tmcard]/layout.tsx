'use client'

import { Toaster } from '@/components/ui/toaster'

export default function MarkaCardYazLayout({ children }) {
  return (
    <section>
      <div className="container py-4 rounded">
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

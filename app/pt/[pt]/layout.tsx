'use client'

import { Toaster } from '@/components/ui/toaster'

export default function IdeaLayout({ children }) {
  return (
    <section className="py-4 ml-[5px] md:ml-[50px] lg:ml-[110px] mr-[10px]">
      <div className="container py-4">
        {/* <h1 className="text-lg text-italic font-serif">Marka Giriş Ekranı</h1> */}
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

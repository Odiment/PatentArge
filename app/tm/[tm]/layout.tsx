'use client'

import { Toaster } from '@/components/ui/toaster'
interface RootLayoutProps {
    children: React.ReactNode
  }  

export default function IdeaLayout({ children }: RootLayoutProps) {
  return (
    <section className="ml-[5px] md:ml-[50px] lg:ml-[110px] mr-[10px]">
      <div className="container">
        <div className="mt-6">{children}</div>
        <Toaster />
      </div>
    </section>
  )
}

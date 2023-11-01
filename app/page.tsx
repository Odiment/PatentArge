/* import ThemeSwitcher from "@/components/ThemeSwitcher"; */
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { Button } from '@nextui-org/react'
import { LandingHero } from '@/components/landing-hero'
import { LandingContent } from '@/components/landing-content'
import { LandingFooter } from '@/components/landing-footer'

export default async function IndexPage() {
  return (
    <section className="">
      {/* <ThemeSwitcher /> */}
      <LandingHero />
      <LandingContent />
      <LandingFooter />
    </section>
  )
}

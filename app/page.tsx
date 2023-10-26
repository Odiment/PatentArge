
/* import ThemeSwitcher from "@/components/ThemeSwitcher"; */
import { Button } from '@nextui-org/react'
import { LandingHero } from "@/components/landing-hero"
import { LandingContent } from "@/components/landing-content"
import { LandingFooter } from "@/components/landing-footer"


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

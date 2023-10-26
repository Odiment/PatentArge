import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

//components
import ProjectsBtn from '@/components/ProjectsBtn'
import ParticlesContainer from '@/components/ParticlesContainer'
//framer motion
import { motion } from 'framer-motion'
//import variants
import { fadeIn } from '@/variants'

export default async function IndexPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    /* redirect("/unauthenticated") */
    redirect('/')
  }

  return (
    <div className="h-full">
      <div className="w-full h-full bg-gradiant-to-r from-primary/10 via-black/30 to-black/10">
        <div className="text-center flex  md:pl-28 flex-col justify-center pt-40 md:pt-20 xl:pt-40 xl:text-left h-full container mx-auto">
          {/*   title */}
          <h1 className="text-[35px] leading-tight md:text-[60px] md:leading-[1.3] mb-8 font-semibold">
            PatentArge ile
            <br />
            <span className="text-primary">Tüm Süreçlerinizi Yönetin...</span>
          </h1>
          {/*   subtitle */}
          <p className="leading-[1.8] font-light max-w-sm xl:max-w-xl mx-auto xl:mx-0 mb-10 xl:mb-16">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book.
          </p>
          {/*    btn */}
          <div className="flex justify-center xl:hidden relative">
            <ProjectsBtn />
          </div>
        </div>
        {/*image */}

        <div className="w-[1200px] h-full absolute right-0 bottom-0">
          {/*bg img */}
          <div className="bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat w-full h-full absolute mix-blend-difference translate-z-0 opa"></div>
          {/*particles */}
          <ParticlesContainer />
        </div>
      </div>
    </div>
  )
}

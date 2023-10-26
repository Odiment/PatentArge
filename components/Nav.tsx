'use client'
import { Session } from '@supabase/auth-helpers-nextjs'
// icons
import { HiHome } from 'react-icons/hi'
import {
  HiUser,
  HiRectangleGroup,
  HiViewColumns,
  HiChatBubbleBottomCenterText,
} from 'react-icons/hi2'

import { IconType } from 'react-icons'
import { usePathname } from 'next/navigation'

interface navData {
  icon: IconType
  text: string
  path: string
}
// nav data
export const navData: Array<navData> = [
  {
    id: 0,
    text: 'home',
    path: '/loggedin',
    icon: HiHome,
  },
  {
    id: 1,
    text: 'about',
    path: '/loggedin/about',
    icon: HiUser,
  },
  {
    id: 2,
    text: 'services',
    path: '/loggedin/services',
    icon: HiRectangleGroup,
  },
  {
    id: 3,
    text: 'work',
    path: '/loggedin/work',
    icon: HiViewColumns,
  },
  {
    id: 4,
    text: 'testimonials',
    path: '/loggedin/testimonials',
    icon: HiChatBubbleBottomCenterText,
  },
  {
    id: 5,
    text: 'contact',
    path: '/loggedin/contact',
    icon: HiChatBubbleBottomCenterText,
  },
]

//next link
import Link from 'next/link'

const Nav = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()

  return (
    <>
      {session && pathname.includes('/loggedin') && (
        <nav
          className="flex flex-col items-center xl:justify-center gap-y-4 fixed h-max bottom-0 mt-auto xl:right-[2%] 
    z-50 top-0 w-full xl:w-16 xl:max-w-md xl:h-screen"
        >
          {/*    inner */}
          <div
            className="flex w-full xl:flex-col items-center justify-between 
 xl:justify-center gap-y-10 px-4 md:px-40 xl:px-0 h-[80px] xl:h-max py-8 bg-white/10
   backdrop-blur-sm text-3xl xl:text-xl xl:rounded-full"
          >
            {navData.map((link, index) => {
              /*               console.log("link.path")
              console.log(link.path)
              console.log("pathname")
              console.log(pathname) */
              return (
                <Link
                  className={`${
                    link.path === pathname && 'text-primary'
                  } relative flex items-center group hover:text-primary transition-all duration-300`}
                  href={link.path}
                  key={index}
                >
                  {/*  tooltip */}
                  <div className="absolute pr-14 right-0 hidden xl:group-hover:flex">
                    <div className="bg-white relative flex text-primary items-center p-[6px] rounded-[3px]">
                      <div className="text-[12px] leading-none font-semibold capitalize">
                        {link.text}
                      </div>
                      {/*  triangle */}
                      <div className="border-solid border-l-white border-l-8  border-y-transparent border-y-[6px] border-r-0 absolute -right-2"></div>
                    </div>
                  </div>

                  {/*  icons */}
                  <link.icon />
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}

export default Nav

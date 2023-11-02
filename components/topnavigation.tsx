import { IoFingerPrintSharp } from 'react-icons/io5'
import { HiOutlineMenu } from 'react-icons/hi'
import { BsBell } from 'react-icons/bs'
import { Session } from '@supabase/auth-helpers-nextjs'

import LoginHeader from './login-header'
import ThemeSwitcher from './theme-switcher'
import { SearchInput } from '@/components/search-input'
import { MobileSidebar } from './mobile-sidebar'
import Image from "next/image";

const TopNavigation = ({ session }: { session: Session | null }) => {
  return (
    <div className="flex justify-between items-center p-4 gap-6 sticky top-0 z-40 bg-background">
      <div className="flex items-center gap-6">
        <div>
          <MobileSidebar session={session} />
        </div>
        <div className="flex items-center gap-1">
        <Image
          src={"/logo.png"}
          width={50}
          height={50}
          alt=""
          className=''/>
       {/*    <IoFingerPrintSharp size={30} className="text-emerald-500" /> */}
          <span className="text-xl font-semibold ">PatentArge</span>
        </div>
      </div>

      <div className="">
        <SearchInput />
      </div>

      <div className="flex item-center gap-3">
        <div className="flex items-center bg-transparent p-3 rounded-full hover:bg-primary/40 cursor-pointer">
          <ThemeSwitcher />
        </div>
        <div className="flex items-center p-6 rounded-full hover:bg-primary/40 cursor-pointer">
          <BsBell />
        </div>

        <div className="flex items-center">
          <LoginHeader />
        </div>
      </div>
    </div>
  )
}

export default TopNavigation

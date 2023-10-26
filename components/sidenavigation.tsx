'use client'
import { Session } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter } from 'next/navigation'
import { IconType } from 'react-icons'
import { HiHome } from 'react-icons/hi'
import { LuGalleryHorizontal } from 'react-icons/lu'
import { AiOutlinePlusSquare, AiOutlinePlusCircle } from 'react-icons/ai'
import { BsShieldCheck } from 'react-icons/bs'
import { PiShieldCheckeredBold } from 'react-icons/pi'
import { LuGalleryVertical } from 'react-icons/lu'
import { FiSettings } from 'react-icons/fi'
import { Poppins, Sora } from "next/font/google";{/* eb ekledi */}
import { cn } from "@/lib/utils";{/* eb ekledi */}

const font = Sora({ weight: '200', subsets: ['latin'] }); //eb ekledi

interface MenuItem {
  icon: IconType
  text: string
  pathname: string
}

const MenuItems: Array<MenuItem> = [
  {
    id: 0,
    icon: HiHome,
    text: 'Anasayfa',
    pathname: '/',
  },
  {
    id:1,
    icon: LuGalleryHorizontal,
    text: 'Markalar',
    pathname: '/marka/list',
  },
  {
    id:2,
    icon: AiOutlinePlusSquare,
    text: 'Marka Ekle',
    pathname: '/tm/new',
  },
  {
    id:3,
    icon: AiOutlinePlusCircle,
    text: 'Firma Ekle',
    pathname: '/firmaekle/new',
  },
  {
    id:4,
    icon: BsShieldCheck,
    text: 'Patentler',
    pathname: '/patent/new',
  },

  {
    id:5,
    icon: PiShieldCheckeredBold,
    text: 'Patent Ekle',
    pathname: '/pt/new',
  },
  {
    id: 6,
    icon: LuGalleryVertical,
    text: 'Patent Slider',
    pathname: '/patentslider/new',
  },

  {
    id: 7,
    icon: FiSettings,
    text: 'Ayarlar',
    pathname: '/settings',
  },
]
const SideNavigation = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleItemClick = (item: MenuItem) => {
    router.push(item.pathname)
  }

  return (
    <div className="text-xs mt-20 p-[2px] lg:px-3 lg:w-[200px] pt-5">
      {session ? (
        <div className={(cn("space-y-2"), font.className)}>{/* eb ekledi */}
          {MenuItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col lg:flex-row gap-1 lg:gap-6 p-4 px:3 lg:py-3 items-center 
    hover:text-primary hover:bg-primary/10 rounded-lg text-xs${
      item.pathname === pathname && 'bg-primary hover:primary/30'
    } rounded-lg cursor-pointer`}
              onClick={() => handleItemClick(item)}
            >
              <item.icon size={30} className="h-5 w-5" />
              <span className="lg:text-sm sm:text-center ">{/* eb ekledi */}
                {item.text}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // Session olmayan (login girişi yapmayanlara) gösterilecek menüler
        <div
          className=" lg: hidden  
         gap-1 lg:gap-6 p-4 px:3 lg:py-3 items-center hover:text-primary hover:bg-primary/10 rounded-lg bg-primary/30 hover:primary/30 cursor-pointer"
          onClick={() => handleItemClick(MenuItems[0].pathname)}
          key={MenuItems[0].pathname}
        >
          <HiHome size={30} className="h-5 w-5" />
          <span className="text-xs lg:text-lg sm:text-center ">
            {MenuItems[0].text}
          </span>
        </div>
      )}
    </div>
  )
}
export default SideNavigation

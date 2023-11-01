'use client'

import { Menu } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
/* import { Sidebar } from '@/components/sidebar' */
import { Session } from '@supabase/auth-helpers-nextjs'
/* import SideNavigation from './sidenavigation' */
import { HiHome } from 'react-icons/hi'
import { usePathname, useRouter } from 'next/navigation'
import { IconType } from 'react-icons'
import { LuGalleryHorizontal } from 'react-icons/lu'
import { AiOutlinePlusSquare, AiOutlinePlusCircle } from 'react-icons/ai'
import { BsShieldCheck } from 'react-icons/bs'
import { PiShieldCheckeredBold } from 'react-icons/pi'
import { LuGalleryVertical } from 'react-icons/lu'
import { FiSettings } from 'react-icons/fi'
interface MenuItem {
    id: number
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
    id: 1,
    icon: LuGalleryHorizontal,
    text: 'Markalar',
    pathname: '/marka/list',
  },
  {
    id: 2,
    icon: AiOutlinePlusSquare,
    text: 'Marka Ekle',
    pathname: '/tm/new',
  },
  {
    id: 3,
    icon: AiOutlinePlusCircle,
    text: 'Firma Ekle',
    pathname: '/firmaekle/new',
  },
  {
    id: 4,
    icon: BsShieldCheck,
    text: 'Patentler',
    pathname: '/patent/new',
  },

  {
    id: 5,
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

export const MobileSidebar = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleItemClick = (item: MenuItem) => {
    router.push(item.pathname)
  }
  return (
    <Sheet>
      {session ? (
        <SheetTrigger className="md:hidden pr-4">
          <Menu className="text-muted-foreground hover:text-[#3ecf8e]" />
        </SheetTrigger>
      ) : (
        <SheetTrigger className="hidden pr-4">
          <Menu className="text-muted-foreground hover:text-[#3ecf8e]" />
        </SheetTrigger>
      )}
      <SheetContent side="left" className="md:hidden pt-20 w-32">
        <div className="space-y-2">
          {MenuItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col lg:flex-row gap-1 lg:gap-6 p-4 px:3 lg:py-3 items-center 
    hover:text-primary hover:bg-primary/10 rounded-lg ${
      item.pathname === pathname && 'bg-primary/30 hover:primary/30'
    } rounded-lg cursor-pointer`}
              onClick={() => handleItemClick(item)}
            >
              <item.icon size={30} className="h-5 w-5" />
              <span className="text-xs text-center">{item.text}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client";

import { Menu } from "lucide-react";
import SideNavigation from "@/components/sidenavigation";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
/* import { Sidebar } from '@/components/sidebar' */
import { Session } from "@supabase/auth-helpers-nextjs";
/* import SideNavigation from './sidenavigation' */
import { HiHome } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { LuGalleryHorizontal } from "react-icons/lu";
import { AiOutlinePlusSquare, AiOutlinePlusCircle } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { PiShieldCheckeredBold } from "react-icons/pi";
import { LuGalleryVertical } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";

interface MenuItem {
  id: number;
  icon: IconType;
  text: string;
  pathname: string;
}

const MenuItems: Array<MenuItem> = [
  {
    id: 0,
    icon: HiHome,
    text: "Anasayfa",
    pathname: "/",
  },
  {
    id: 1,
    icon: LuGalleryHorizontal,
    text: "Markalar",
    pathname: "/marka/list",
  },
  {
    id: 2,
    icon: AiOutlinePlusSquare,
    text: "Marka Ekle",
    pathname: "/tm/new",
  },
  {
    id: 3,
    icon: AiOutlinePlusCircle,
    text: "Firma Ekle",
    pathname: "/firmaekle/new",
  },
  {
    id: 4,
    icon: BsShieldCheck,
    text: "Patentler",
    pathname: "/patent/new",
  },

  {
    id: 5,
    icon: PiShieldCheckeredBold,
    text: "Patent Ekle",
    pathname: "/pt/new",
  },
  {
    id: 6,
    icon: LuGalleryVertical,
    text: "Patent Slider",
    pathname: "/patentslider/new",
  },

  {
    id: 7,
    icon: FiSettings,
    text: "Ayarlar",
    pathname: "/settings",
  },
];

export const MobileSidebar = ({
  session,
  userid,
}: {
  session: Session | null;
  userid: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    router.push(item.pathname);
  };
  return (
    <Sheet>
      {session ? (
        <SheetTrigger className="lg:hidden pr-4">
          <Menu className="text-muted-foreground hover:text-[#3ecf8e]" />
        </SheetTrigger>
      ) : (
        <SheetTrigger className="hidden pr-4">
          <Menu className="text-muted-foreground hover:text-[#3ecf8e]" />
        </SheetTrigger>
      )}

      <SheetContent side="left" className="w-32 overflow-y-auto">
        <SideNavigation session={session} userid={userid} />
      </SheetContent>
    </Sheet>
  );
};

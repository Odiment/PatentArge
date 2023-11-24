"use client";
import { useCallback, useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { HiHome } from "react-icons/hi";
import { LuGalleryHorizontal } from "react-icons/lu";
import { AiOutlinePlusSquare, AiOutlinePlusCircle } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { PiShieldCheckeredBold } from "react-icons/pi";
import { SiSnapcraft } from "react-icons/si";
import { LuGalleryVertical } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { PiTrademarkBold } from "react-icons/pi";
import { Poppins, Sora } from "next/font/google";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/app/supabase";

/* type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"]; */

const font = Sora({ weight: "200", subsets: ["latin"] });

interface MenuItem {
  id: number;
  icon: IconType;
  text: string;
  pathname: string;
  ytk: string;
}

const MenuItems: Array<MenuItem> = [
  {
    id: 0,
    icon: HiHome,
    text: "Anasayfa",
    pathname: "/",
    ytk: "admin, client",
  },
  {
    id: 1,
    icon: PiTrademarkBold,
    text: "Markalar",
    pathname: "/marka/list",
    ytk: "admin, client",
  },
  {
    id: 2,
    icon: BsShieldCheck,
    text: "Patentler",
    pathname: "/patent/new",
    ytk: "admin, client",
  },
  {
    id: 3,
    icon: LuGalleryVertical,
    text: "Patent/Ürün",
    pathname: "/patentslider/new",
    ytk: "admin, client",
  },
  {
    id: 4,
    icon: SiSnapcraft,
    text: "Tasarimlar",
    pathname: "/tasarim/list",
    ytk: "admin, client",
  },
  {
    id: 5,
    icon: PiTrademarkBold,
    text: "Marka Ekle",
    pathname: "/tm/new",
    ytk: "admin",
  },
  {
    id: 6,
    icon: PiShieldCheckeredBold,
    text: "Patent Ekle",
    pathname: "/pt/new",
    ytk: "admin",
  },
  {
    id: 7,
    icon: SiSnapcraft,
    text: "Tasarım Ekle",
    pathname: "/tsrm/new",
    ytk: "admin",
  },
  {
    id: 8,
    icon: AiOutlinePlusCircle,
    text: "Firma Ekle",
    pathname: "/firmaekle/new",
    ytk: "admin",
  },
  {
    id: 9,
    icon: FiSettings,
    text: "Ayarlar",
    pathname: "/settings",
    ytk: "admin",
  },
];

const SideNavigation = ({
  session,
  userid,
}: {
  session: Session | null;
  userid: string;
}) => {
  const supabase = createClientComponentClient<Database>();
  const [yetki, setYetki] = useState<string>("genel");
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (item: MenuItem) => {
    router.push(item.pathname);
  };

  const getProfile = useCallback(async () => {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq("id", userid)
        .single();

/*       if (error && status !== 406) {
        throw error;
      } */

      if (data) {
        setYetki(data?.yetki!);
      }
    } catch (error) {
     /*  alert(error); */
     console.log(`profil çekme hatası ${error}`)
    } finally {
    }
  }, [userid, supabase]);


 
  useEffect(() => {
    getProfile();
  }, [userid, getProfile]);



  return (
    <div key={1} className="text-xs p-[2px] lg:w-[200px] pt-5 overflow-y-auto">
      {session ? (
        <div key={2} className={(cn("space-y-2"), font.className)}>
          {MenuItems.map((item, index) => (
            <div key={index}>
              {item.ytk.includes(yetki) && (
                <div
                  key={item.id}
                  className={`flex flex-col lg:flex-row gap-1 lg:gap-6 p-4 px:3 lg:py-3 items-center 
    hover:text-primary hover:bg-primary/10 rounded-lg text-xs${
      item.pathname === pathname && "bg-primary hover:primary/30"
    } rounded-lg cursor-pointer`}
                  onClick={() => handleItemClick(item)}>
                  <item.icon size={30} className="h-5 w-5" />
                  <span className="lg:text-sm sm:text-center ">
                    {item.text}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Session olmayan (login girişi yapmayanlara) gösterilecek menüler
        <div
          className="lg:hidden  
         gap-1 lg:gap-6 p-4 px:3 lg:py-3 items-center hover:text-primary hover:bg-primary/10 rounded-lg bg-primary/30 hover:primary/30 cursor-pointer"
          onClick={() => handleItemClick(MenuItems[0])}
          key={MenuItems[0].id}>
          <HiHome size={30} className="h-5 w-5" />
          <span className="text-xs lg:text-lg sm:text-center ">
            {MenuItems[0].text}
          </span>
        </div>
      )}
    </div>
  );
};
export default SideNavigation;

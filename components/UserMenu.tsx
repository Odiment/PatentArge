"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

import { Database } from "@/app/database.types";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  SunMoon,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import { useTheme } from "next-themes";
import { User as NextuiUser } from "@nextui-org/react";

export function UserMenu({ user }: any) {
  const supabase = createClientComponentClient();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [yetki, setYetki] = useState<string | null>(null);
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scrooll", isActive);
    };
  }, []);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq("id", user?.id!)
        .single();

/*       if (error && status !== 406) {
        throw error;
      } */

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setYetki(data.yetki);
        setPozisyon(data.pozisyon);
      }
    } catch (error) {
      /* alert(`getProfile hatası - UserMenu ${error}`); */
      console.log(`profil çekme hatası ${error}`)
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);



  useEffect(() => {
    getProfile();
  }, [user, getProfile]);


  let url = avatar_url;

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const iconSize = 30;

  const signOut = async () => {
    await supabase.auth.signOut();

    router.refresh();
  };

  const onNavigate = (url: string) => {
    return router.push(url);
  };

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start" className="bg-primary">
        <DropdownTrigger>
          <NextuiUser
            name={fullname}
            description={pozisyon}
            as="button"
            avatarProps={{
              isBordered: true,
              src: avatar_url!,
            }}
            className="transition-transform "
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-light text-background">Giriş yapıldı</p>
            <p className="font-bold">{fullname}</p>
            <p className="font-bold">{pozisyon}</p>
          </DropdownItem>
          <DropdownItem key="settings" className="text-background">
            Profilim
          </DropdownItem>
          {/* <DropdownItem key="team_settings" className='text-background'>Team Settings</DropdownItem>
          <DropdownItem key="analytics" className='text-background'>Analytics</DropdownItem>
          <DropdownItem key="system" className='text-background'>System</DropdownItem>
          <DropdownItem key="configurations" className='text-background'>Configurations</DropdownItem> */}
          <DropdownItem key="help_and_feedback" className="text-background">
            Yardım & Geri Bildirim
          </DropdownItem>
          <DropdownItem
            className="text-background"
            key="logout"
            onClick={() => {
              onNavigate("/");
              signOut();
            }}>
            Çıkış
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

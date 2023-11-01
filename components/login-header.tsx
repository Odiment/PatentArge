export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import MarkaGorunum from "./MarkaGorunum";
import PatentGorunum from "./PatentGorunum";

import { getUser } from "@/app/auth/getUser/getUser"

/* import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button" */

/* import LogoutButton from './LogoutButton' */
import { UserMenu } from "./UserMenu";

/* export const getUser = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const {
        data: { user },
      } = await supabase.auth.getUser();

      return user
} */

export default async function LoginHeader() {
  /* const supabase = createServerComponentClient({ cookies }); */
 /*   const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); 

  const {
    data: { user },
  } = await supabase.auth.getUser(); */

/* const user = await getUser() */

const user = await getUser()

  return (
    <nav className="flex justify-center border-0 border-b-foreground/10 h-16">
      <div className="max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              {/*               Hey!, {user.email} */}
              {/*  <LogoutButton full_name={full_name} /> */}
              {/* <LogoutButton user={user} /> */}
              <MarkaGorunum />
              <PatentGorunum />
              <UserMenu user={user} />
            </div>
          ) : (
            <Link
              href="/login"
              rel="noreferrer"
              className="link hover:text-primary hover:bg-primary/10 rounded-lg transition p-3"
              /*                 className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
               */
            >
              Giriş
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

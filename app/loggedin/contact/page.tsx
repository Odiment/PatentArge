import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import TopLeft from "@/public/top-left-img.png";
/* import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { SearchInput } from "@/components/search-input"

import LogoutButton from "../components/LogoutButton"
import AuthForm from "./auth-form" */

//components
import TopLeftImg from "@/components/topleftimg"; //eb ekledi.

export default async function Contact() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    /* redirect("/unauthenticated") */
    redirect("/");
  }

  return (
    <div>
      <p>Contact</p>
    </div>
  );
}

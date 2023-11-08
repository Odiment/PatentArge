export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cache } from "react";

import { Database } from "@/app/supabase";

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

export const getYetki = async () => {
  const supabase = createServerSupabaseClient();

  type Profil =
  | { id: string | null; firma_ad: string | null; yetki: string | null }[]
  | null;

let profil: Profil | undefined;

type Firma = { firma_id: string }[] | null;
let firma: Firma | undefined;
let yetki: any | null;
let tumMarkaSiniflar: any | null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user) return null;

    const { data: profil } = await supabase
    .from("profiles")
    .select(`yetki`)
    .eq("id", user.id);

    /* let yetki = profil?.map(({ yetki }: any) => yetki); */

    const useremail: string = user.email || "";

    const { data: firma_id } = await supabase
    .from("firma_profil")
    .select("firma_id")
    .eq("user_email", useremail);

    if (!profil) return null;

    return profil[0].yetki;

  } catch (error) {
    console.error("Error", error);
    return null;
  }
};
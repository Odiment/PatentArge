import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/* import { Database } from "../database.types" */
import AccountForm from "./account-form";

import { cache } from "react";

import { Database } from "@/app/supabase";

import { redirect } from "next/navigation";

export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});

export const getSession = async () => {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user) return null;

    return session;
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};

/* export const getUser = async () => {
    const supabase = createServerSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!user) return null;
  
      return user;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  }; */
  

export default async function Account() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */

 /*  const {
    data: { session },
  } = await supabase.auth.getSession(); */

  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <AccountForm session={session} />
    </>
  );
}

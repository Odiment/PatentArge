export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import MarkaDetayCard from "./marka-detay-card";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaDetay {
  params: {
    markadetay: string;
  };
}

const MarkaDetay = async ({ params }: MarkaDetay) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: secilenMarka } = await supabase
    .from("markalar")
    .select()
    .eq("referans_no", `${params.markadetay}`);

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      {secilenMarka != null && (
        <div key={secilenMarka[0].id}>
          <MarkaDetayCard bilgiler={secilenMarka} />
        </div>
      )}
    </div>
  );
};

export default MarkaDetay;

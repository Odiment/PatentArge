export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import TasarimList from "./components/tasarim-list";
import Filter from "@/components/filter";

import { getSession } from "@/app/auth/getSession/getSession";
import { getUser } from "@/app/auth/getUser/getUser";

import { cache } from "react";
import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
    firma: string | null;
  };
}

export default async function TasarimKart({ searchParams }: TasarimIdPageProps) {
    const createServerSupabaseClient = cache(() => {
        const cookieStore = cookies();
        return createServerComponentClient<Database>({
          cookies: () => cookieStore,
        });
      });
    
      const session = await getSession();
      const user = await getUser();
    
      const supabase = createServerSupabaseClient();
    
      if (!session) {
        redirect("/");
      }

      let ad = `${searchParams.name}`;
      let durum = ad === "undefined" || ad === null;
    
      let kategori = `${searchParams.kategori}`;
      let durumKategori = kategori === "undefined" || kategori === null;
    
      let firmaAd = `${searchParams.firma}`;
      let durumFirma = firmaAd === "undefined" || firmaAd === null;
    

      type Profil =
      | { id: string | null; firma_ad: string | null; yetki: string | null }[]
      | null;
  
    let profil: Profil | undefined;
  
    type Firma = { firma_id: string }[] | null;
    let firma: Firma | undefined;
  
    if (user != null || user != undefined) {
      const { data: profiltek } = await supabase
        .from("profiles")
        .select(`id, firma_ad, yetki`)
        .eq("id", user.id);
  
      profil = profiltek;
  
      const useremail: string = user.email || "";
  
      const { data: firmatek } = await supabase
        .from("firma_profil")
        .select("firma_id")
        .eq("user_email", useremail);
  
      firma = firmatek;
    }


let items: TasarimlarX[] | null = [];
  let tasarimlarx: TasarimlarX[] | null = [];
  let arananFirmaTasarim: TasarimlarX[] | null = [];

  let tasarimResimlerx:
    | {
        tasarim_resim_url: string | null;
        tasarim_id: string;
      }[]
    | null = [];

  // admin yetkisinde tüm tasarımların görülebilmesi - erişilebilmesi
  if (profil != null) {
    if (profil[0].yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: tasarim_firma } = await supabase
        .from("tasarimlar")
        .select()
        .eq("firma_id", firma[0].firma_id);
      tasarimlarx = tasarim_firma;
    } else {
      const { data: tasarim_tum } = await supabase.from("tasarimlar").select();

      tasarimlarx = tasarim_tum;
    }

    // Arama çubuğundan yazılan anahtar kelimeye göre getitirilecek tasarımlar
    var aranan = tasarimlarx?.reduce((result: any, thing) => {
      if (
        thing.tasarim_title != null &&
        thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())
      ) {
        result.push(thing);
      }
      return result;
    }, []);

    var arananFirma = tasarimlarx?.reduce((result: any, thing) => {
        if (
          thing.firma_unvan != null &&
          thing.firma_unvan.toLowerCase().includes(`${searchParams.firma}`.toLowerCase())
        ) {
          result.push(thing);
        }
        return result;
      }, []);
  
      let arananFirmaId = arananFirma?.map(({ firma_id }: any) => firma_id);
  
      if (durumFirma === false) {
        const { data: arananFirmaTasarimx } = await supabase
          .from("tasarimlar")
          .select()
          .eq("firma_id", arananFirmaId[0]);
  
        arananFirmaTasarim = arananFirmaTasarimx;
      }
  
      var arananKategori = tasarimlarx?.reduce((result: any, thing) => {
        if (
          thing.status != null &&
          thing.status.toLowerCase().includes(`${searchParams.kategori}`.toLowerCase())
        ) {
          result.push(thing);
        }
  
        return result;
      }, []);
  
      var arananVeKategori = tasarimlarx?.reduce((result: any, thing) => {
        if (thing.tasarim_title != null && thing.status != null) {
          if (
            thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase()) &&
            thing.status.includes(`${searchParams.kategori}`)
          ) {
            result.push(thing);
          }
        }
  
        return result;
      }, []);
  
      var firmaArananVeKategori = arananFirma?.reduce(
        (result: any, thing: any) => {
          if (thing.tasarim_title != null && thing.status != null) {
            if (
              thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase()) &&
              thing.status.includes(`${searchParams.kategori}`)
            ) {
              result.push(thing);
            }
          }
  
          return result;
        },
        []
      );
  
      let yalnizcaGecerli: TasarimlarX[] = [];
      let firmaYalnizcaGecerli: TasarimlarX[] = [];
  
      let durumIptalOlmayan = searchParams.kategori;
  
      if ((durumIptalOlmayan = "yalnizcaGecerli")) {
        yalnizcaGecerli = tasarimlarx?.reduce((result: any, thing) => {
          if (thing.status != null) {
            if (!thing.status.includes("iptal")) {
              result.push(thing);
            }
          }
          return result;
        }, []);
  
        if (durumFirma === false) {
          firmaYalnizcaGecerli = arananFirma?.reduce(
            (result: any, thing: any) => {
              if (thing.status != null) {
                if (!thing.status.includes("iptal")) {
                  result.push(thing);
                }
              }
              return result;
            },
            []
          );
        }
  
        if (yalnizcaGecerli != null) {
          var arananYalnizcaGecerli = yalnizcaGecerli.reduce(
            (result: any, thing) => {
              if (thing.tasarim_title != null) {
                if (thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())) {
                  result.push(thing);
                }
              }
  
              return result;
            },
            []
          );
        }
  
        if (firmaYalnizcaGecerli != null) {
          var arananFirmaYalnizcaGecerli = firmaYalnizcaGecerli.reduce(
            (result: any, thing) => {
              if (thing.tasarim_title != null) {
                if (thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())) {
                  result.push(thing);
                }
              }
  
              return result;
            },
            []
          );
        }
      }
  
      var firmadaAranan = arananFirma?.reduce((result: any, thing: any) => {
        if (
          thing.tasarim_title != null &&
          thing.tasarim_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())
        ) {
          result.push(thing);
        }
  
        return result;
      }, []);
  
      var firmadaArananKategori = arananFirma?.reduce(
        (result: any, thing: any) => {
          if (
            thing.status != null &&
            thing.status.includes(`${searchParams.kategori}`)
          ) {
            result.push(thing);
          }
  
          return result;
        },
        []
      );
  

    // Arama yapılan tasarımların id bilgileri
    let arananTasarimlar_id = aranan.map(({ id }: any) => id);

    // Tüm tasarımların id bilgileri
    /*  let secilenTasarim_id = tasarimlarx.map(({ id }) => id) */

    const { data: tumTasarimResimler } = await supabase
      .from("tasarim_resimler")
      .select("tasarim_resim_url, tasarim_id");

    tasarimResimlerx = tumTasarimResimler;

    if (tumTasarimResimler != null) {
      let tumTasarimResimlerTasarim_id = tumTasarimResimler.map(
        ({ tasarim_id }) => tasarim_id
      );

      var arananTasarimResimler = tumTasarimResimler.reduce(
        (result: any, thing) => {
          if (thing.tasarim_id.includes(`${arananTasarimlar_id}`)) {
            result.push(thing);
          }
          return result;
        },
        []
      );
    }
  }

  return (
      <div
        className="flex-none object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
            <div className="grid grid-cols-8 gap-4">
        <div className="col-span-4 pb-4">
          <Filter />
        </div>
      </div>
        <TasarimList
          /* items={durum ? tasarimlarx : aranan} */
          bilgiler={items}
          tasarimResimler={tasarimResimlerx}
          /* userid={user?.id!} */
        />
      </div>
  );
}

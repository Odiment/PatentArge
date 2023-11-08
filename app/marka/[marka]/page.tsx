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
import MarkaList from "./components/marka-list";
import Filter from "@/components/filter";
import { FirmaFilter } from "@/components/firmaFilter";
import { SearchInput } from "@/components/search-input";

import { cache } from "react";
import { Database } from "@/app/supabase";

/* ß */
type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
    firma: string | null;
  };
}

import { getSession } from "@/app/auth/getSession/getSession";
import { getUser } from "@/app/auth/getUser/getUser";
import { getYetki } from "@/app/auth/getYetki/getYetki";

export default async function MarkaKart({ searchParams }: MarkaIdPageProps) {
  const createServerSupabaseClient = cache(() => {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });
  });

  const session = await getSession();
  const user = await getUser();
  const yetki = await getYetki();

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
  let tumMarkaSiniflar: any | null;
  let tumMarkaSurecBilgileri: any | null;


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

  let items: MarkalarX[] | null = [];
  let markalarx: MarkalarX[] | null = [];
  let arananFirmaMarka: MarkalarX[] | null = [];

  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi

  if (profil != null) {
    if (yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: marka_firma } = await supabase
        .from("markalar")
        .select()
        .eq("firma_id", firma[0].firma_id);
      markalarx = marka_firma;
    } else {
      const { data: marka_tum } = await supabase.from("markalar").select();

      markalarx = marka_tum;
    }

    var aranan = markalarx?.reduce((result: any, thing) => {
      if (
        thing.marka != null &&
        thing.marka.toLowerCase().includes(`${searchParams.name}`.toLowerCase())
      ) {
        result.push(thing);
      }

      return result;
    }, []);

    var arananFirma = markalarx?.reduce((result: any, thing) => {
      if (
        thing.firma_unvan != null &&
        thing.firma_unvan
          .toLowerCase()
          .includes(`${searchParams.firma}`.toLowerCase())
      ) {
        result.push(thing);
      }
      return result;
    }, []);

    let arananFirmaId = arananFirma?.map(({ firma_id }: any) => firma_id);

    if (durumFirma === false) {
      const { data: arananFirmaMarkax } = await supabase
        .from("markalar")
        .select()
        .eq("firma_id", arananFirmaId[0]);

      arananFirmaMarka = arananFirmaMarkax;
    }

    var arananKategori = markalarx?.reduce((result: any, thing) => {
      if (
        thing.status != null &&
        thing.status.includes(`${searchParams.kategori}`)
      ) {
        result.push(thing);
      }

      return result;
    }, []);

    var arananVeKategori = markalarx?.reduce((result: any, thing) => {
      if (thing.marka != null && thing.status != null) {
        if (
          thing.marka
            .toLowerCase()
            .includes(`${searchParams.name}`.toLowerCase()) &&
          thing.status.includes(`${searchParams.kategori}`)
        ) {
          result.push(thing);
        }
      }

      return result;
    }, []);

    var firmaArananVeKategori = arananFirma?.reduce(
      (result: any, thing: any) => {
        if (thing.marka != null && thing.status != null) {
          if (
            thing.marka
              .toLowerCase()
              .includes(`${searchParams.name}`.toLowerCase()) &&
            thing.status.includes(`${searchParams.kategori}`)
          ) {
            result.push(thing);
          }
        }

        return result;
      },
      []
    );

    let yalnizcaGecerli: MarkalarX[] = [];
    let firmaYalnizcaGecerli: MarkalarX[] = [];

    let durumIptalOlmayan = searchParams.kategori;

    if ((durumIptalOlmayan = "yalnizcaGecerli")) {
      yalnizcaGecerli = markalarx?.reduce((result: any, thing) => {
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
            if (thing.marka != null) {
              if (
                thing.marka
                  .toLowerCase()
                  .includes(`${searchParams.name}`.toLowerCase())
              ) {
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
            if (thing.marka != null) {
              if (
                thing.marka
                  .toLowerCase()
                  .includes(`${searchParams.name}`.toLowerCase())
              ) {
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
      if (thing.marka != null && thing.marka.includes(`${searchParams.name}`)) {
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

    const { data: tumMarkaSiniflarx } = await supabase
      .from("marka_siniflar")
      .select("basvurulan_siniflar, marka_id");

    tumMarkaSiniflar = tumMarkaSiniflarx;

    const { data: tumMarkaSurecBilgilerix } = await supabase
      .from("marka_surec")
      .select("id, marka_id, islem_tarihi, islem, islem_aciklamasi")

      tumMarkaSurecBilgileri = tumMarkaSurecBilgilerix

    

    // Eğer firma araması yapılmadıysa, standart filtreleme yap...
    if (durumFirma === true) {
      if (durum === true) {
        items = markalarx;
      } else items = aranan;

      if (durumKategori === true) {
        items = markalarx;
      } else items = arananKategori;

      if (durum === false && durumKategori === false) {
        items = arananVeKategori;
      }

      if (searchParams.kategori === "tumu") {
        items = markalarx;
      }

      let durumTumuVeAranan =
        searchParams.kategori === "tumu" && durum === false;

      if (durumTumuVeAranan === true) {
        items = aranan;
      }

      if (searchParams.kategori === "yalnizcaGecerli") {
        items = yalnizcaGecerli;
      }

      let durumYalnizcaGecerliVeAranan =
        searchParams.kategori === "yalnizcaGecerli" && durum === false;

      if (durumYalnizcaGecerliVeAranan === true) {
        items = arananYalnizcaGecerli;
      }
    }

    // Eğer firma bazlı arama yapılıyorsa önceliği firma aramasına ver...
    if (durumFirma === false) {
      if (durum === true) {
        items = arananFirma;
      } else items = firmadaAranan;

      if (durumKategori === true) {
        items = arananFirma;
      } else items = firmadaArananKategori;

      if (durumKategori === false && durum === false) {
        items = firmaArananVeKategori;
      }

      if (searchParams.kategori === "tumu") {
        items = arananFirma;
      }

      let durumTumuVeAranan =
        searchParams.kategori === "tumu" && durum === false;

      if (durumTumuVeAranan === true) {
        items = firmadaAranan;
      }

      if (searchParams.kategori === "yalnizcaGecerli") {
        items = firmaYalnizcaGecerli;
      }

      let durumYalnizcaGecerliVeAranan =
        searchParams.kategori === "yalnizcaGecerli" && durum === false;

      if (durumYalnizcaGecerliVeAranan === true) {
        items = arananFirmaYalnizcaGecerli;
      }
    }
  }

  let basvuru_no: React.Key | null | undefined = items?.map(
    ({ basvuru_no }) => basvuru_no
  ) as React.Key | null | undefined;
  
  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
      <div className="flex flex-1 justify-between">
        <div className="flex">
          <Filter />
        </div>
        <div className="flex">
          {yetki === "admin" && (
            <div key={basvuru_no}>
              <FirmaFilter />
            </div>
          )}
        </div>
      </div>
      <MarkaList
        items={items}
        bilgiler={items}
        userid={user?.id!}
        yetki={yetki}
        tumMarkaSiniflar={tumMarkaSiniflar}
        tumMarkaSurecBilgileri={tumMarkaSurecBilgileri!}
      />
    </div>
  );
}




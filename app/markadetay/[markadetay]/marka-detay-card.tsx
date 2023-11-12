"use client";

import { useEffect, useState } from "react";
import { Chip, Avatar } from "@nextui-org/react";
import { useDisclosure, cn } from "@nextui-org/react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Card, CardBody, Image } from "@nextui-org/react";
import { EditIcon } from "@/icons/EditIcon";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaCardProps {
  bilgiler: any | null;
  secilenMarkaSiniflar: any[] | null;
  secilenMarkaSurecBilgileri: any[] | null;
  yetki: any | null;
}

const MarkaDetayCard: React.FC<MarkaCardProps> = ({
  bilgiler,
  secilenMarkaSiniflar,
  secilenMarkaSurecBilgileri,
  yetki,
}) => {
  const supabase = createClientComponentClient<Database>();

  const [url, setUrl] = useState<MarkalarX["logo_url"]>(bilgiler?.logo_url!);

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  useEffect(() => {
    async function downloadMarkaLogo(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("markaLogo")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadMarkaLogo(url);
  }, [url, supabase]);

  let resim_url: string;

  if (url === null || url === undefined) {
    resim_url = bilgiler[0]?.tp_logo_url;
  } else {
    resim_url = url;
  }

  let durum_bilgisi: string = "belirsiz";
  if (bilgiler[0]?.status === "basvuru") {
    durum_bilgisi = "Başvuru Sürecinde";
  } else if (bilgiler[0]?.status === "tescil") {
    durum_bilgisi = "Tescil";
  } else if (bilgiler[0]?.status === "iptal") {
    durum_bilgisi = "İptal";
  }

  const sortedSiniflar = secilenMarkaSiniflar?.sort((a,b) => a.basvurulan_sinif_no - b.basvurulan_sinif_no)


  return (
    <>
      {yetki === "admin" && (
        <>
          <Button asChild className="bg-yellow-700 hover:bg-yellow-400">
            <Link href={`/tmcard/${bilgiler[0].referans_no}`}>
              <EditIcon className={cn(iconClasses, "text-white")} />
              Düzenle
            </Link>
          </Button>
        </>
      )}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler?.id}
            isBlurred
            className="border-1 border-primary  hover:bg-primary/20">
            <CardBody>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 justify-center">
                <div className="relative col-span-3 md:col-span-6">
                  <Image
                    isZoomed
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    height="100%"
                    alt="Album cover"
                    className="relative opacity-0  data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0  object-cover"
                    src={resim_url}
                  />
                </div>

                <div className="flex flex-col col-span-3 md:col-span-6 content-start">
                  <div className="flex justify-between ">
                    <div className="flex flex-col gap-0">
                      {bilgiler[0]?.status === "basvuru" && (
                        <Chip
                          variant="flat"
                          color="warning"
                          size="lg"
                          avatar={
                            <Avatar
                              name={durum_bilgisi}
                              size="lg"
                              color="warning"
                              getInitials={(name) => name.charAt(0)}
                            />
                          }>
                          {durum_bilgisi}
                        </Chip>
                      )}
                      {bilgiler[0]?.status === "tescil" && (
                        <Chip
                          variant="flat"
                          color="success"
                          size="lg"
                          avatar={
                            <Avatar
                              name={durum_bilgisi}
                              size="lg"
                              color="success"
                              getInitials={(name) => name.charAt(0)}
                            />
                          }>
                          {durum_bilgisi}
                        </Chip>
                      )}
                      {bilgiler[0]?.status === "iptal" && (
                        <Chip
                          variant="flat"
                          color="danger"
                          size="lg"
                          avatar={
                            <Avatar
                              name={durum_bilgisi}
                              size="lg"
                              color="danger"
                              getInitials={(name) => name.charAt(0)}
                            />
                          }>
                          {durum_bilgisi}
                        </Chip>
                      )}
                      <h3 className="text-3xl font-bold text-foreground/90">
                        {bilgiler[0]?.marka}
                      </h3>
                      <p className="font-semibold text-2xl">
                        {bilgiler[0]?.basvuru_no}
                      </p>
                      <p className="font-light">Marka Sınıfları:</p>
                      <p className="text-lg font-semibold text-foreground/80 ">
                        {bilgiler[0]?.class_no}
                      </p>

{/*                       <p className="font-light">Marka İlan Bülten Tarihi:</p>
                      <p className="text-lg font-semibold text-foreground/80 ">
                        {bilgiler[0]?.yayin_tarihi}
                      </p> */}

                      {bilgiler[0]?.yayin_tarihi != null && (
                        <>
                          <p className="font-light">
                            Marka İlan Bülten Tarihi:
                          </p>
                          <p className="text-lg font-semibold text-foreground/80 ">
                            {bilgiler[0]?.yayin_tarihi}
                          </p>
                        </>
                      )}
                      {bilgiler[0]?.marka_durumu !== null && (
                        <div>
                          <p className="font-light">Marka Durumu:</p>
                          <p className="font-semibold">
                            {bilgiler[0]?.marka_durumu}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler?.id}
            isBlurred
            className=" hover:bg-primary/20">
            <CardBody>
              <p className="text-xl font-light text-foreground/90">
                Marka / Başvuru Sahibi:
              </p>
              <p className="font-semibold text-2xl">
                {bilgiler[0]?.firma_unvan}
              </p>
              <Separator className="bg-primary" />
              {bilgiler[0]?.son_islem_tarihi !== null && (
                <div>
                  <p className="font-light">Son İşlem Tarihi:</p>
                  <p className="font-semibold">
                    {bilgiler[0]?.son_islem_tarihi}
                  </p>
                </div>
              )}
              {bilgiler[0]?.son_islem !== null && (
                <div>
                  <p className="font-light">Son İşlem Açıklaması:</p>
                  <p className="font-semibold">{bilgiler[0]?.son_islem}</p>
                </div>
              )}
              <Separator className="bg-primary" />

              {bilgiler[0]?.durum_aciklamasi !== null && (
                <div>
                  <p className="font-light">Durum Açıklaması:</p>
                  <p className="font-semibold">
                    {bilgiler[0]?.durum_aciklamasi}
                  </p>
                </div>
              )}
              {bilgiler[0]?.beklenen_islem !== null && (
                <div>
                  <p className="font-light">Beklenen/Sıradaki İşlem:</p>
                  <p className="font-semibold">{bilgiler[0]?.beklenen_islem}</p>
                  <p className="font-semibold">
                    {bilgiler[0]?.beklenen_islem_tarihi}
                  </p>
                  <p className="font-semibold">
                    {bilgiler[0]?.beklenen_islem_aciklamasi}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler?.id}
            isBlurred
            className="hover:bg-primary/20">
            <CardBody>
              {/* <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 justify-center">
                <div className="flex flex-col col-span-3 md:col-span-8 content-start"> */}
              <div className="flex justify-between ">
                <div className="flex flex-col gap-0">
                  {/* <h3 className="text-3xl font-bold text-foreground/90">
                    MARKA SÜREÇ DETAY BİLGİLERİ - SONRAKİ AŞAMALARA DAİR
                    BİLGİLER
                  </h3> */}
                  <p className="font-light">Marka SÜREÇ Ayrıntıları:</p>
                  {secilenMarkaSurecBilgileri?.map((item, index) => (
                    <>
                    <Separator className="bg-primary" />
                      <p className="font-light">{item.islem_tarihi}</p>
                      <h3
                        key={item.id}
                        className="text-xl font-bold text-foreground/90">
                        {item.islem}
                      </h3>
                      <p className="font-light">{item.islem_aciklamasi}</p>
                    </>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler?.id}
            isBlurred
            className="hover:bg-primary/20">
            <CardBody>
              <div className="flex justify-between ">
                <div className="flex flex-col gap-0">
                  <h3 className="text-3xl font-bold text-foreground/90">
                    MARKA SINIFLARI DETAY BİLGİLERİ
                  </h3>
                  <p className="font-light">Marka Sınıf Ayrıntıları:</p>
                  {sortedSiniflar?.map((item, index) => (
                    <>
                    <Separator className="bg-primary" />
                      <h3
                        key={item.id}
                        className="text-3xl font-bold text-foreground/90">
                        {item.basvurulan_sinif_no}
                      </h3>
                      <p className="font-light">
                        {item.basvurulan_sinif_aciklamasi}
                      </p>
                    </>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MarkaDetayCard;

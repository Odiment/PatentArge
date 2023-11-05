"use client";

import { useEffect, useState } from "react";
import { Chip, Avatar } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Card, CardBody, Image } from "@nextui-org/react";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaCardProps {
  bilgiler: any | null;
}

const MarkaDetayCard: React.FC<MarkaCardProps> = ({ bilgiler }) => {
  const supabase = createClientComponentClient<Database>();

  const [url, setUrl] = useState<MarkalarX["logo_url"]>(bilgiler?.logo_url!);

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

  return (
    <>
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
                      <p className="text-lg font-semibold text-foreground/80 ">
                        {bilgiler[0]?.class_no}
                      </p>

                      {bilgiler[0]?.durum_aciklamasi !== null && (
                        <div>
                          <p className="font-light">Durum Açıklaması:</p>
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
              <h3 className="text-3xl font-bold text-foreground/90">
                KISA DURUM VE BAŞVURU SAHİBİ BİLGİLERİ - SIRADAKİ İŞLEMİN KISA
                İFADESİ
              </h3>
              <p className="font-semibold text-2xl">
                {bilgiler[0]?.firma_unvan}
              </p>
              {bilgiler[0]?.durum_aciklamasi !== null && (
                <div>
                  <p className="font-light">Durum Açıklaması:</p>
                  <p className="font-semibold">{bilgiler[0]?.marka_durumu}</p>
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
                  <h3 className="text-3xl font-bold text-foreground/90">
                    MARKA SÜREÇ DETAY BİLGİLERİ - SONRAKİ AŞAMALARA DAİR
                    BİLGİLER
                  </h3>
                </div>
              </div>
              {/*                 </div>
              </div> */}
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
                </div>
                <div></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MarkaDetayCard;

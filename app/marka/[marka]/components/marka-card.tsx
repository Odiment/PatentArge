"use client";

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import { EditIcon } from "@/icons/EditIcon";
import { EyeIcon } from "@/icons/EyeIcon";
import { GiPlainCircle } from "react-icons/gi";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  cn,
} from "@nextui-org/react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
} from "@nextui-org/react";

/* import { Database } from '@/app/database.types' */

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaCardProps {
  data: MarkalarX | null;
  bilgiler: MarkalarX | null;
  userid: string;
  yetki: any | null;
  tumMarkaSiniflar: any | null;
  tumMarkaSurecBilgileri: any | null;
}

const MarkaCard: React.FC<MarkaCardProps> = ({ data, bilgiler, userid, yetki, tumMarkaSiniflar, tumMarkaSurecBilgileri }) => {


  const supabase = createClientComponentClient<Database>();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  /* const [yetki, setYetki] = useState<string | null>(null); */
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

    let basvurulan_sinif_aciklamasi: any;
    let basvurulan_sinif_numarasi: any;

    if (tumMarkaSiniflar != null) {
    
        var ilgiliMarkaSiniflar = tumMarkaSiniflar.reduce((result: any, thing: any) => {
          if (thing.marka_id.includes(`${bilgiler?.id}`)) {
            result.push(thing);
          }
          return result;
        }, []);
    
        let basvurulan_sinif_numarasix = ilgiliMarkaSiniflar.map(
          ({ basvurulan_sinif_numarasi }: any) => basvurulan_sinif_numarasi
        );
        basvurulan_sinif_numarasi = basvurulan_sinif_numarasix;


        let basvurulan_sinif_aciklamasix = ilgiliMarkaSiniflar.map(
          ({ basvurulan_sinif_aciklamasi }: any) => basvurulan_sinif_aciklamasi
        );
        basvurulan_sinif_aciklamasi = basvurulan_sinif_aciklamasix;
      }

  /*     let islem_tarihi: any;
      let islem: any;
      let islem_aciklamasi: any;
      let ilgiliMarkaSurecBilgileri: any;
  

      if (tumMarkaSurecBilgileri != null) {
    
        var ilgiliMarkaSurecBilgilerix = tumMarkaSurecBilgileri.reduce((result: any, thing: any) => {
          if (thing.marka_id.includes(`${bilgiler?.id}`)) {
            result.push(thing);
          }
          return result;
        }, []);

        ilgiliMarkaSurecBilgileri = ilgiliMarkaSurecBilgilerix
    
        let islemx = ilgiliMarkaSurecBilgileri.map(
          ({ islem }: any) => islem
        );
        islem = islemx;


        let islem_aciklamasix = ilgiliMarkaSurecBilgileri.map(
          ({ islem_aciklamasi }: any) => islem_aciklamasi
        );
        islem_aciklamasi = islem_aciklamasix;

        let islem_tarihix = ilgiliMarkaSurecBilgileri.map(
          ({ islem_tarihi }: any) => islem_tarihi
        );
        islem_tarihi = islem_tarihix;
      } */
    

  let markadurumu = `${bilgiler?.status}`;

  let yesil = markadurumu === "tescil";
  let sari = markadurumu === "basvuru";
  let kirmizi = markadurumu === "iptal";

  /* let logourl: MarkalarX['logo_url'] = bilgiler?.logo_url[] */

  const [url, setUrl] = useState<MarkalarX["logo_url"] | null>(
    bilgiler?.logo_url!
  );


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


  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from("markalar")
        .delete()
        .eq("id", bilgiler?.id!);

      if (error) throw error;
      /*   window.location.reload() */
    } catch (error: any) {
      alert(error.message);
    }
  }

  let resim_url: string;

  if (url === null) {
    resim_url = bilgiler?.tp_logo_url!;
  } else {
    resim_url = url;
  }

  let durum_bilgisi: string | null | undefined;
  if (bilgiler?.status === "basvuru") {
    durum_bilgisi = "Başvuru Sürecinde";
  } else if (bilgiler?.status === "tescil") {
    durum_bilgisi = "Tescil";
  } else if (bilgiler?.status === "iptal") {
    durum_bilgisi = "İptal";
  }

  return (
    <div key={data?.basvuru_no} className="aspect-square rounded-lg ">
      <Card
        shadow="sm"
        isPressable
        onPress={onOpen}
        className="border-1 border-primary bg-primary/5 hover:bg-primary/20">
        <CardBody className="overflow-visible p-0">
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            width="100%"
            height="100%"
            alt="MarkaLogo"
            className="relative opacity-0 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
            src={resim_url}
          />
        </CardBody>
        <CardFooter className="flex text-small justify-between  h-20 ">
          <b className="text-left">{data?.marka}</b>
          <b
            className={classNames("text-xl", "font-bold", "flex", {
              "text-emerald-500": yesil,
              "text-yellow-500": sari,
              "text-red-500": kirmizi,
            })}>
            <GiPlainCircle size={200} className="h-5 w-5" />
            {/* {bilgiler.status} */}
          </b>
        </CardFooter>
      </Card>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent className="overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold">
                {data?.marka}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Image
                      className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
                      src={resim_url}
                      alt="MarkaLogo"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-2xl">
                      {bilgiler?.basvuru_no}
                    </p>
                    <p>Başvuru Tarihi:</p>
                    <p className="text-xl text-primary/80 font-bold">
                      {bilgiler?.basvuru_tarihi}
                    </p>
                    <p>Sınıflar:</p>
                    <p className="text-xl text-primary/80">
                      {bilgiler?.class_no}
                    </p>

                    <p className="text-sm text-primary/80">
                      Ref: {bilgiler?.referans_no}
                    </p>
                    <p className="text-primary/80 text-sky-400">
                      {bilgiler?.firma_unvan}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <p
                    className={classNames("text-2xl", "font-bold", {
                      "text-emerald-500": yesil,
                      "text-yellow-500": sari,
                      "text-red-500": kirmizi,
                    })}>
                    <GiPlainCircle size={200} className="h-7 w-7" />
                  </p>
                  {/*  <p>Durum:</p> */}
                  <p
                    className={classNames("text-lg", "font-bold", {
                      "text-emerald-500": yesil,
                      "text-yellow-500": sari,
                      "text-red-500": kirmizi,
                    })}>
                    {durum_bilgisi}
                  </p>
                </div>
                <div>
                  <p>Marka Durumu:</p>
                </div>
                <div>
                  <p>{bilgiler?.marka_durumu}</p>
                </div>
                <div>
                  <p>{bilgiler?.durum_aciklamasi}</p>
                </div>

{/*                 {ilgiliMarkaSurecBilgileri?.map((item: any, index: any) => (
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
                  ))} */}
              </ModalBody>
              <ModalFooter>
                <Button asChild className="bg-primary hover:bg-primary/50">
                  <Link href={`/markadetay/${bilgiler?.referans_no}`}>
                    <EyeIcon className={cn(iconClasses, "text-white")} />
                    Marka Detay
                  </Link>
                </Button>
                {yetki === "admin" && (
                  <>
                    <Button
                      asChild
                      className="bg-yellow-700 hover:bg-yellow-400">
                      <Link href={`/tmcard/${bilgiler?.referans_no}`}>
                        <EditIcon className={cn(iconClasses, "text-white")} />
                        Düzenle
                      </Link>
                    </Button>
                    <Button onClick={deleteMarka} variant="destructive">
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-white")}
                      />
                      Markayı Sil
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default MarkaCard;

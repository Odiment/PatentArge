"use client";

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import spaceman from "@/assets/spaceman-1.png";
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

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
} from "@nextui-org/react";

/* import { Database } from '@/app/database.types' */

/* interface MarkaCard {
  data: Database[]
  bilgiler: Database[]
} */

/* type Markalar = Database['public']['Tables']['markalar']['Row'] */

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaCardProps {
  data: MarkalarX | null;
  bilgiler: MarkalarX | null;
  userid: string;
}

const MarkaCardYatay: React.FC<MarkaCardProps> = ({
  data,
  bilgiler,
  userid,
}) => {
  const supabase = createClientComponentClient<Database>();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [yetki, setYetki] = useState<string | null>(null);
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  let markadurumu = `${bilgiler?.status}`;

  let yesil = markadurumu === "tescil";
  let sari = markadurumu === "basvuru";
  let kirmizi = markadurumu === "iptal";

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

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq("id", userid)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setYetki(data.yetki);
        setPozisyon(data.pozisyon);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }, [userid, supabase]);

  useEffect(() => {
    getProfile();
  }, [userid, getProfile]);

  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from("markalar")
        .delete()
        .eq("id", bilgiler?.id!);

      if (error) throw error;
      window.location.reload();
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

  let durum_bilgisi: string | null;
  if (bilgiler?.status === "basvuru") {
    durum_bilgisi = "Başvuru Sürecinde";
  } else if (bilgiler?.status === "tescil") {
    durum_bilgisi = "Tescil";
  } else if (bilgiler?.status === "iptal") {
    durum_bilgisi = "İptal";
  }

  return (
    <>
      <div className="rounded-lg justify-center">
        <Card
          shadow="sm"
          key={data?.id}
          isPressable
          onPress={onOpen}
          isBlurred
          className="border-1 border-primary  hover:bg-primary/20">
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 justify-center">
              <div className="relative col-span-6 md:col-span-4">
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

              <div className="flex flex-col col-span-6 md:col-span-8 content-start">
                <div className="flex justify-between ">
                  <div className="flex flex-col gap-0">
                    <h3 className="text-3xl font-bold text-foreground/90">
                      {data?.marka}
                    </h3>
                    <p className="font-semibold text-2xl">
                      {bilgiler?.basvuru_no}
                    </p>
                    <p className="text-lg font-semibold text-foreground/80 ">
                      {bilgiler?.class_no}
                    </p>

                    {bilgiler?.durum_aciklamasi !== null && (
                      <div>
                        <p className="font-light">Durum Açıklaması:</p>
                        <p className="font-semibold">
                          {bilgiler?.marka_durumu}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <b
                      className={classNames("text-xl", "font-bold", {
                        "text-emerald-500": yesil,
                        "text-yellow-500": sari,
                        "text-red-500": kirmizi,
                      })}>
                      <GiPlainCircle size={200} className="h-7 w-7" />
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
        <ModalContent>
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
                    <p className="text-sm text-primary/80 text-sky-400">
                      {bilgiler?.firma_ad}
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
                    className={classNames("text-2xl", "font-bold", {
                      "text-emerald-500": yesil,
                      "text-yellow-500": sari,
                      "text-red-500": kirmizi,
                    })}>
                    {durum_bilgisi}
                  </p>
                </div>
                <div>
                  <p>{bilgiler?.durum_aciklamasi}</p>
                </div>
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
    </>
  );
};

export default MarkaCardYatay;

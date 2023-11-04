"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
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

/* type MarkalarX = Database['public']['Tables']['markalar']['Row'] */

interface MarkaCardProps {
  eksikMarka: string | null;
  eksikMarkaRef: string | null;
  userid: string;
  eksikMarkaId: string;
  firma_unvan: any;
}

const EksikBilgiMarka: React.FC<MarkaCardProps> = ({
  eksikMarka,
  eksikMarkaRef,
  userid,
  eksikMarkaId,
  firma_unvan,
}) => {
  const supabase = createClientComponentClient<Database>();
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  /*  const [yetki, setYetki] = useState<string | null>(null) */
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  /* let markadurumu = `${bilgiler?.status}` */

  /*   let yesil = markadurumu === 'tescil'
  let sari = markadurumu === 'basvuru'
  let kirmizi = markadurumu === 'iptal' */

  /* let logourl: MarkalarX['logo_url'] = bilgiler?.logo_url[] */

  /* const [url, setUrl] = useState<MarkalarX['logo_url'] | null>(bilgiler?.logo_url!) */

  /* useEffect(() => {
    async function downloadMarkaLogo(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('markaLogo')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadMarkaLogo(url)
  }, [url, supabase])

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq('id', userid)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setYetki(data.yetki)
        setPozisyon(data.pozisyon)
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }, [userid, supabase])

  useEffect(() => {
    getProfile()
  }, [userid, getProfile]) */

  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from("markalar")
        .delete()
        .eq("id", eksikMarkaId);

      if (error) throw error;
      /*   window.location.reload() */
    } catch (error: any) {
      alert(error.message);
    }
  }

  let resim_url: string =
    "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5ODkxODI3NSwiZXhwIjoxNzkzNTI2Mjc1fQ.lb7bGb--HDNNLsPPXqUNjPpZNPD7zlbrGoezrglkFEI&t=2023-11-02T09%3A44%3A35.926Z";

  return (
    <>
      <div key={eksikMarkaId} className="aspect-square rounded-lg ">
        <Card
          shadow="sm"
          key={eksikMarkaId}
          isPressable
          /* onPress={redirect(`/tmcard/${eksikMarkaRef}`)} */
          className="border-1 border-primary bg-primary/5 hover:bg-primary/20">
          <CardBody className="overflow-visible p-0">
            <Button asChild className="bg-primary hover:bg-primary/50 border-2 border-emerald-500">
              <Link href={`/tmcard/${eksikMarkaRef}`} >
                <EditIcon className={cn(iconClasses, "text-white")} />
                Markayı Düzenle
              </Link>
            </Button>
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
            <b className="text-center">{firma_unvan}</b>
          </CardBody>
          <CardFooter className="flex text-small justify-between  h-20 ">
            <b className="text-left">{eksikMarka}</b>
            
            <b
            /* className={classNames('text-xl', 'font-bold', 'flex', {
                'text-emerald-500': yesil,
                'text-yellow-500': sari,
                'text-red-500': kirmizi,
              })} */
            >
              <GiPlainCircle size={200} className="h-5 w-5" />
              {/* {bilgiler.status} */}
            </b>
          </CardFooter>
        </Card>
      </div>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold">
                {eksikMarka}
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
                    {/* <p className="font-semibold text-2xl">
                      {bilgiler?.basvuru_no}
                    </p>
                    <p>Başvuru Tarihi:</p>
                    <p className="text-xl text-primary/80 font-bold">
                      {bilgiler?.basvuru_tarihi}
                    </p>
                    <p>Sınıflar:</p>
                    <p className="text-xl text-primary/80">
                      {bilgiler?.class_no}
                    </p> */}

                    <p className="text-sm text-primary/80">
                      Ref: {eksikMarkaRef}
                    </p>
                    <p className="text-sm text-primary/80 text-sky-400">
                      {firma_unvan}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <p
                  /* className={classNames('text-2xl', 'font-bold', {
                      'text-emerald-500': yesil,
                      'text-yellow-500': sari,
                      'text-red-500': kirmizi,
                    })} */
                  >
                    <GiPlainCircle size={200} className="h-7 w-7" />
                  </p>
                  {/*  <p>Durum:</p> */}
                  {/*                   <p
                    className={classNames('text-lg', 'font-bold', {
                      'text-emerald-500': yesil,
                      'text-yellow-500': sari,
                      'text-red-500': kirmizi,
                    })}
                  >
                    {durum_bilgisi}
                  </p> */}
                </div>
                {/*                 <div>
                  <p>{bilgiler?.durum_aciklamasi}</p>
                </div> */}
              </ModalBody>
              <ModalFooter>
                <Button asChild className="bg-primary hover:bg-primary/50">
                  <Link href={`/markadetay/${eksikMarkaRef}`}>
                    <EyeIcon className={cn(iconClasses, "text-white")} />
                    Marka Detay
                  </Link>
                </Button>
                {/* {yetki === 'admin' && ( */}
                <>
                  <Button asChild className="bg-yellow-700 hover:bg-yellow-400">
                    <Link href={`/tmcard/${eksikMarkaRef}`}>
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
                {/*  )} */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default EksikBilgiMarka;

"use client";

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GiPlainCircle } from "react-icons/gi";
import { Chip, Avatar } from "@nextui-org/react";
import { NotificationIcon } from "@/icons/NotificationIcon";
import { CheckIcon } from "@/icons/CheckIcon";
import { EyeIcon } from "@/icons/EyeIcon";
import { EditIcon } from "@/icons/EditIcon";
import {
  /*   Button,
  Link, */
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

// FÜZE URL
/* resim_url =
      'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/avatars/aec65205-9440-482f-a539-9293fb7bb8a0-0.5921580138461082.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlYzY1MjA1LTk0NDAtNDgyZi1hNTM5LTkyOTNmYjdiYjhhMC0wLjU5MjE1ODAxMzg0NjEwODIucG5nIiwiaWF0IjoxNjk1NzU5Nzc4LCJleHAiOjE3MjcyOTU3Nzh9.rAgx9t6ExaXl_Y-M9peTr3IHA1TD9gHf9wsGd-PWsbw&t=2023-09-26T20%3A22%3A55.712Z'
   */
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentCardProps {
  /* data: PatentlerX | null; */
  bilgiler: PatentlerX | null;
  /* patent_id: string; */
  /* userid: string; */
  yetki: any | null;
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
}

const PatentCard: React.FC<PatentCardProps> = ({
  /* data, */
  bilgiler,
  /* patent_id, */
  patentResimler,
  /* userid, */
  yetki,
}) => {
  let patent_resimler_urlx: any;

  if (patentResimler != null) {
    /*     let patentResimler_id = patentResimler.map(({ patent_id }) => patent_id);*/
    /*     let patentResimler_resim_url = patentResimler.map(
      ({ patent_resim_url }) => patent_resim_url
    ); */

    var ilgiliPatentResimler = patentResimler.reduce((result: any, thing) => {
      if (thing.patent_id.includes(`${bilgiler?.id}`)) {
        result.push(thing);
      }
      return result;
    }, []);

    let patent_resimler_url = ilgiliPatentResimler.map(
      ({ patent_resim_url }: any) => patent_resim_url
    );
    patent_resimler_urlx = patent_resimler_url;
  }

  const supabase = createClientComponentClient<Database>();
  const [currentPatentIndex, setCurrentPatentIndex] = useState(0);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  /* const [yetki, setYetki] = useState<string | null>(null); */
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  let patentdurumu = `${bilgiler?.status!}`;

  let yesil = patentdurumu === "tescil";
  let sari = patentdurumu === "basvuru";
  let kirmizi = patentdurumu === "iptal";

  const [patent_url, setPatentUrl] = useState<PatentlerX["patent_figure_url"]>(
    patent_resimler_urlx[currentPatentIndex]
  );
  const [url, setUrl] = useState<PatentlerX["patent_figure_url"]>(
    patent_resimler_urlx[currentPatentIndex]
  );
  const [patent_figure_url, setPatentFigureUrl] = useState<
    PatentlerX["patent_figure_url"]
  >(patent_resimler_urlx[currentPatentIndex]);

  useEffect(() => {
    async function downloadPatentFigure(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("patentFigure")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setPatentFigureUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (patent_url) downloadPatentFigure(patent_url);
  }, [patent_url, supabase]);

  /*  const getProfile = useCallback(async () => {
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
  }, [userid, getProfile]); */

  async function deletePatent() {
    try {
      const { error } = await supabase
        .from("patentler")
        .delete()
        .eq("id", bilgiler?.id!);

      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  }

  let resim_url: string | null;

  // slider functions *************
  // Patent Resimler ******************
  const prevPatentSlide = () => {
    const isFirstSlide = currentPatentIndex === 0;
    const newIndex = isFirstSlide
      ? patent_resimler_urlx.length - 1
      : currentPatentIndex - 1;
    setCurrentPatentIndex(newIndex);
    setPatentUrl(patent_resimler_urlx[currentPatentIndex]);
  };

  const nextPatentSlide = () => {
    const isLastSlide = currentPatentIndex === patent_resimler_urlx.length - 1;
    const newIndex = isLastSlide ? 0 : currentPatentIndex + 1;
    setCurrentPatentIndex(newIndex);
    setPatentUrl(patent_resimler_urlx[currentPatentIndex]);
  };

  if (url === null || url === undefined) {
    resim_url =
      "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5ODkxODI3NSwiZXhwIjoxNzkzNTI2Mjc1fQ.lb7bGb--HDNNLsPPXqUNjPpZNPD7zlbrGoezrglkFEI&t=2023-11-02T09%3A44%3A35.926Z";
    /* resim_url =
      "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5NzM3Mjc3OSwiZXhwIjoxNzkxOTgwNzc5fQ.2s1NRy0rUx9cDryhuovBt4Uuy6BFQPrVCfzXDfp5BpI&t=2023-10-15T12%3A26%3A19.101Z"; */
  } else {
    resim_url = patent_figure_url;
  }

  let durum_bilgisi: string = "belirsiz";
  if (bilgiler?.status === "basvuru") {
    durum_bilgisi = "Başvuru Sürecinde";
  } else if (bilgiler?.status === "tescil") {
    durum_bilgisi = "Tescil Edildi";
  } else if (bilgiler?.status === "iptal") {
    durum_bilgisi = "İptal/Geçersiz";
  }

  return (
    <>
      <div className="aspect-square rounded-lg">
        <Card shadow="sm" key={bilgiler?.id}>
          <CardHeader
            className="pb-0 pt-2 px-4 h-20 flex-col items-start hover:bg-primary/50"
            onClick={onOpen}>
            <p className="text-lg uppercase font-bold">
              {bilgiler?.patent_title}
            </p>
            {/*             <p className="text-tiny uppercase font-bold">Daily Mix</p>
            <small className="text-default-500">12 Tracks</small>
            <h4 className="font-bold text-large">Frontend Radio</h4> */}
          </CardHeader>
          <CardBody className="overflow-visible p-0">
            <div className="max-w-[1400px]  w-full m-auto  relative group">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                height={200}
                alt="patent_figure"
                className="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
                src={resim_url!}
              />

              <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <ChevronLeft onClick={prevPatentSlide} size={30} />
              </div>

              <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <ChevronRight onClick={nextPatentSlide} size={30} />
              </div>
            </div>
          </CardBody>
          <CardFooter className="hover:bg-primary/50  " onClick={onOpen}>
            <>
              <div className=" grid grid-cols-12 gap-2 items-center justify-between h-35">
                {/* <div className="col-start-1 col-span-7 "> */}
                {/*                 <div className="col-start-1 col-span-12">
                  <b>{data.patent_title}</b>
                </div> */}
                {/* <div className="col-end-13 col-span-5 justify-end gap-2"> */}
                {bilgiler?.status === "basvuru" && (
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
                {bilgiler?.status === "tescil" && (
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
                {bilgiler?.status === "iptal" && (
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
                {/* </div> */}
              </div>
            </>
          </CardFooter>
        </Card>
      </div>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true} placement="top">
        <ModalContent className="overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold text-center">
                {bilgiler?.patent_title}
              </ModalHeader>
              <ModalBody>
                <div className="max-w-[1400px]  w-full m-auto  relative group">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    height={200}
                    alt="patent_figure"
                    className="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
                    src={resim_url!}
                  />

                  <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <ChevronLeft onClick={prevPatentSlide} size={30} />
                  </div>

                  <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <ChevronRight onClick={nextPatentSlide} size={30} />
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
                  <p className="font-semibold text-2xl">
                    {bilgiler?.basvuru_no}
                  </p>
                  <table>
                    <tr>
                      <td>Başvuru Tarihi: </td>
                      <td className="font-semibold text-2xl">
                        {bilgiler?.basvuru_tarihi}
                      </td>
                    </tr>
                    <tr>
                      <td>Patent Sınıfları:</td>
                      <td>{bilgiler?.class_no}</td>
                    </tr>
                  </table>
                  <p className="text-sm text-primary/80">
                    Ref: {bilgiler?.referans_no}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary/80">Özet:</p>
                  <p className="text-sm">{bilgiler?.ozet}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button asChild className="bg-primary hover:bg-primary/50">
                  <Link href={`/patentdetay/${bilgiler?.referans_no}`}>
                    <EyeIcon className={cn(iconClasses, "text-white")} />
                    Patent Detay
                  </Link>
                </Button>
                {yetki === "admin" && (
                  <>
                    <Button
                      asChild
                      className="bg-yellow-700 hover:bg-yellow-400">
                      <Link href={`/ptcard/${bilgiler?.referans_no}`}>
                        <EditIcon className={cn(iconClasses, "text-white")} />
                        Düzenle
                      </Link>
                    </Button>
                    <Button onClick={deletePatent} variant="destructive">
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-white")}
                      />
                      Patenti Sil
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

export default PatentCard;

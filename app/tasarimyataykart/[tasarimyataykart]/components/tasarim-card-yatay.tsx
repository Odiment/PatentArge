"use client";

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import { GiPlainCircle } from "react-icons/gi";
import { Chip, Avatar } from "@nextui-org/react";
import { EyeIcon } from "@/icons/EyeIcon";
import { EditIcon } from "@/icons/EditIcon";
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
import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimCardProps {
  data: TasarimlarX | null;
  bilgiler: TasarimlarX | null;
  tasarim_id: string;
  userid: string;
  tasarimResimler:
    | {
        tasarim_resim_url: string | null;
        tasarim_id: string;
      }[]
    | null;
}

const TasarimCardYatay: React.FC<TasarimCardProps> = ({
  data,
  bilgiler,
  tasarim_id,
  tasarimResimler,
  userid,
}) => {
  let tasarim_resimler_urlx: any;

  if (tasarimResimler != null) {
    var ilgiliTasarimResimler = tasarimResimler.reduce((result: any, thing) => {
      if (thing.tasarim_id.includes(`${tasarim_id}`)) {
        result.push(thing);
      }
      return result;
    }, []);

    let tasarim_resimler_url = ilgiliTasarimResimler.map(
      ({ tasarimresim_url }: any) => tasarimresim_url
    );
    tasarim_resimler_urlx = tasarim_resimler_url;
  }

  const supabase = createClientComponentClient<Database>();
  const [currentTasarimIndex, setCurrentTasarimIndex] = useState(0);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [yetki, setYetki] = useState<string | null>(null);
  const [pozisyon, setPozisyon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  let tasarimdurumu = `${bilgiler?.status}`;

  let yesil = tasarimdurumu === "tescil";
  let sari = tasarimdurumu === "basvuru";
  let kirmizi = tasarimdurumu === "iptal";

  const [tasarim_url, setTasarimUrl] = useState<TasarimlarX["tasarim_figure_url"]>(
    tasarim_resimler_urlx[currentTasarimIndex]
  );
  const [url, setUrl] = useState<TasarimlarX["tasarim_figure_url"]>(
    tasarim_resimler_urlx[currentTasarimIndex]
  );
  const [tasarim_figure_url, setTasarimFigureUrl] = useState<
  TasarimlarX["tasarim_figure_url"]
  >(tasarim_resimler_urlx[currentTasarimIndex]);

  useEffect(() => {
    async function downloadTasarimFigure(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("tasarimFigure")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setTasarimFigureUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (tasarim_url) downloadTasarimFigure(tasarim_url);
  }, [tasarim_url, supabase]);

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

  async function deleteTasarim() {
    try {
      const { error } = await supabase
        .from("tasarimlar")
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
  // Tasarım Resimler ******************
  const prevTasarimSlide = () => {
    const isFirstSlide = currentTasarimIndex === 0;
    const newIndex = isFirstSlide
      ? tasarim_resimler_urlx.length - 1
      : currentTasarimIndex - 1;
    setCurrentTasarimIndex(newIndex);
    setTasarimUrl(tasarim_resimler_urlx[currentTasarimIndex]);
  };

  const nextTasarimSlide = () => {
    const isLastSlide =
      currentTasarimIndex === tasarim_resimler_urlx.length - 1;
    const newIndex = isLastSlide ? 0 : currentTasarimIndex + 1;
    setCurrentTasarimIndex(newIndex);
    setTasarimUrl(tasarim_resimler_urlx[currentTasarimIndex]);
  };

  if (url === null || url === undefined) {
    resim_url =
      "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5ODkxODI3NSwiZXhwIjoxNzkzNTI2Mjc1fQ.lb7bGb--HDNNLsPPXqUNjPpZNPD7zlbrGoezrglkFEI&t=2023-11-02T09%3A44%3A35.926Z";
  } else {
    resim_url = tasarim_figure_url;
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
      <div className="rounded-lg justify-center">
        <Card
          key={data?.id}
          isBlurred
          className="border-1 border-primary hover:bg-primary/20"
          shadow="sm">
          <CardBody className="overflow-visible p-0">
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 justify-center">
              <div className="col-span-6 md:col-span-4 relative group">
                <Image
                  radius="lg"
                  width="100%"
                  height="100%"
                  alt="tasarim_figure"
                  className="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
                  src={resim_url!}
                  shadow="sm"
                />
                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                  <ChevronLeft onClick={prevTasarimSlide} size={30} />
                </div>

                <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                  <ChevronRight onClick={nextTasarimSlide} size={30} />
                </div>
              </div>

              <div className="flex flex-col col-span-6 md:col-span-8 content-start">
                <div className="flex justify-between ">
                  <div className="flex flex-col gap-0">
                    <p className="font-semibold text-2xl">
                      {bilgiler?.basvuru_no}
                    </p>
                    <p className="text-lg font-semibold text-foreground/80 ">
                      {bilgiler?.class_no}
                    </p>
                  </div>
                  {bilgiler?.status === "basvuru" && (
                    <Chip
                      onClick={onOpen}
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
                      onClick={onOpen}
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
                      onClick={onOpen}
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
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold text-center">
                {data?.tasarim_title}
              </ModalHeader>
              <ModalBody>
                <Image
                  isZoomed
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  height="100%"
                  alt="tasarim_figure"
                  className="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
                  src={resim_url!}
                />
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
                      <td>Tasarım Sınıfları:</td>
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
                  <Link href={`/tasarimdetay/${bilgiler?.referans_no}`}>
                    <EyeIcon className={cn(iconClasses, "text-white")} />
                    Tasasrım Detay
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
                    <Button variant="destructive">
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-white")}
                      />
                      Tasarımı Sil
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

export default TasarimCardYatay;

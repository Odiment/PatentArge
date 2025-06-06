"use client";

import { useCallback, useEffect, useState } from "react";
import { Chip, Avatar } from "@nextui-org/react";
import classNames from "classnames";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditIcon } from "@/icons/EditIcon";
import { GiPlainCircle } from "react-icons/gi";
import { Separator } from "@/components/ui/separator";
import {
  /*   Button,
  Link, */
  /*   Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure, */
  cn,
} from "@nextui-org/react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Card,
  CardBody,
  /*   CardHeader,
  CardFooter, */
  Image,
} from "@nextui-org/react";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentCardProps {
  bilgiler: any | null;
  patent_id: any;
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
  user: any;
  istemler:
    | {
        istem_no: any;
        istem_metni: any;
      }[]
    | null;
    secilenPatentTarifname: {
        tarifname: any;
    }[] | null
}

const PatentDetayCard: React.FC<PatentCardProps> = ({
  bilgiler,
  patent_id,
  patentResimler,
  user,
  istemler,
  secilenPatentTarifname,
}) => {
  const supabase = createClientComponentClient<Database>();
  const [currentPatentIndex, setCurrentPatentIndex] = useState(0);
  const [yetki, setYetki] = useState<string | null>(null);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const getProfile = useCallback(async () => {
    try {
      /* setLoading(true); */

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq("id", user?.id!)
        .single();

      /*       if (error && status !== 406) {
        throw error;
      } */

      if (data) {
        setYetki(data.yetki);
      }
    } catch (error) {
      /* alert(`getProfile hatası - UserMenu ${error}`); */
      console.log(`profil çekme hatası ${error}`);
    } finally {
      /*  setLoading(false); */
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  let istem_no = istemler?.map(({ istem_no }: any) => istem_no);
  let istem_metni = istemler?.map(({ istem_metni }: any) => istem_metni);
  let tarifname = secilenPatentTarifname?.map(({ tarifname }: any) => tarifname);

  let patent_resimler_urlx: any;

  if (patentResimler != null) {
    var ilgiliPatentResimler = patentResimler.reduce((result: any, thing) => {
      if (thing.patent_id.includes(`${patent_id}`)) {
        result.push(thing);
      }
      return result;
    }, []);

    let patent_resimler_url = ilgiliPatentResimler.map(
      ({ patent_resim_url }: any) => patent_resim_url
    );
    patent_resimler_urlx = patent_resimler_url;
  }

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
  } else {
    resim_url = patent_figure_url;
  }

  let durum_bilgisi: string = "belirsiz";
  if (bilgiler[0]?.status === "basvuru") {
    durum_bilgisi = "Başvuru Sürecinde";
  } else if (bilgiler[0]?.status === "tescil") {
    durum_bilgisi = "Tescil";
  } else if (bilgiler[0]?.status === "iptal") {
    durum_bilgisi = "İptal";
  }

  const sortedIstemler = istemler?.sort((a, b) => a.istem_no - b.istem_no);

  return (
    <>
      {yetki === "admin" && (
        <>
          <Button asChild className="bg-yellow-700 hover:bg-yellow-400">
            <Link href={`/ptcard/${bilgiler[0].referans_no}`}>
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
            className=" hover:bg-primary/20">
            <CardBody>
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
                      {bilgiler[0]?.patent_title}
                    </h3>
                    <p className="font-semibold text-2xl">
                      {bilgiler[0]?.basvuru_no}
                    </p>
                    <p className="text-lg font-semibold text-foreground/80 ">
                      {bilgiler[0]?.class_no}
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-2xl">
                {bilgiler[0]?.firma_unvan}
              </p>
              {bilgiler[0]?.patent_durumu !== null && (
                <div>
                  <p className="font-light">Durum Açıklaması:</p>
                  <p className="font-semibold">{bilgiler[0]?.patent_durumu}</p>
                </div>
              )}
              {bilgiler[0]?.ozet !== null && (
                <div>
                  <p className="font-light">Özet:</p>
                  <p className="font-semibold">{bilgiler[0]?.ozet}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler[0]?.id}
            isBlurred
            className="border-1 border-primary  hover:bg-primary/20">
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
          </Card>
        </div>
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
                <h3 className="text-xl font-bold text-foreground/90">
                  PATENT KORUMA KAPSAMI - ÖZEL NOTLAR
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg justify-center">
          <Card
            shadow="sm"
            key={bilgiler?.id}
            isBlurred
            className="hover:bg-primary/20">
            <CardBody>
              <div className="flex justify-between ">
                <div className="flex flex-col gap-0">
                  <h3 className="text-xl font-bold text-foreground/90">
                    İSTEMLER
                  </h3>
                  {sortedIstemler?.map((item, index) => (
                    <>
                      <Separator className="bg-primary" />
                      <h3
                        key={index}
                        className="text-xl font-bold text-foreground/90">
                        {item.istem_no}
                      </h3>
                      <p className="font-light">{item.istem_metni}</p>
                    </>
                  ))}
                </div>
                <div></div>
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
                  <h3 className="text-xl font-bold text-foreground/90">
                    TARİFNAME
                  </h3>
                  <>
                    <Separator className="bg-primary" />
                    <p className="font-light">{tarifname}</p>
                  </>
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
export default PatentDetayCard;

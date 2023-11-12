"use client";

import { EditIcon } from "@/icons/EditIcon";
import { useCallback, useEffect, useState } from "react";

import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
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
import { Database } from "@/app/supabase";
interface PatentCardProps {
  eksikPatent: string | null;
  eksikPatentRef: string | null;
  userid: string;
  eksikPatentId: string;
  firma_unvan: any;
}

const EksikBilgiPatent: React.FC<PatentCardProps> = ({
  eksikPatent,
  eksikPatentRef,
  userid,
  eksikPatentId,
  firma_unvan,
}) => {
  const [sil, setSil] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  let resim_url: string =
    "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5ODkxODI3NSwiZXhwIjoxNzkzNTI2Mjc1fQ.lb7bGb--HDNNLsPPXqUNjPpZNPD7zlbrGoezrglkFEI&t=2023-11-02T09%3A44%3A35.926Z";

  async function deletePatent() {
    
    try {
        const { error } = await supabase
          .from("patent_tarifname")
          .delete()
          .eq("patent_id", eksikPatentId);
  
        /*  setSil(true); */
  
        if (error) throw error;
        window.location.reload();
      } catch (error: any) {
        alert(error.message);
      }
    
    try {
      const { error } = await supabase
        .from("patentler")
        .delete()
        .eq("id", eksikPatentId);

      /*  setSil(true); */

      if (error) throw error;
     /*  window.location.reload(); */
    } catch (error: any) {
      alert(error.message);
    }
   
  }

  return (
    <>
      <div key={eksikPatentId} className="aspect-square rounded-lg ">
        <Card
          shadow="sm"
          key={eksikPatentId}
          isPressable
          className="border-1 border-primary bg-primary/5 hover:bg-primary/20">
          <CardBody className="overflow-visible p-0">
            <Button
              asChild
              className="bg-primary hover:bg-primary/50 border-2 border-emerald-500">
              <Link href={`/ptcard/${eksikPatentRef}`}>
                <EditIcon className={cn(iconClasses, "text-white")} />
                Patenti Düzenle
              </Link>
            </Button>
            <b className="text-center">{eksikPatent}</b>
            <Image
              isZoomed
              shadow="sm"
              radius="lg"
              width="100%"
              height="100%"
              alt="PatentFigure"
              className="relative opacity-0 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
              src={resim_url}
            />
            <b className="text-center">{firma_unvan}</b>
          </CardBody>
          <CardFooter
            onClick={deletePatent}
            className="flex text-small justify-between  h-20 border-2 border-red-500">
            <DeleteDocumentIcon className={cn(iconClasses, "text-white")} />
            Patenti Sil
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
export default EksikBilgiPatent;

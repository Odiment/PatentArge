"use client";

//import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
const iconClasses =
"text-xl text-default-500 pointer-events-none flex-shrink-0";  

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaSinifFormProps {
  secilenMarka: MarkalarX[] | null;
  secilenMarkaSinif: {
    id: any;
    marka_id: any;
    basvurulan_sinif_no: any | null;
    basvurulan_sinif_aciklamasi: any | null;    
}
  session: Session | null;
  secilenMarkaSurecBilgileri: {
    marka_id: any;
    islem_tarihi: any;
    islem: any;
    islem_aciklamasi: any;
}[];
}



const formSchema = z.object({
  basvurulan_sinif_no: z.string(),
  basvurulan_sinif_aciklamasi: z.string(),
});

const siniflar = [
  { id: "01", label: "01" },
  { id: "02", label: "02" },
  { id: "03", label: "03" },
  { id: "04", label: "04" },
  { id: "05", label: "05" },
  { id: "06", label: "06" },
  { id: "07", label: "07" },
  { id: "08", label: "08" },
  { id: "09", label: "09" },
  { id: "10", label: "10" },
  { id: "11", label: "11" },
  { id: "12", label: "12" },
  { id: "13", label: "13" },
  { id: "14", label: "14" },
  { id: "15", label: "15" },
  { id: "16", label: "16" },
  { id: "17", label: "17" },
  { id: "18", label: "18" },
  { id: "19", label: "19" },
  { id: "20", label: "20" },
  { id: "21", label: "21" },
  { id: "22", label: "22" },
  { id: "23", label: "23" },
  { id: "24", label: "24" },
  { id: "25", label: "25" },
  { id: "26", label: "26" },
  { id: "27", label: "27" },
  { id: "28", label: "28" },
  { id: "29", label: "29" },
  { id: "30", label: "30" },
  { id: "31", label: "31" },
  { id: "32", label: "32" },
  { id: "33", label: "33" },
  { id: "34", label: "34" },
  { id: "35", label: "35" },
  { id: "36", label: "36" },
  { id: "37", label: "37" },
  { id: "38", label: "38" },
  { id: "39", label: "39" },
  { id: "40", label: "40" },
  { id: "41", label: "41" },
  { id: "42", label: "42" },
  { id: "43", label: "43" },
  { id: "44", label: "44" },
  { id: "45", label: "45" },
] as const;

export default function MarkaSinifFormEdit({
  secilenMarka,
  secilenMarkaSinif,
  session,
  secilenMarkaSurecBilgileri,
}: MarkaSinifFormProps) {

  const supabase = createClientComponentClient<Database>();
  const [sil, setSil] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [firma_ad, setFirma_ad] = useState<string | null>(null);
  const [marka, setMarka] = useState<string | null>(null);
  const [deger, setDeger] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [basvuruNo, setBasvuruNo] = useState<string | null>(null);
  const [referansNo, setReferansNo] = useState<string | null>(null);
  const [sonIslem, setSonIslem] = useState<string | null>(null);
  const [sonIslemTarihi, setSonIslemTarihi] = useState<string | null>(null);
  const [basvuruTarihi, setBasvuruTarihi] = useState<string | null>(null);
  const [classNo, setClassNo] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [markaSinifNo, setMarkaSinifNo] = useState<string | null>(null);
  const [markaSinifAciklamasi, setMarkaSinifAciklamasi] = useState<string | null>(null);

  const [formStep, setFormStep] = React.useState(0);

  const user = session?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basvurulan_sinif_no: "",
      basvurulan_sinif_aciklamasi: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  


  async function updateMarka(values: z.infer<typeof formSchema>) {

    if (secilenMarka != null) {
     

      if (secilenMarkaSinif != null) {
        if (values.basvurulan_sinif_no === "") {
          values.basvurulan_sinif_no =
          secilenMarkaSinif.basvurulan_sinif_no!;
        }
        if (values.basvurulan_sinif_aciklamasi === "") {
          values.basvurulan_sinif_aciklamasi =
          secilenMarkaSinif.basvurulan_sinif_aciklamasi!;
        }

        try {
          setLoading(true);

          let { error } = await supabase
            .from("marka_siniflar")
            .update({
                basvurulan_sinif_no: values.basvurulan_sinif_no,
                basvurulan_sinif_aciklamasi: values.basvurulan_sinif_aciklamasi,
            })
            .eq("id", secilenMarkaSinif.id);
          if (error) throw error;
          window.location.reload();
        } catch (error) {
          alert("HATA: Marka güncelemesi gerçekleştirilemedi!");
        } finally {
          setLoading(false);
        }
      }
    }
  }

  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from("marka_siniflar")
        .delete()
        .eq("id", secilenMarkaSinif.id);

      setSil(true);

      if (error) throw error;
      /* window.location.reload(); */
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="h-full max-w-3xl mx-auto">
      {secilenMarka != null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateMarka)}
            className="">
            <div className="space-y-2 w-full col-span-2">
{/*               <div>
                <h3 className="text-lg font-bold">
                  Marka Sınıf Bilgileri Giriş Formu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Marka Başvurusunda yer alan sınıflar ve ayrıntılarını
                  girebilir veya güncelleyebilirsiniz
                </p>
              </div> */}
              <Separator className="bg-primary" />
            </div>
            <FormField
                name="basvurulan_sinif_no"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sınıf No</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarkaSinif.basvurulan_sinif_no}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Marka sınıf numaralarını giriniz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              name="basvurulan_sinif_aciklamasi"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sınıf açıklamalarını giriniz...</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-black resize italic"
                      {...field}
                      placeholder={`${secilenMarkaSinif?.basvurulan_sinif_aciklamasi}`}
                    />
                  </FormControl>
                  <FormDescription>
                    Marka başvurusu esnasında girilen sınıfların detaylarını
                    giriniz....
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center">
              <Button
                className="bg-emerald-500 font-bold"
                size="lg"
                type="submit"
                disabled={isLoading}>
                Marka Sınıf Bilgisi Güncelle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
              <Button
              className="bg-red-500 font-bold hover:bg-red-300"
              size="lg"
              /* disabled={loading} */
              onClick={() => deleteMarka()}>
              Sınıfı Sil
              <DeleteDocumentIcon className={cn(iconClasses, "text-white")} />
            </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

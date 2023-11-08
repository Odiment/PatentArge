"use client";

//import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
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
/* type MarkaSiniflarX = Database["public"]["Tables"]["marka_siniflar"]["Row"]; */

interface MarkaSinifFormProps {
  secilenMarka: MarkalarX[] | null;
  secilenMarkaSiniflar: {
    marka_id: any;
    basvurulan_sinif_no: any;
    basvurulan_sinif_aciklamasi: any;
}[] | null  

  session: Session | null;
}

const formSchema = z.object({
/*   firma_ad: z.string(),
  marka: z.string(),
  basvuru_no: z.string(),
  basvuru_tarihi: z.string(),
  class_no: z.string(),
  status: z.string(),
  referans_no: z.string(),
  son_islem: z.string(),
  son_islem_tarihi: z.string(),
  durum_aciklamasi: z.string(),
  marka_id: z.string(), */
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

export default function MarkaSinifForm({
  secilenMarka,
  secilenMarkaSiniflar,
  session,
}: MarkaSinifFormProps) {
  const supabase = createClientComponentClient<Database>();

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
/*       firma_ad: "",
      marka: "",
      basvuru_no: "",
      basvuru_tarihi: "",
      class_no: "",
      status: "",
      referans_no: "",
      son_islem: "",
      son_islem_tarihi: "",
      durum_aciklamasi: "",
      marka_id: "", */
      basvurulan_sinif_no: "",
      basvurulan_sinif_aciklamasi: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmitYeniMarkaSinif(veri: z.infer<typeof formSchema>) {
    if(secilenMarka != null) { 
   /*  if (firmabilgi != null) {
      var secilenFirma = firmabilgi.reduce((result: any, thing) => {
        if (thing.firma_unvan.includes(`${veri.firma_unvan}`)) {
          result.push(thing);
        }
        return result;
      }, []);
      secilenFirmax = secilenFirma;
    } */

    /* const frontId = `${veri.marka}-${Math.random()}`;
    setDeger(frontId); */
    /* setMarka(veri.marka.toLowerCase()); */
    setMarkaSinifNo(veri.basvurulan_sinif_no);
    setMarkaSinifAciklamasi(veri.basvurulan_sinif_aciklamasi);
    /* setFirma_ad(veri.firma_ad); */
   /*  setFirma_id(secilenMarka[0].id); */

    try {
      const { data, error, status } = await supabase
        .from("marka_siniflar")
        .insert({
          marka_id: secilenMarka[0].id,
          basvurulan_sinif_no: veri.basvurulan_sinif_no,
          basvurulan_sinif_aciklamasi: veri.basvurulan_sinif_aciklamasi,
/*           deger: frontId,
          referans_no: veri.referans,
          firma_id: secilenFirma[0].id,
          firma_unvan: secilenFirma[0].firma_unvan,
          basvuru_no: null,
          basvuru_tarihi: null,
          class_no: "111",
          durum_aciklamasi: null,
          marka_durumu: null,
          son_islem: null,
          son_islem_tarihi: null,
          status: null, */
        })
        .single();

      if (error) throw error;

      toast({
        variant: "affirmative",
        title: "Veri tabanında marka için bir id oluşturuldu",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri.basvurulan_sinif_no, null, 2)}
            </code>
          </pre>
        ),
      });

      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  }
}


  async function updateMarka(values: z.infer<typeof formSchema>) {
   /*  values.firma_ad = values.firma_ad.toLowerCase(); */

    if (secilenMarka != null) {
      /* if (values.marka === "") {
        values.marka = secilenMarka[0].marka!;
      }
      if (values.basvuru_no === "") {
        values.basvuru_no = secilenMarka[0].basvuru_no!;
      }
      if (values.basvuru_tarihi === "") {
        values.basvuru_tarihi = secilenMarka[0].basvuru_tarihi!;
      }
      if (values.class_no === "") {
        values.class_no = secilenMarka[0].class_no!;
      }
      if (values.status === "") {
        values.status = secilenMarka[0].status!;
      }
      if (values.referans_no === "") {
        values.referans_no = secilenMarka[0].referans_no!;
      }
      if (values.firma_ad === "") {
        values.firma_ad = secilenMarka[0].firma_ad!;
      }
      if (values.son_islem === "") {
        values.son_islem = secilenMarka[0].son_islem!;
      }
      if (values.son_islem_tarihi === "") {
        values.son_islem_tarihi = secilenMarka[0].son_islem_tarihi!;
      }
      if (values.durum_aciklamasi === "") {
        values.durum_aciklamasi = secilenMarka[0].durum_aciklamasi!;
      } */

      if (secilenMarkaSiniflar != null) {
        if (values.basvurulan_sinif_no === "") {
          values.basvurulan_sinif_no =
            secilenMarkaSiniflar[0].basvurulan_sinif_no!;
        }
        if (values.basvurulan_sinif_aciklamasi === "") {
          values.basvurulan_sinif_aciklamasi =
            secilenMarkaSiniflar[0].basvurulan_sinif_aciklamasi!;
        }

        try {
          setLoading(true);

          let { error } = await supabase
            .from("marka_siniflar")
            .update({
                basvurulan_sinif_no: values.basvurulan_sinif_no,
                basvurulan_sinif_aciklamasi: values.basvurulan_sinif_aciklamasi,
              /* marka: values.marka,
              basvuru_no: values.basvuru_no,
              basvuru_tarihi: values.basvuru_tarihi,
              class_no: values.class_no,
              status: values.status,
              referans_no: values.referans_no,
              firma_ad: values.firma_ad,
              son_islem: values.son_islem,
              son_islem_tarihi: values.son_islem_tarihi,
              durum_aciklamasi: values.durum_aciklamasi, */
            })
            .eq("marka_id", secilenMarka[0].id);
          if (error) throw error;
          window.location.reload();
          /* alert("Marka Güncellendi!") */
        } catch (error) {
          alert("HATA: Marka güncelemesi gerçekleştirilemedi!");
        } finally {
          setLoading(false);
        }
      }
    }
  }

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      {secilenMarka != null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitYeniMarkaSinif)}
            className="space-y-8 pb-10">
            <div className="space-y-2 w-full col-span-2">
              <div>
                <h3 className="text-lg font-bold">
                  Marka Sınıf Bilgileri Giriş Formu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Marka Başvurusunda yer alan sınıflar ve ayrıntılarını
                  girebilir veya güncelleyebilirsiniz
                </p>
              </div>
              <Separator className="bg-primary" />
            </div>
            <FormField
              control={form.control}
              name="basvurulan_sinif_no"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Sınıf Numarası</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value
                            ? siniflar.find(
                                (sinif) => sinif.label === field.value
                              )?.label
                            : "Sınıf seçiniz..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Sınıf no seçiniz..." />
                        <CommandEmpty>Sınıf bulunamadı.</CommandEmpty>
                        <CommandGroup>
                          {siniflar.map((item) => (
                            <CommandItem
                              value={item.label}
                              key={item.label}
                              onSelect={() => {
                                form.setValue(
                                  "basvurulan_sinif_no",
                                  item.label
                                );
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Marka başvurusundaki sınıf numaraları...
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
                      placeholder={`${secilenMarka[0]?.durum_aciklamasi!}`}
                    />
                    {/*                   <Input
                    className="font-black italic "
                    disabled={isLoading}
                    placeholder={`${secilenMarka[0].durum_aciklamasi}`}
                    {...field}
                  /> */}
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
                Marka Sınıf Bilgisi Ekle / Güncelle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

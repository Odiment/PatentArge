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
//import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaFormProps {
  secilenMarka: MarkalarX[] | null;
  /*   categories: string*/
  session: Session | null;
}

const formSchema = z.object({
  firma_ad: z.string(),
  marka: z.string(),
  basvuru_no: z.string(),
  basvuru_tarihi: z.string(),
  class_no: z.string(),
  status: z.string(),
  referans_no: z.string(),
  son_islem: z.string(),
  son_islem_tarihi: z.string(),
  durum_aciklamasi: z.string(),
});

export default function MarkaForm({ secilenMarka, session }: MarkaFormProps) {
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

  const [formStep, setFormStep] = React.useState(0);

  const user = session?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firma_ad: "",
      marka: "",
      basvuru_no: "",
      basvuru_tarihi: "",
      class_no: "",
      status: "",
      referans_no: "",
      son_islem: "",
      son_islem_tarihi: "",
      durum_aciklamasi: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function updateMarka(values: z.infer<typeof formSchema>) {
    values.firma_ad = values.firma_ad.toLowerCase();

    if (secilenMarka != null) {
      if (values.marka === "") {
        /* console.log('values.marka === EMPTY') */
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
      }

      try {
        setLoading(true);

        let { error } = await supabase
          .from("markalar")
          .update({
            marka: values.marka,
            basvuru_no: values.basvuru_no,
            basvuru_tarihi: values.basvuru_tarihi,
            class_no: values.class_no,
            status: values.status,
            referans_no: values.referans_no,
            firma_ad: values.firma_ad,
            son_islem: values.son_islem,
            son_islem_tarihi: values.son_islem_tarihi,
            durum_aciklamasi: values.durum_aciklamasi,
          })
          .eq("id", secilenMarka[0].id);
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

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      {secilenMarka != null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateMarka)}
            className="space-y-8 pb-10">
            <div className="space-y-2 w-full col-span-2">
              <div>
                <h3 className="text-lg font-bold">
                  Marka Bilgileri Giriş Ekranı
                </h3>
                <p className="text-sm text-muted-foreground">
                  Marka Başvurusuna ilişkin detay bilgileri girebilir veya
                  güncelleyebilirsiniz
                </p>
              </div>
              <Separator className="bg-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="marka"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Marka</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].marka}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Markanın Kurum sicilindeki alfabetik yazımı
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="basvuru_no"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başvuru No</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].basvuru_no}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Marka başvuru numarasını giriniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="basvuru_tarihi"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başvuru Tarihi</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].basvuru_tarihi}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kurum başvuru tarihini giriniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="class_no"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sınıf No</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].class_no}`}
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
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marka Durumunu Seçiniz</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-black italic">
                          <SelectValue
                            placeholder={`${secilenMarka[0].status}`}
                            {...field}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-black">
                            Durumlar
                          </SelectLabel>
                          <SelectItem value="tescil">Tescil</SelectItem>
                          <SelectItem value="iptal">İptal</SelectItem>
                          <SelectItem value="basvuru">Başvuru</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Tescil, İptal veya Başvuru seçeneklerinden birini seçiniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="referans_no"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-500">Referans No</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        /* disabled={isLoading} */
                        disabled
                        placeholder={`${secilenMarka[0].referans_no}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-red-500">
                      Referans güncellemesi için lütfen admine danışınız...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="son_islem"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Son İşlem/Hareket ADI</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].son_islem}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Başvuru ile ilgili Kurum nezdindeki son aksiyonun adını
                      giriniz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="son_islem_tarihi"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Son İşlem/Hareket TARİHİ</FormLabel>
                    <FormControl>
                      <Input
                        className="font-black italic"
                        disabled={isLoading}
                        placeholder={`${secilenMarka[0].son_islem_tarihi}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kurum son işlemin veya hareketin TARİHİNİ giriniz...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="durum_aciklamasi"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Son İşlem/Hareket DETAYLI AÇIKLAMASI</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-black resize italic"
                      {...field}
                      placeholder={`${secilenMarka[0].durum_aciklamasi}`}
                    />
                    {/*                   <Input
                    className="font-black italic "
                    disabled={isLoading}
                    placeholder={`${secilenMarka[0].durum_aciklamasi}`}
                    {...field}
                  /> */}
                  </FormControl>
                  <FormDescription>
                    Kurum nezdinde gerçekleşen son işlem, Kurumdan, Vekilden
                    veya Müvekkilden Beklenen işlem ve varsa işlemlere ilişkin
                    tarih açıklamaları giriniz....
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
                Marka Bilgilerni Güncelle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

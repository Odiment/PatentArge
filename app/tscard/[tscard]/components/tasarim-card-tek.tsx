"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { GiPlainCircle } from "react-icons/gi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Wand2,
  ArrowLeftSquare,
  ArrowRightSquare,
  PlusSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
/* import { Label } from '@/components/ui/label' */

import TasarimFigure from "./tasarim-figure";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/components/ui/use-toast";
/* import { UUID } from 'crypto' */

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimCardTek {
  veri: TasarimlarX[];
  tasarim_resimler: {
    tasarim_resim_url: string | null;
    id: string;
  }[];
  product_resimler: {
    product_resim_url: string | null;
    product_remote_url: string | null;
    id: string;
  }[];
}

const TasarimCardTek: React.FC<TasarimCardTek> = ({
  veri,
  tasarim_resimler,
  product_resimler,
}) => {
  const [sil, setSil] = useState<boolean>(false);

  let tasarim_resimler_url = tasarim_resimler.map(
    ({ tasarimresim_url }: any) => tasarimresim_url
  );
  let product_resimler_url = product_resimler.map(
    ({ product_resim_url }: any) => product_resim_url
  );
  let product_remote_resimler_url = product_resimler.map(
    ({ product_remote_url }) => product_remote_url
  );

  let tasarim_resimler_id = tasarim_resimler.map(({ id }) => id);
  let product_resimler_id = product_resimler.map(({ id }) => id);
  let veri_id = veri.map(({ id }) => id);
  let tasarim_title = veri.map(({ tasarim_title }) => tasarim_title);
  let basvuru_no = veri.map(({ basvuru_no }) => basvuru_no);
  let basvuru_tarihi = veri.map(({ basvuru_tarihi }) => basvuru_tarihi);
  let referans_no = veri.map(({ referans_no }) => referans_no);

  const supabase = createClientComponentClient<Database>();

  const [tasarim_figure_url, setTasarimFigureUrl] =
    useState<any[]>(tasarim_resimler_url);
  const [product_figure_url, setProductFigureUrl] =
    useState<any[]>(product_resimler_url);
  const [product_remote_figure_url, setProductFigureRemoteUrl] = useState<
    any[]
  >(product_remote_resimler_url);

  const [loading, setLoading] = useState(true);

  const [currentTasarimIndex, setCurrentTasarimIndex] = useState(0);

  let tasarimdurumu: any = "basvuru";
  if (veri != null) {
    let tasarimdurumux = veri.map(({ status }: any) => status);
    tasarimdurumu = tasarimdurumux;
  }

  let yesil = tasarimdurumu === "tescil";
  let sari = tasarimdurumu === "basvuru";
  let kirmizi = tasarimdurumu === "iptal";

  const FormSchema = z.object({
    product_remote_figure_url: z.string().min(2, {
      message: "Logo url must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function updateTasarimFigure({
    tasarim_figure_url,
  }: {
    tasarim_figure_url: any;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase
        .from("tasarim_resimler")
        .update({
          tasarim_resim_url: tasarim_figure_url,
        })
        .eq("id", tasarim_resimler_id[currentTasarimIndex]);
      if (error) throw error;
      toast({
        title: "Resim yükleme işlemi: başarıyla gerçekleşti:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              BAŞARIYLA GERÇEKLEŞTİ!!!
              {/* {JSON.stringify(tasarim_figure_url, null, 2)} */}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      alert(error);
      console.log("error");
      console.log(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  }

  async function updateProductFigure({
    product_figure_url,
  }: {
    product_figure_url: any;
  }) {
    try {
      setLoading(true);

      let { error } = await supabase
        .from("product_resimler")
        .update({
          product_resim_url: product_figure_url,
        })
        .eq("id", product_resimler_id[currentTasarimIndex]);
      if (error) throw error;
      /*  alert('Tasarım Figure güncellendi!') */
      toast({
        title: "Resim yükleme işlemi başarıyla gerçekleşti:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              ÜRÜN RESMİ BAŞARIYLA GÜNCELLENDİ
              {JSON.stringify(
                product_resimler_id[currentTasarimIndex],
                null,
                2
              )}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      /*  alert(error) */
      console.log("error");
      console.log(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  }

  async function updateProductRemoteFigure({
    /* product_figure_url, */
    product_remote_figure_url,
  }: {
    /* product_figure_url: string | null */
    product_remote_figure_url: string | null;
  }) {
    /*     console.log('product_remote_ur - updateProductFigure')
    console.log(product_remote_figure_url) */
    try {
      setLoading(true);

      let { error } = await supabase
        .from("product_resimler")
        .update({
          /*  product_resim_url: product_figure_url, */
          product_remote_url: product_remote_figure_url,
        })
        .eq("id", product_resimler_id[currentTasarimIndex]);
      if (error) throw error;
      /*  alert('Tasarım Figure güncellendi!') */
      toast({
        title: "Resim yükleme işlemi başarıyla gerçekleşti:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              ÜRÜN RESMİ BAŞARIYLA GÜNCELLENDİ
              {JSON.stringify(
                product_resimler_id[currentTasarimIndex],
                null,
                2
              )}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      /*  alert(error) */
      console.log("error");
      console.log(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  }

  async function deleteTasarim() {
    try {
      const { error } = await supabase
        .from("tasarimlar")
        .delete()
        .eq("id", veri[0]?.id);

      setSil(true);

      if (error) throw error;
      /* window.location.reload() */
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Yeni Bir TASARIM Resmi İçin Veritabanında Kayıt Oluşturulması ve PlaceHolder Resmi Eklenmesi
  async function newTasarimFigure() {
    try {
      const { error } = await supabase
        .from("tasarim_resimler")
        .insert({
          tasarim_id: veri[0].id,
          tasarim_resim_url:
            "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/avatars/aec65205-9440-482f-a539-9293fb7bb8a0-0.5921580138461082.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlYzY1MjA1LTk0NDAtNDgyZi1hNTM5LTkyOTNmYjdiYjhhMC0wLjU5MjE1ODAxMzg0NjEwODIucG5nIiwiaWF0IjoxNjk1NzU5Nzc4LCJleHAiOjE3MjcyOTU3Nzh9.rAgx9t6ExaXl_Y-M9peTr3IHA1TD9gHf9wsGd-PWsbw&t=2023-09-26T20%3A22%3A55.712Z",
        })
        .single();

      if (error) throw error;

      toast({
        variant: "affirmative",
        title: "Veri tabanında tasarim için bir id oluşturuldu",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri[0].id, null, 2)}
            </code>
          </pre>
        ),
      });

      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  }

  /*   const getirYeniTasarimResmi = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('product_resimler')
        .select(`product_resim_url`)
        .eq('id', veri[0].id)
        .single()

      if (error && status !== 406) {
        throw error
      }
    } catch (error) {
      alert(`Error loading tasarim data! ${error}`)
    } finally {
      setLoading(false)
    }
  }, [veri, supabase])

  useEffect(() => {
    getirYeniTasarimResmi()
  }, [veri, tasarim_resimler, getirYeniTasarimResmi])
  */

  async function deleteTasarimResim() {
    try {
      const { error } = await supabase
        .from("tasarim_resimler")
        .delete()
        .eq("id", tasarim_resimler_id[currentTasarimIndex]);

      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Yeni Bir Ürün Resmi İçin Veritabanında Kayıt Oluşturulması ve PlaceHolder Resmi Eklenmesi
  let null_url =
    "https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5NzM3Mjc3OSwiZXhwIjoxNzkxOTgwNzc5fQ.2s1NRy0rUx9cDryhuovBt4Uuy6BFQPrVCfzXDfp5BpI&t=2023-10-15T12%3A26%3A19.101Z";

  /* async function newProductFigure() {
    try {
      const { error } = await supabase
        .from('product_resimler')
        .insert({
          tasarim_id: veri[0].id,
          product_resim_url: 'placeholder',

          product_remote_url: null_url,
        })
        .single()

      if (error) throw error

      toast({
        variant: 'affirmative',
        title: 'Veri tabanında tasarim için bir id oluşturuldu',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri[0].id, null, 2)}
            </code>
          </pre>
        ),
      })

      window.location.reload()
    } catch (error: any) {
      alert(error.message)
    }
  } */

  /* const getirYeniUrunResmi = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('product_resimler')
        .select(`product_resim_url`)
        .eq('id', veri[0].id)
        .single()

      if (error && status !== 406) {
        throw error
      }
    } catch (error) {
      alert(`Error loading tasarim data! ${error}`)
    } finally {
      setLoading(false)
    }
  }, [veri, supabase])

  useEffect(() => {
    getirYeniUrunResmi()
  }, [product_resimler, getirYeniUrunResmi]) */

  /*  async function deleteUrunResim() {
    try {
      const { error } = await supabase
        .from('product_resimler')
        .delete()
        .eq('id', product_resimler_id[currentTasarimIndex])

      if (error) throw error
      window.location.reload()
    } catch (error: any) {
      alert(error.message)
    }
  } */

  // slider functions *************
  // Tasarim Resimler ******************
  const prevTasarimSlide = () => {
    const isFirstSlide = currentTasarimIndex === 0;
    const newIndex = isFirstSlide
      ? tasarim_resimler_url.length - 1
      : currentTasarimIndex - 1;
    setCurrentTasarimIndex(newIndex);
  };

  const nextTasarimSlide = () => {
    const isLastSlide = currentTasarimIndex === tasarim_resimler_url.length - 1;
    const newIndex = isLastSlide ? 0 : currentTasarimIndex + 1;
    setCurrentTasarimIndex(newIndex);
  };

  // Ürün (Product) Resimler ******************
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const prevProductSlide = () => {
    const isFirstSlide = currentProductIndex === 0;
    const newIndex = isFirstSlide
      ? product_resimler_id.length - 1
      : currentProductIndex - 1;
    setCurrentProductIndex(newIndex);
  };

  const nextProductSlide = () => {
    const isLastSlide = currentProductIndex === product_resimler_id.length - 1;
    const newIndex = isLastSlide ? 0 : currentProductIndex + 1;
    setCurrentProductIndex(newIndex);
  };

  // ************* *************

  let durum_bilgisi: any = "default";
  if (veri != null) {
    let durum_bilgisix = veri.map(({ status }: any) => status);
    durum_bilgisi = durum_bilgisix;

    if (durum_bilgisi === "basvuru") {
      durum_bilgisi = "Başvuru Sürecinde";
    } else if (durum_bilgisi === "tescil") {
      durum_bilgisi = "Tescil Edildi";
    } else if (durum_bilgisi === "iptal") {
      durum_bilgisi = "İptal/Geçersiz";
    }
  }

  return (
    <>
      {sil === true && redirect("/tsrm/yeni")}

      <div className="flex flex-col gap-x-2">
        <div className="flex flex-col items-center pt-5 gap-2">
          <div className="items-center gap-4">
            <Card className="outline-0 focus:ring-2 hover:ring-2 ring-primary transition duration-300 rounded-lg border-2">
              <CardContent className="pt-4">
                <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg">
                  <div className="flex items-center justify-between mt-5 pb-2">
                    <Button
                      className="bg-sky-600 font-bold"
                      size="lg"
                      onClick={prevTasarimSlide}>
                      <ArrowLeftSquare className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      className="bg-green-500 font-bold"
                      size="lg"
                      onClick={newTasarimFigure}>
                      <PlusSquare className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      className="bg-red-500 font-bold"
                      size="lg"
                      onClick={deleteTasarimResim}>
                      <Trash2 className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      className="bg-sky-600 font-bold"
                      size="lg"
                      onClick={nextTasarimSlide}>
                      <ArrowRightSquare className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <TasarimFigure
                    uid={veri_id}
                    tasarim_url={tasarim_resimler_url[currentTasarimIndex]}
                    size={400}
                    txt="Tasarim Resmi Yükle"
                    onUpload={(tasarim_url: any) => {
                      setTasarimFigureUrl(tasarim_url);
                    }}
                  />
                  {/*  <div className="flex items-center justify-between mt-5 pb-2">
                  <Button
                    className="bg-sky-600 font-bold"
                    size="lg"
                    onClick={prevProductSlide}
                  >
                    <ArrowLeftSquare className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-green-500 font-bold"
                    size="lg"
                    onClick={newProductFigure}
                  >
                    <PlusSquare className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-red-500 font-bold"
                    size="lg"
                    onClick={deleteUrunResim}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-sky-600 font-bold"
                    size="lg"
                    onClick={nextProductSlide}
                  >
                    <ArrowRightSquare className="w-4 h-4 ml-2" />
                  </Button>
                </div> */}
                  {/*                 <ProductFigure
                  uid={veri_id}
                 
                  product_url={product_resimler_url[currentProductIndex]}
                  product_remote_url={
                    product_remote_figure_url[currentProductIndex]
                  }
                  size={400}
                  txt="Ürün Resmi Yükle"
                  onUpload={(product_url: any) => {
                    setProductFigureUrl(product_url)
                   
                  }}
                /> */}
                </div>
              </CardContent>
              <CardFooter className="w-[450px] flex-col items-start">
                <>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(updateProductRemoteFigure)}
                      className="w-full space-y-6">
                      <FormField
                        control={form.control}
                        name="product_remote_figure_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ürün resmi internet linki</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  product_remote_figure_url[
                                    currentProductIndex
                                  ]!
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              İnternet üzerinden erişilebilecek ürün url sini
                              giriniz ...
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/50 font-bold">
                        Ürün Resmi İnternet Linkini Kaydet
                      </Button>
                    </form>
                  </Form>
                  <div className="flex flex-col ">
                    <p className="gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold text-center">
                      {tasarim_title}
                    </p>

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
                      <p className="font-semibold text-2xl">{basvuru_no}</p>
                      <p className="font-semibold text-2xl">{basvuru_tarihi}</p>

                      <p className="text-sm text-primary/80">
                        Ref: {referans_no}
                      </p>
                    </div>
                  </div>
                </>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-x-8 grid-cols-3">
            <Button
              className="bg-orange-500 hover:bg-yellow-200 font-bold gap-4"
              onClick={() =>
                updateTasarimFigure({
                  tasarim_figure_url,
                })
              }>
              Tasarim Resim Güncelle
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-200 font-bold gap-4"
              onClick={() =>
                updateProductFigure({
                  product_figure_url,
                })
              }>
              Ürün Resmi Güncelle
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
            <Button
              className="bg-red-500 font-bold hover:bg-red-300 gap-4"
              onClick={() => deleteTasarim()}>
              Tasarim Kaydını Sil
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TasarimCardTek;

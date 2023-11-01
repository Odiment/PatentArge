"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Link } from "@nextui-org/react";
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
import { toast } from "@/components/ui/use-toast";
/* import MarkaCardTek from '@/components/marka-card-tek'
import MarkaForm from '@/components/marka-form' */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface YeniMarkaProps {
  firmabilgi:
    | {
        id: string;
        firma: string | null;
        firma_ad: string | null;
        firma_unvan: string;
      }[]
    | null;
}

const FormSchema = z.object({
  marka: z.string().min(2, {
    message: "Marka en az 2 karakterden oluşmalıdır.",
  }),

  firma_unvan: z.string({
    required_error: "Lütfen bir firma seçiniz.",
  }),

  referans: z.string().min(3, {
    message: "Referans en az 3 karakterden oluşmalıdır.",
  }),
});

export default function YeniMarka({ firmabilgi }: YeniMarkaProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const supabase = createClientComponentClient<Database>();

  const [basvuruNo, setBasvuruNo] = useState<string | null>(null);
  const [marka, setMarka] = useState<string | null>(null);
  const [markalar, setMarkalar] = useState<string | null>(null);
  const [buton, setButon] = useState<string | null>(null);
  const [markaId, setMarkaId] = useState<string | null>(null);
  const [deger, setDeger] = useState<string | null>(null);
  const [referans, setReferans] = useState<string | null>(null);
  const [firma_ad, setFirma_ad] = useState<string | null>(null);
  const [firma_id, setFirma_id] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [logo_url, setLogoUrl] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  let firmalarx: string[];
  let secilenFirmax: any;

  if (firmabilgi != null) {
    let firmalar = firmabilgi.map(({ firma_unvan }) => firma_unvan);
    firmalarx = firmalar;
  }

  async function onSubmitYeniMarka(veri: z.infer<typeof FormSchema>) {
    if (firmabilgi != null) {
      var secilenFirma = firmabilgi.reduce((result: any, thing) => {
        if (thing.firma_unvan.includes(`${veri.firma_unvan}`)) {
            result.push(thing);
        }
        return result;
      }, []);
      secilenFirmax = secilenFirma
    }

    const frontId = `${veri.marka}-${Math.random()}`;
    setDeger(frontId);
    setMarka(veri.marka.toLowerCase());
    setReferans(veri.referans);
    setFirma_ad(secilenFirma[0].firma_ad);
    /* setFirma_ad(veri.firma_ad); */
    setFirma_id(secilenFirma[0].id);

    try {
      const { data, error, status } = await supabase
        .from("markalar")
        .insert({
          marka: veri.marka,
          deger: frontId,
          referans_no: veri.referans,
          firma_id: secilenFirma[0].id,
          firma_unvan: secilenFirma[0].firma_unvan,
        })
        .single();

      if (error) throw error;

      toast({
        variant: "affirmative",
        title: "Veri tabanında marka için bir id oluşturuldu",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri.marka, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error: any) {
      alert(error.message);
    }
  }

  const getirYeniMarka = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("markalar")
        .select(`marka, deger, id, referans_no, logo_url`)
        .eq("deger", deger!)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUid(data.id);
        /* setMarkalar(data); */
      }
    } catch (error) {
      alert(`Error loading marka data!", ${error}`);
    } finally {
      setLoading(false);
    }
  }, [deger, supabase]);

  useEffect(() => {
    getirYeniMarka();
  }, [marka, getirYeniMarka]);

  return (
    <section className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        <h1 className="text-xl font-extrabold">Marka Giriş Ekranı</h1>
      </div>
      {uid ? (
        redirect(`/tmcard/${referans}`)
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitYeniMarka)}
            className="w-2/3 space-y-6 bg-background">
            <FormField
              control={form.control}
              name="marka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black italic"
                      placeholder="marka ibaresini giriniz..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Küçük harfler kullanarak markanızı yazınız...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firma_unvan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firma Adını Seçiniz</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-primary italic">
                        <SelectValue placeholder="Kayıtlı firmalar arasından seçim yapınız..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="italic">
                    {firmalarx.map((firma_unvan, index) => (
                        <SelectItem
                          value={firma_unvan}
                          key={index}
                          className="italic">
                          {firma_unvan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Firma kayıtlı değilse lütfen yeni bir firma kaydı
                    oluşturunuz <Link href="/idea/new">Yeni Firma Kaydı</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referans No</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black italic"
                      placeholder="marka referans numaranız"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Markanıza erişim için bir referans numarası giriniz...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-primary hover:bg-primary/50">
              Oluştur
            </Button>
          </form>
        </Form>
      )}
    </section>
  );
}

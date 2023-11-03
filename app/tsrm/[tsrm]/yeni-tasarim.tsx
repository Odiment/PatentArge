'use client'

import { useCallback, useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Link } from '@nextui-org/react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface YeniTasarimProps {
    firmabilgi: {
        id: string;
        firma: string | null;
        firma_ad: string | null;
        firma_unvan: string;
    }[] | null
  }

const FormSchema = z.object({
  tasarim_title: z.string().min(2, {
    message: 'Tasarım başlığı en az 2 karakterden oluşmalıdır.',
  }),
  firma_unvan: z.string({
    required_error: 'Lütfen bir firma seçiniz.',
  }),
  referans: z.string().min(3, {
    message: 'Referans en az 3 karakterden oluşmalıdır.',
  }),
})

export default function YeniTasarim({ firmabilgi }: YeniTasarimProps) {
  /*   console.log('firmabilgi')
  console.log(firmabilgi) */


/*   console.log('firmalar')
  console.log(firmalar) */

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const supabase = createClientComponentClient<Database>()

/*   const [basvuruNo, setBasvuruNo] = useState<string | null>(null) */
  const [tasarim_title, setTasarim_title] = useState<string | null>(null)
  /* const [tasarimlar, setTasarimlar] = useState<string | null>(null) */
  /* const [buton, setButon] = useState<string | null>(null) */
  const [deger, setDeger] = useState<string | null>(null)
  const [referans, setReferans] = useState<string | null>(null)
const [firma_ad, setFirma_ad] = useState<string | null>(null)
  const [firma_id, setFirma_id] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
 /*  const [tasarim_figure_url, setTasarimFigureUrl] = useState<string | null>(null) */
  const [uid, setUid] = useState<string | null>(null)

 /*  let firma: string | null */
  let firmalarx: string[]
  let secilenFirmax: any

  if(firmabilgi != null) {
  let firmalar = firmabilgi.map(({ firma_unvan }) => firma_unvan)
  firmalarx = firmalar
}

  async function onSubmitYeniTasarim(veri: z.infer<typeof FormSchema>) {
    /*     console.log('veri.firma')
    console.log(veri.firma) */
    if(firmabilgi != null) {
    var secilenFirma = firmabilgi.reduce((result: any, thing) => {
      if (thing.firma_unvan.includes(`${veri.firma_unvan}`)) {
        result.push(thing)
      }
      return result
    }, [])
    secilenFirmax = secilenFirma
}

/*     console.log('secilenFirma.id')
    console.log(secilenFirma[0].id)

    console.log('secilenFirma.firma_unvan')
    console.log(secilenFirma[0].firma_unvan) */

    const frontId = `${veri.tasarim_title}-${Math.random()}`
    setDeger(frontId)
    setTasarim_title(veri.tasarim_title)
    setReferans(veri.referans)
    setFirma_ad(secilenFirma[0].firma_ad)
    /* setFirma_ad(veri.firma_ad) */
    setFirma_id(secilenFirma[0].id)

    try {
      const { data, error, status } = await supabase
        .from('tasarimlar')
        .insert({
          tasarim_title: veri.tasarim_title,
          deger: frontId,
          referans_no: veri.referans,
          firma_id: secilenFirma[0].id,
          firma_unvan: secilenFirma[0].firma_unvan,
        })
        .single()

      if (error) throw error

      toast({
        variant: 'affirmative',
        title: 'Veri tabanında tasarım için bir id oluşturuldu',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri.tasarim_title, null, 2)}
            </code>
          </pre>
        ),
      })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const getirYeniTasarim = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('tasarimlar')
        .select(`tasarim_title, deger, id, referans_no, tasarim_figure_url`)
        .eq('deger', deger!)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUid(data.id)
      }
    } catch (error) {
      alert('Error loading tasarim data!')
    } finally {
      setLoading(false)
    }
  }, [deger, supabase])

  useEffect(() => {
    getirYeniTasarim()
  }, [tasarim_title, getirYeniTasarim])

  return (
    <section className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div>
        <h1 className="text-xl font-extrabold">Tasarım Giriş Ekranı</h1>
      </div>
      {uid ? (
        redirect(`/ptcard/${referans}`)
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitYeniTasarim)}
            className="w-2/3 space-y-6 bg-background"
          >
            <FormField
              control={form.control}
              name="tasarim_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasarım başlığı</FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary italic"
                      placeholder="BULUŞ BAŞLIĞINI giriniz..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                  Tasarım kaydı için BULUŞ BAŞLIĞINI yazınız...
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-primary italic">
                        <SelectValue placeholder="Kayıtlı firmalar arasından seçim yapınız..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="italic">
                      {firmalarx.map((firma_unvan, index) => (
                        <SelectItem key={index} value={firma_unvan}>
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
                      className="text-primary italic"
                      placeholder="Tasarım referans numaranız"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Petent kayıtlarına erişim için bir referans numarası
                    giriniz...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Oluştur</Button>
          </form>
        </Form>
      )}
    </section>
  )
}

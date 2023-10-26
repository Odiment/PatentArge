'use client'

//import axios from "axios";
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
//import { useToast } from "@/components/ui/use-toast";
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Database } from '@/app/database.types'

import PatentFigure from './components/patent-figure'

interface PatentFormProps {
  secilenPatent: string
  session: Session | null
}

const formSchema = z.object({
  firma_ad: z.string(),
  patent_title: z.string(),
  basvuru_no: z.string(),
  basvuru_tarihi: z.string(),
  class_no: z.string(),
  status: z.string(),
  referans_no: z.string(),
})

export default function PatentForm({
  secilenPatent,
  session,
}: PatentFormProps) {
  const supabase = createClientComponentClient<Database>()

  const [loading, setLoading] = useState(true)
  const [firma_ad, setFirma_ad] = useState<string | null>(null)
  const [patent_title, setPatent_title] = useState<string | null>(null)
  /*   const [deger, setDeger] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null) */
  const [basvuruNo, setBasvuruNo] = useState<string | null>(null)
  const [referansNo, setReferansNo] = useState<string | null>(null)
  const [basvuruTarihi, setBasvuruTarihi] = useState<string | null>(null)
  const [classNo, setClassNo] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  /* const [logoUrl, setLogoUrl] = useState<string | null>(null) */

  const [formStep, setFormStep] = React.useState(0)

  const user = session?.user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firma_ad: '',
      patent_title: '',
      basvuru_no: '',
      basvuru_tarihi: '',
      class_no: '',
      status: '',
      referans_no: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  async function updatePatent(values: z.infer<typeof formSchema>) {
    values.firma_ad = values.firma_ad.toLowerCase()

    if (values.patent_title === '') {
      /* console.log('values.patent_title === EMPTY') */
      values.patent_title = secilenPatent[0].patent_title
    }
    if (values.basvuru_no === '') {
      values.basvuru_no = secilenPatent[0].basvuru_no
    }
    if (values.basvuru_tarihi === '') {
      values.basvuru_tarihi = secilenPatent[0].basvuru_tarihi
    }
    if (values.class_no === '') {
      values.class_no = secilenPatent[0].class_no
    }
    if (values.status === '') {
      values.status = secilenPatent[0].status
    }
    if (values.referans_no === '') {
      values.referans_no = secilenPatent[0].referans_no
    }
    if (values.firma_ad === '') {
      values.firma_ad = secilenPatent[0].firma_ad
    }

    try {
      setLoading(true)

      let { error } = await supabase
        .from('patentler')
        .update({
          patent_title: values.patent_title,
          basvuru_no: values.basvuru_no,
          basvuru_tarihi: values.basvuru_tarihi,
          class_no: values.class_no,
          status: values.status,
          referans_no: values.referans_no,
          /* referans_no: values.referans_no, */
          firma_ad: values.firma_ad,
        })
        .eq('id', secilenPatent[0].id)
      if (error) throw error
      window.location.reload()
      /* alert("Patent Güncellendi!") */
    } catch (error) {
      alert('HATA: Patent güncelemesi gerçekleştirilemedi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updatePatent)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">
                Patent Bilgileri Giriş Ekranı
              </h3>
              <p className="text-sm text-muted-foreground">
                Patent Başvurusuna ilişkin detay bilgileri girebilir veya
                güncelleyebilirsiniz
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="patent_title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Patent</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].patent_title}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Patentin Kurum sicilindeki alfabetik yazımı
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
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].basvuru_no}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Patent başvuru numarasını giriniz.
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
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].basvuru_tarihi}`}
                      {...field}
                      /* onChange={(e) => setBasvuruTarihi(e.target.value)} */
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
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].class_no}`}
                      {...field}
                      /*  onChange={(e) => setClassNo(e.target.value)} */
                    />
                  </FormControl>
                  <FormDescription>
                    Patent sınıf numaralarını giriniz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patent Durum Bilgisi</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].status}`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Kurum sicilindeki durum bilgisini kısaca yazınız
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
                  <FormLabel>Referans No</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].referans_no}`}
                      {...field}
                      /*  onChange={(e) => setReferansNo(e.target.value)} */
                    />
                  </FormControl>
                  <FormDescription>
                    Patent sınıf numaralarını giriniz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="firma_ad"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başvuru Sahibi - Firma Adı</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`${secilenPatent[0].firma_ad}`}
                      {...field}
                      /*  onChange={(e) => setReferansNo(e.target.value)} */
                    />
                  </FormControl>
                  <FormDescription>
                    Güncel başvuru sahibi firma bilgisini giriniz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button
              className="bg-emerald-500 font-bold"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              Patent Bilgilerni Güncelle
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

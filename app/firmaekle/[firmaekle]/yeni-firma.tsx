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
/* import MarkaCardTek from '@/components/marka-card-tek'
import MarkaForm from '@/components/marka-form' */

/* import { Database } from '@/database.types' */
/* import IdeaMarkaLogo from './ideamarka-logo' */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const FormSchema = z.object({
  firma_unvan: z.string().min(5, {
    message: 'Firma Ünvanı en az 5 karakterden oluşmalıdır.',
  }),
  firma_adres: z.string().min(5, {
    message: 'Firma adresi en az 5 karakterden oluşmalıdır.',
  }),
})

interface FirmaBilgiProps {
  firmabilgi: any | null
  firma: any | null
}

export default function YeniFirma({ firmabilgi }: FirmaBilgiProps) {
  let firmalar = firmabilgi.map(({ firma }: FirmaBilgiProps) => firma)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const supabase = createClientComponentClient<Database>()

  async function onSubmitYeniFirma(veri: z.infer<typeof FormSchema>) {
    try {
      const { data, error, status } = await supabase
        .from('firmalar')
        .insert({
          firma_adres: veri.firma_adres,
          firma_unvan: veri.firma_unvan,
        })
        .single()

      if (error) throw error

      toast({
        variant: 'affirmative',
        title: 'Veri tabanında marka için bir id oluşturuldu',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4 ">
            <code className="text-white">
              {JSON.stringify(veri.firma_unvan, null, 2)}
            </code>
          </pre>
        ),
      })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <section className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8 pt-6 md:py-10 ">
      <div className=" text-xl font-extrabold">
        <h1>Yeni Firma Kaydı Oluşturma Ekranı</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitYeniFirma)}
          className="w-2/3 space-y-6 bg-background"
        >
          <FormField
            control={form.control}
            name="firma_unvan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firmanın Tam Ünvanı</FormLabel>
                <FormControl>
                  <Input
                    className="font-black italic"
                    placeholder="Sicilde kayıtlı ünvan bilgisi"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Firmanın ticaret sicil ve Kurum kayıtlarındaki resmi tam ünvan
                  bilgisini giriniz...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firma_adres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firma Adresi</FormLabel>
                <FormControl>
                  <Input
                    className="font-black italic"
                    placeholder="Firma adresini giriniz..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Marka sahibi firmanın resmi yazışma adresini giriniz...
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
    </section>
  )
}

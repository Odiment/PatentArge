'use client'

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import spaceman from '@/assets/spaceman-1.png'
import { Database } from '@/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import MarkaLogo from './marka-logo'

/* import { AiFillCheckCircle } from 'react-icons/ai'
import { BsFillXCircleFill } from 'react-icons/bs'
import { HiDotsCircleHorizontal } from 'react-icons/hi' */
import { GiPlainCircle } from 'react-icons/gi'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { toast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  tp_logo_url: z.string().min(2, {
    message: 'Logo url must be at least 2 characters.',
  }),
  tp_avatar: z.string().min(2, {
    message: 'Logo url must be at least 2 characters.',
  }),
})

interface MarkaCardTek {
  data: Database[]
}

const MarkaCardTek: React.FC<MarkaCardTek> = ({ data }) => {
  const supabase = createClientComponentClient<Database>()
  /*   console.log('data')
  console.log(data)
  console.log('data[0].logo_url')
  console.log(data[0].logo_url) */

  const [logo_url, setLogoUrl] = useState<string | null>(
    data && data[0].logo_url
  )
  const [tp_logo_url, setTPLogoUrl] = useState<string | null>(
    data[0].tp_logo_url
  )
  const [tp_avatar, setTPAvatar] = useState<string | null>(data[0].tp_avatar)
  /*  const [name, setName] = useState<string | null>(data[0].name) */

  const [loading, setLoading] = useState(true)

  let markadurumu = `${data[0].status}`

  let yesil = markadurumu === 'tescil'
  let sari = markadurumu === 'basvuru'
  let kirmizi = markadurumu === 'iptal'

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('data')
    console.log(data)
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
          <code className="text-white">
            {JSON.stringify(data.logo_url, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  async function updateMarkaLogo({
    name,
    deger,
    logo_url,
    tp_logo_url,
    tp_avatar,
  }: {
    name: string | null
    deger: string | null
    logo_url: string | null
    tp_logo_url: string | null
    tp_avatar: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase
        .from('markalar')
        .update({
          name: name,
          deger: deger,
          logo_url: logo_url,
          tp_logo_url: tp_logo_url,
          tp_avatar: tp_avatar,
        })
        .eq('id', data[0].id)
      if (error) throw error
      /*  alert('Marka Logo güncellendi!') */
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(data.logo_url, null, 2)}
            </code>
          </pre>
        ),
      })
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
    window.location.reload()
  }

  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from('markalar')
        .delete()
        .eq('id', data[0].id)

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  /*   console.log(`url={data[0].logo_url} = ${data[0].logo_url}`) */
  /* console.log(`logo_url = ${logo_url}`) */

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center pt-5">
        <div className="items-center gap-4">
          {/* <Link href="/tmtable"> */}
          <Card className="outline-0 focus:ring-2 hover:ring-2 ring-primary transition duration-300 rounded-lg border-2">
            <CardContent className="pt-4">
              <div className="aspect-square relative bg-foreground/5 dark:bg-background rounded-lg">
                {/* <Image
                  src={data[0].logo_url}
                  alt=""
                  fill
                  className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
                /> */}
                <MarkaLogo
                  uid={data[0].id}
                  url={logo_url}
                  tp_logo_url={tp_logo_url}
                  size={400}
                  onUpload={(url) => {
                    setLogoUrl(url)
                    updateMarkaLogo({
                      name,
                      deger,
                      logo_url,
                    })
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="w-[450px] flex-col items-start">
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(updateMarkaLogo)}
                    className="w-full space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="tp_logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kurum BÜYÜK logo link</FormLabel>
                          <FormControl>
                            <Input placeholder={tp_logo_url} {...field} />
                          </FormControl>
                          <FormDescription>
                            Kurum detay marka sayfasındaki BÜYÜK logo linki ...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tp_avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kurum KÜÇÜK logo link</FormLabel>
                          <FormControl>
                            <Input placeholder={tp_avatar} {...field} />
                          </FormControl>
                          <FormDescription>
                            Kurum sonuç listesindeki KÜÇÜK logo linki ...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/50 font-bold"
                    >
                      Kurum Marka Linklerini Kaydet
                    </Button>
                  </form>
                </Form>
                <div className="grid grid-cols-2 gap-4">
                  <p className="font-bold text-lg text-sky-400">
                    {data[0].marka}
                  </p>
                  <p className="font-semibold text-lg">{data[0].basvuru_no}</p>
                  <p className="text-lg text-primary/80">{data[0].class_no}</p>
                  <p className="text-lg text-primary/80">
                    {data[0].basvuru_tarihi}
                  </p>
                  <p className="text-sm text-primary/80">
                    {data[0].referans_no}
                  </p>
                  <p className="text-sm text-primary/80 text-sky-400">
                    {data[0].firma_ad}
                  </p>
                  <p
                    className={classNames('text-sm', 'font-bold', 'flex', {
                      'text-emerald-500': yesil,
                      'text-yellow-500': sari,
                      'text-red-500': kirmizi,
                    })}
                  >
                    <GiPlainCircle size={200} className="h-5 w-5" />
                    {data[0].status}
                  </p>
                </div>
              </>
            </CardFooter>
          </Card>
          {/* </Link> */}
        </div>
        <div clasName="flex justify-center items-center">
          {/* <p>logo_url: {logo_url}</p> */}
          {/* <p>name: {name}</p> */}
          <Button
            className="bg-yellow-500 hover:bg-yellow-200 font-bold"
            size="lg"
            /* disabled={loading} */
            onClick={() => updateMarkaLogo({ name, logo_url })}
          >
            Güncelle
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
          <Button
            className="bg-red-500 font-bold hover:bg-red-300"
            size="lg"
            /* disabled={loading} */
            onClick={() => deleteMarka({ name, logo_url })}
          >
            Markayı Sil
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MarkaCardTek

'use client'

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/database.types'
import { GiPlainCircle } from 'react-icons/gi'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Wand2,
  ArrowLeftSquare,
  ArrowRightSquare,
  PlusSquare,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import PatentFigure from './patent-figure'
import ProductFigure from './product-figure'

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
import { UUID } from 'crypto'

interface PatentCardTek {
  veri: Database[]
}

const PatentCardTek: React.FC<PatentCardTek> = ({
  veri,
  patent_resimler,
  product_resimler,
}) => {
  let patent_resimler_url = patent_resimler.map(
    ({ patent_resim_url }) => patent_resim_url
  )
  let product_resimler_url = product_resimler.map(
    ({ product_resim_url }) => product_resim_url
  )
  let product_remote_resimler_url = product_resimler.map(
    ({ product_remote_url }) => product_remote_url
  )
  /*   console.log('product_resimler')
  console.log(product_resimler)
  console.log('product_remote_resimler_url')
  console.log(product_remote_resimler_url) */

  let patent_resimler_id = patent_resimler.map(({ id }) => id)
  let product_resimler_id = product_resimler.map(({ id }) => id)

  /*   console.log('patent_resimler')
  console.log(patent_resimler)
  console.log('patent_resimler_url')
  console.log(patent_resimler_url)
  console.log('patent_resimler_id')
  console.log(patent_resimler_id) */

  const supabase = createClientComponentClient<Database>()

  const [patent_figure_url, setPatentFigureUrl] = useState<string | null>(
    patent_resimler_url
  )
  const [product_figure_url, setProductFigureUrl] = useState<string | null>(
    product_resimler_url
  )
  const [product_remote_figure_url, setProductFigureRemoteUrl] = useState<
    string | null
  >(product_remote_resimler_url)

  const [loading, setLoading] = useState(true)

  const [currentPatentIndex, setCurrentPatentIndex] = useState(0)

  let patentdurumu = `${veri[0].status}`

  let yesil = patentdurumu === 'tescil'
  let sari = patentdurumu === 'basvuru'
  let kirmizi = patentdurumu === 'iptal'

  const FormSchema = z.object({
    product_remote_figure_url: z.string().min(2, {
      message: 'Logo url must be at least 2 characters.',
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function updatePatentFigure({
    patent_figure_url,
  }: {
    patent_figure_url: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase
        .from('patent_resimler')
        .update({
          patent_resim_url: patent_figure_url,
        })
        .eq('id', patent_resimler_id[currentPatentIndex])
      if (error) throw error
      toast({
        title: 'Resim yükleme işlemi: başarıyla gerçekleşti:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              BAŞARIYLA GERÇEKLEŞTİ!!!
              {/* {JSON.stringify(patent_figure_url, null, 2)} */}
            </code>
          </pre>
        ),
      })
    } catch (error) {
      alert(error)
      console.log('error')
      console.log(error)
    } finally {
      setLoading(false)
    }
    window.location.reload()
  }

  async function updateProductFigure({
    product_figure_url,
    product_remote_figure_url,
  }: {
    product_figure_url: string | null
    product_remote_figure_url: string | null
  }) {
    console.log('product_remote_ur - updateProductFigure')
    console.log(product_remote_figure_url)
    try {
      setLoading(true)

      let { error } = await supabase
        .from('product_resimler')
        .update({
          product_resim_url: product_figure_url,
          product_remote_url: product_remote_figure_url,
        })
        .eq('id', product_resimler_id[currentPatentIndex])
      if (error) throw error
      /*  alert('Patent Figure güncellendi!') */
      toast({
        title: 'Resim yükleme işlemi başarıyla gerçekleşti:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              ÜRÜN RESMİ BAŞARIYLA GÜNCELLENDİ
              {JSON.stringify(product_resimler_id[currentPatentIndex], null, 2)}
            </code>
          </pre>
        ),
      })
    } catch (error) {
      /*  alert(error) */
      console.log('error')
      console.log(error)
    } finally {
      setLoading(false)
    }
    window.location.reload()
  }

  async function deletePatent() {
    try {
      const { error } = await supabase
        .from('patentler')
        .delete()
        .eq('id', veri[0].id)

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  // Yeni Bir PATENT Resmi İçin Veritabanında Kayıt Oluşturulması ve PlaceHolder Resmi Eklenmesi
  async function newPatentFigure({
    yeniResimUrl,
  }: {
    yeniResimUrl: string | null
  }) {
    try {
      const { error } = await supabase
        .from('patent_resimler')
        .insert({
          patent_id: veri[0].id,
          patent_resim_url:
            'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/avatars/aec65205-9440-482f-a539-9293fb7bb8a0-0.5921580138461082.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlYzY1MjA1LTk0NDAtNDgyZi1hNTM5LTkyOTNmYjdiYjhhMC0wLjU5MjE1ODAxMzg0NjEwODIucG5nIiwiaWF0IjoxNjk1NzU5Nzc4LCJleHAiOjE3MjcyOTU3Nzh9.rAgx9t6ExaXl_Y-M9peTr3IHA1TD9gHf9wsGd-PWsbw&t=2023-09-26T20%3A22%3A55.712Z',
        })
        .single()

      if (error) throw error

      toast({
        variant: 'affirmative',
        title: 'Veri tabanında patent için bir id oluşturuldu',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri[0].id, null, 2)}
            </code>
          </pre>
        ),
      })

      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  const getirYeniPatentResmi = useCallback(async () => {
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
      alert('Error loading patent data!', error)
    } finally {
      setLoading(false)
    }
  }, [patent_resimler, supabase])

  useEffect(() => {
    getirYeniPatentResmi()
  }, [patent_resimler, getirYeniPatentResmi])

  async function deletePatentResim() {
    try {
      const { error } = await supabase
        .from('patent_resimler')
        .delete()
        .eq('id', patent_resimler_id[currentPatentIndex])

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  // Yeni Bir Ürün Resmi İçin Veritabanında Kayıt Oluşturulması ve PlaceHolder Resmi Eklenmesi
  let null_url =
    'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5NzM3Mjc3OSwiZXhwIjoxNzkxOTgwNzc5fQ.2s1NRy0rUx9cDryhuovBt4Uuy6BFQPrVCfzXDfp5BpI&t=2023-10-15T12%3A26%3A19.101Z'

  async function newProductFigure({
    yeniResimUrl,
  }: {
    yeniResimUrl: string | null
  }) {
    try {
      const { error } = await supabase
        .from('product_resimler')
        .insert({
          patent_id: veri[0].id,
          product_resim_url: 'placeholder',

          product_remote_url: null_url,
        })
        .single()

      if (error) throw error

      toast({
        variant: 'affirmative',
        title: 'Veri tabanında patent için bir id oluşturuldu',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
            <code className="text-white">
              {JSON.stringify(veri[0].id, null, 2)}
            </code>
          </pre>
        ),
      })

      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  const getirYeniUrunResmi = useCallback(async () => {
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
      alert('Error loading patent data!', error)
    } finally {
      setLoading(false)
    }
  }, [product_resimler, supabase])

  useEffect(() => {
    getirYeniUrunResmi()
  }, [product_resimler, getirYeniUrunResmi])

  async function deleteUrunResim() {
    try {
      const { error } = await supabase
        .from('product_resimler')
        .delete()
        .eq('id', product_resimler_id[currentPatentIndex])

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  // slider functions *************
  // Patent Resimler ******************
  const prevPatentSlide = () => {
    const isFirstSlide = currentPatentIndex === 0
    const newIndex = isFirstSlide
      ? patent_resimler_url.length - 1
      : currentPatentIndex - 1
    setCurrentPatentIndex(newIndex)
  }

  const nextPatentSlide = () => {
    const isLastSlide = currentPatentIndex === patent_resimler_url.length - 1
    const newIndex = isLastSlide ? 0 : currentPatentIndex + 1
    setCurrentPatentIndex(newIndex)
  }

  // Ürün (Product) Resimler ******************
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  const prevProductSlide = () => {
    const isFirstSlide = currentProductIndex === 0
    const newIndex = isFirstSlide
      ? product_resimler_id.length - 1
      : currentProductIndex - 1
    setCurrentProductIndex(newIndex)
  }

  const nextProductSlide = () => {
    const isLastSlide = currentProductIndex === product_resimler_id.length - 1
    const newIndex = isLastSlide ? 0 : currentProductIndex + 1
    setCurrentProductIndex(newIndex)
  }

  console.log('product_remote_figure_url[currentProductIndex]')
  console.log(product_remote_figure_url[currentProductIndex])

  // ************* *************

  let durum_bilgisi: string | null
  if (veri[0].status === 'basvuru') {
    durum_bilgisi = 'Başvuru Sürecinde'
  } else if (veri[0].status === 'tescil') {
    durum_bilgisi = 'Tescil Edildi'
  } else if (veri[0].status === 'iptal') {
    durum_bilgisi = 'İptal/Geçersiz'
  }

  return (
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
                    onClick={prevPatentSlide}
                  >
                    <ArrowLeftSquare className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-green-500 font-bold"
                    size="lg"
                    onClick={newPatentFigure}
                  >
                    <PlusSquare className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-red-500 font-bold"
                    size="lg"
                    onClick={deletePatentResim}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    className="bg-sky-600 font-bold"
                    size="lg"
                    onClick={nextPatentSlide}
                  >
                    <ArrowRightSquare className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <PatentFigure
                  uid={veri[0].id}
                  patent_url={patent_resimler_url[currentPatentIndex]}
                  size={400}
                  txt="Patent Resmi Yükle"
                  onUpload={(patent_url) => {
                    setPatentFigureUrl(patent_url)
                    /*                     updatePatentFigure({
                        patent_figure_url
                    }) */
                  }}
                />
                <div className="flex items-center justify-between mt-5 pb-2">
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
                </div>
                <ProductFigure
                  uid={veri[0].id}
                  /* url={product_resimler[currentProductIndex]} */
                  product_url={product_resimler_url[currentProductIndex]}
                  product_remote_url={
                    product_remote_figure_url[currentProductIndex]
                  }
                  size={400}
                  txt="Ürün Resmi Yükle"
                  onUpload={(product_url) => {
                    setProductFigureUrl(product_url)
                    /*                     updateProductFigure({
                      product_figure_url,
                    }) */
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="w-[450px] flex-col items-start">
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(updateProductFigure)}
                    className="w-full space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="product_remote_figure_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ürün resmi internet linki</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                product_remote_figure_url[currentProductIndex]
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
                      className="w-full bg-primary hover:bg-primary/50 font-bold"
                    >
                      Ürün Resmi İnternet Linkini Kaydet
                    </Button>
                  </form>
                </Form>
                <div className="flex flex-col ">
                  <p className="gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold text-center">
                    {veri[0].patent_title}
                  </p>

                  <div className="flex gap-2">
                    <p
                      className={classNames('text-2xl', 'font-bold', {
                        'text-emerald-500': yesil,
                        'text-yellow-500': sari,
                        'text-red-500': kirmizi,
                      })}
                    >
                      <GiPlainCircle size={200} className="h-7 w-7" />
                    </p>
                    {/*  <p>Durum:</p> */}
                    <p
                      className={classNames('text-2xl', 'font-bold', {
                        'text-emerald-500': yesil,
                        'text-yellow-500': sari,
                        'text-red-500': kirmizi,
                      })}
                    >
                      {durum_bilgisi}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl">
                      {veri[0].basvuru_no}
                    </p>
                    <p className="font-semibold text-2xl">
                      {veri[0].basvuru_tarihi}
                    </p>

                    <p className="text-sm text-primary/80">
                      Ref: {veri[0].referans_no}
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
              updatePatentFigure({
                patent_figure_url,
              })
            }
          >
            Patent Resim Güncelle
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-200 font-bold gap-4"
            onClick={() =>
              updateProductFigure({
                product_figure_url,
              })
            }
          >
            Ürün Resmi Güncelle
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
          <Button
            className="bg-red-500 font-bold hover:bg-red-300 gap-4"
            onClick={() =>
              deletePatent({
                patent_figure_url,
              })
            }
          >
            Patent Kaydını Sil
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PatentCardTek

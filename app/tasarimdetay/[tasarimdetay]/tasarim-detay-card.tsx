'use client'

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { DeleteDocumentIcon } from '@/icons/DeleteDocumentIcon'
import { EditIcon } from '@/icons/EditIcon'
import { GiPlainCircle } from 'react-icons/gi'
import {
  /*   Button,
  Link, */
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  cn,
} from '@nextui-org/react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
} from '@nextui-org/react'

import { Database } from '@/app/supabase'

type TasarimlarX = Database['public']['Tables']['tasarimlar']['Row']

interface TasarimCardProps {
    data: TasarimlarX | null
    bilgiler: TasarimlarX | null
    userid: string
  }

const TasarimDetayCard: React.FC<TasarimCardProps> = ({ data, bilgiler, userid }) => {
  const supabase = createClientComponentClient<Database>()
  const [yetki, setYetki] = useState<string | null>(null)

  const [url, setUrl] = useState<TasarimlarX['tasarim_figure_url']>(bilgiler?.tasarim_figure_url!)
  const [loading, setLoading] = useState(true)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0'

  let tasarimdurumu = `${bilgiler?.status}`

  let yesil = tasarimdurumu === 'tescil'
  let sari = tasarimdurumu === 'basvuru'
  let kirmizi = tasarimdurumu === 'iptal'

  useEffect(() => {
    async function downloadTasarimResim(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('tasarimResim')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadTasarimResim(url)
  }, [url, supabase])

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq('id', userid)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
/*         setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url) */
        setYetki(data.yetki)
/*         setPozisyon(data.pozisyon) */
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }, [userid, supabase])

  useEffect(() => {
    getProfile()
  }, [userid, getProfile])

  async function deleteTasarim() {
    try {
      const { error } = await supabase
        .from('tasarimlar')
        .delete()
        .eq('id', bilgiler?.id!)

      if (error) throw error
      window.location.reload()
    } catch (error: any) {
      alert(error.message)
    }
  }

  let resim_url: string | null

  if (url === null) {
    resim_url = bilgiler?.tasarim_figure_url!
  } else {
    resim_url = url
  }

  return (
    <>
      <div key={data?.id} className="aspect-square rounded-lg ">
        <Card
          shadow="sm"
          key={data?.id}
          isPressable
          onPress={onOpen}
          className="border-1 border-primary bg-primary/5 hover:bg-primary/20"
        >
          <CardBody className="overflow-visible p-0">
            <Image
              isZoomed
              shadow="sm"
              radius="lg"
              width="100%"
              height="100%"
              alt="TasarimResim"
              className="relative opacity-0 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
              src={resim_url!}
            />
          </CardBody>
          <CardFooter className="flex text-small justify-between  h-20 ">
            <b className="text-left">{data?.tasarim_title}</b>
            <b
              className={classNames('text-xl', 'font-bold', 'flex', {
                'text-emerald-500': yesil,
                'text-yellow-500': sari,
                'text-red-500': kirmizi,
              })}
            >
              <GiPlainCircle size={200} className="h-5 w-5" />
              {/* {bilgiler.status} */}
            </b>
          </CardFooter>
        </Card>
      </div>

      {/******* MODAL GÖRÜNÜMÜ *******/}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl justify-center items-center border-b border-primary text-primary font-bold">
                {data?.tasarim_title}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Image
                      className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
                      src={resim_url!}
                      alt="TasarimResim"
                      width={200}
                      height={200}
                    />
                    <p>Durum:</p>
                    <p
                      className={classNames('text-xl', 'font-bold', {
                        'text-emerald-500': yesil,
                        'text-yellow-500': sari,
                        'text-red-500': kirmizi,
                      })}
                    >
                      <GiPlainCircle size={200} className="h-5 w-5" />
                      {bilgiler?.status}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl">
                      {bilgiler?.basvuru_no}
                    </p>
                    <p>Başvuru Tarihi:</p>
                    <p className="text-xl text-primary/80 font-bold">
                      {bilgiler?.basvuru_tarihi}
                    </p>
                    <p>Sınıflar:</p>
                    <p className="text-xl text-primary/80">
                      {bilgiler?.class_no}
                    </p>

                    <p className="text-sm text-primary/80">
                      Ref: {bilgiler?.referans_no}
                    </p>
                    <p className="text-sm text-primary/80 text-sky-400">
                      {bilgiler?.firma_ad}
                    </p>
                  </div>
                </div>
                <div>
                  <p>{bilgiler?.tasarim_durumu}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div>
                  <Button asChild className="bg-primary hover:bg-primary/50">
                    <Link href={`/tasarimdetay/${bilgiler?.referans_no}`}>
                      <EditIcon className={cn(iconClasses, 'text-white')} />
                      Tasarım Detay
                    </Link>
                  </Button>
                  {yetki === 'admin' && (
                    <>
                      <Button
                        asChild
                        className="bg-yellow-700 hover:bg-yellow-400"
                      >
                        <Link href={`/tmcard/${bilgiler?.referans_no}`}>
                          <EditIcon className={cn(iconClasses, 'text-white')} />
                          Düzenle
                        </Link>
                      </Button>
                      <Button onClick={deleteTasarim} variant="destructive">
                        <DeleteDocumentIcon
                          className={cn(iconClasses, 'text-white')}
                        />
                        Tasarımı Sil
                      </Button>
                    </>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
export default TasarimDetayCard

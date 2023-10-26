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

import { Database } from '@/app/database.types'

interface PatentCard {
  data: Database[]
  bilgiler: Database[]
}

type Patentler = Database['public']['Tables']['patentler']['Row']

const PatentDetayCard: React.FC<PatentCard> = ({ data, bilgiler, user }) => {
  const supabase = createClientComponentClient<Database>()
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [yetki, setYetki] = useState<string | null>(null)
  const [pozisyon, setPozisyon] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [url, setUrl] = useState<Markalar['logo_url']>(bilgiler.logo_url)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0'

  let markadurumu = `${bilgiler.status}`

  let yesil = markadurumu === 'tescil'
  let sari = markadurumu === 'basvuru'
  let kirmizi = markadurumu === 'iptal'

  useEffect(() => {
    async function downloadMarkaLogo(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('markaLogo')
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

    if (url) downloadMarkaLogo(url)
  }, [url, supabase])

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
        setYetki(data.yetki)
        setPozisyon(data.pozisyon)
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function deleteMarka() {
    try {
      const { error } = await supabase
        .from('markalar')
        .delete()
        .eq('id', bilgiler.id)

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  let resim_url: string | null

  if (url === null) {
    resim_url = bilgiler.tp_logo_url
  } else {
    resim_url = url
  }

  return (
    <>
      <div key={data.id} className="aspect-square rounded-lg ">
        <Card
          shadow="sm"
          key={data.id}
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
              alt="MarkaLogo"
              className="relative opacity-0 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
              src={resim_url}
            />
          </CardBody>
          <CardFooter className="flex text-small justify-between  h-20 ">
            <b className="text-left">{data.marka}</b>
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
                {data.marka}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Image
                      className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
                      src={resim_url}
                      alt="MarkaLogo"
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
                      {bilgiler.status}
                    </p>
                  </div>
                  <div>
                    {/*                     <p className="font-bold text-lg text-sky-400">
                      {data.marka}
                    </p> */}
                    <p className="font-semibold text-2xl">
                      {bilgiler.basvuru_no}
                    </p>
                    <p>Başvuru Tarihi:</p>
                    <p className="text-xl text-primary/80 font-bold">
                      {bilgiler.basvuru_tarihi}
                    </p>
                    {/* <p className="font-semibold text-lg">{yetki}</p> */}
                    <p>Sınıflar:</p>
                    <p className="text-xl text-primary/80">
                      {bilgiler.class_no}
                    </p>

                    <p className="text-sm text-primary/80">
                      Ref: {bilgiler.referans_no}
                    </p>
                    <p className="text-sm text-primary/80 text-sky-400">
                      {bilgiler.firma_ad}
                    </p>
                  </div>
                </div>
                <div>
                  <p>{bilgiler.durum_aciklamasi}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <div>
                  <Button asChild className="bg-primary hover:bg-primary/50">
                    <Link href={`/markadetay/${bilgiler.referans_no}`}>
                      <EditIcon className={cn(iconClasses, 'text-white')} />
                      Marka Detay
                    </Link>
                  </Button>
                  {yetki === 'admin' && (
                    <>
                      <Button
                        asChild
                        className="bg-yellow-700 hover:bg-yellow-400"
                      >
                        <Link href={`/tmcard/${bilgiler.referans_no}`}>
                          <EditIcon className={cn(iconClasses, 'text-white')} />
                          Düzenle
                        </Link>
                      </Button>
                      <Button onClick={deleteMarka} variant="destructive">
                        <DeleteDocumentIcon
                          className={cn(iconClasses, 'text-white')}
                        />
                        Markayı Sil
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
export default MarkaDetayCard

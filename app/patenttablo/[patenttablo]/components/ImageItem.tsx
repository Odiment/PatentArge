'use client'

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { DeleteDocumentIcon } from '@/icons/DeleteDocumentIcon'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GiPlainCircle } from 'react-icons/gi'
import { Chip, Avatar } from '@nextui-org/react'
import { NotificationIcon } from '@/icons/NotificationIcon'
import { CheckIcon } from '@/icons/CheckIcon'
import { EyeIcon } from '@/icons/EyeIcon'
import { EditIcon } from '@/icons/EditIcon'
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

const ImageItem: React.FC<PatentCard> = ({
  data,
  bilgiler,
  patent_id,
  patentResimler,
  kullanici,
}) => {
  let patentResimler_id = patentResimler.map(({ patent_id }) => patent_id)
  let patentResimler_resim_url = patentResimler.map(
    ({ patent_resim_url }) => patent_resim_url
  )

  var ilgiliPatentResimler = patentResimler.reduce(
    (ilgiliPatentResimler, thing) => {
      if (thing.patent_id.includes(`${patent_id}`)) {
        ilgiliPatentResimler.push(thing)
      }
      return ilgiliPatentResimler
    },
    []
  )

  let patent_resimler_url = ilgiliPatentResimler.map(
    ({ patent_resim_url }) => patent_resim_url
  )

  const supabase = createClientComponentClient<Database>()
  const [currentPatentIndex, setCurrentPatentIndex] = useState(0)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [yetki, setYetki] = useState<string | null>(null)
  const [pozisyon, setPozisyon] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const iconClasses =
    'text-xl text-default-500 pointer-events-none flex-shrink-0'

  let patentdurumu = `${bilgiler.status}`

  let yesil = patentdurumu === 'tescil'
  let sari = patentdurumu === 'basvuru'
  let kirmizi = patentdurumu === 'iptal'

  const [patent_url, setPatentUrl] = useState<Patentler['patent_figure_url']>(
    patent_resimler_url[currentPatentIndex]
  )
  const [url, setUrl] = useState<Patentler['patent_figure_url']>(
    patent_resimler_url[currentPatentIndex]
  )
  const [patent_figure_url, setPatentFigureUrl] = useState<
    Patentler['patent_figure_url']
  >(patent_resimler_url[currentPatentIndex])

  useEffect(() => {
    async function downloadPatentFigure(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('patentFigure')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setPatentFigureUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (patent_url) downloadPatentFigure(patent_url)
  }, [patent_url, supabase])

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url, yetki, pozisyon`)
        .eq('id', kullanici?.id)
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
  }, [kullanici, supabase])

  useEffect(() => {
    getProfile()
  }, [kullanici, getProfile])

  async function deletePatent() {
    try {
      const { error } = await supabase
        .from('patentler')
        .delete()
        .eq('id', bilgiler.id)

      if (error) throw error
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }

  let resim_url: string | null

  // slider functions *************
  // Patent Resimler ******************
  const prevPatentSlide = () => {
    const isFirstSlide = currentPatentIndex === 0
    const newIndex = isFirstSlide
      ? patent_resimler_url.length - 1
      : currentPatentIndex - 1
    setCurrentPatentIndex(newIndex)
    setPatentUrl(patent_resimler_url[currentPatentIndex])
  }

  const nextPatentSlide = () => {
    const isLastSlide = currentPatentIndex === patent_resimler_url.length - 1
    const newIndex = isLastSlide ? 0 : currentPatentIndex + 1
    setCurrentPatentIndex(newIndex)
    setPatentUrl(patent_resimler_url[currentPatentIndex])
  }

  if ((url === null) | (url === undefined)) {
    resim_url =
      'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5NzM3Mjc3OSwiZXhwIjoxNzkxOTgwNzc5fQ.2s1NRy0rUx9cDryhuovBt4Uuy6BFQPrVCfzXDfp5BpI&t=2023-10-15T12%3A26%3A19.101Z'
  } else {
    resim_url = patent_figure_url
  }

  let durum_bilgisi: string | null
  if (bilgiler.status === 'basvuru') {
    durum_bilgisi = 'Başvuru Sürecinde'
  } else if (bilgiler.status === 'tescil') {
    durum_bilgisi = 'Tescil Edildi'
  } else if (bilgiler.status === 'iptal') {
    durum_bilgisi = 'İptal/Geçersiz'
  }

  return (
    <>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
        <div className="relative col-span-6 md:col-span-4">
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            alt="Album cover"
            className="object-cover "
            height={170}
            shadow="md"
            src={resim_url}
            width={170}
          />
        </div>

        <div className="flex flex-col col-span-6 md:col-span-8">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0">
              <h3 className="text-large font-bold text-foreground/90">
                {data.patent_title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col mt-3 gap-1 font-bold text-lg">
            <h1>{data.basvuru_no}</h1>
          </div>
        </div>
      </div>

      {/*       <User
        avatarProps={{
          radius: 'sm',
          src: url,
          size: 'lg',
        }}
        description={data.basvuru_no}
        name={data.patent_title}
      >
        {data.basvuru_no}
      </User> */}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {data.patent_title}
              </ModalHeader>
              <ModalBody>
                <Image
                  isZoomed
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  height="100%"
                  alt="patent_figure"
                  className="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large z-0 w-full h-full object-cover"
                  src={resim_url}
                />
                <div>
                  <p className="font-bold text-lg text-sky-400">
                    {data.patent_title}
                  </p>
                  <p className="font-semibold text-lg">{bilgiler.basvuru_no}</p>
                  <p className="font-semibold text-lg">{yetki}</p>
                  <p className="text-sm text-primary/80">{bilgiler.class_no}</p>
                  <p className="text-lg text-primary/80">
                    {bilgiler.basvuru_tarihi}
                  </p>
                  <p className="text-sm text-primary/80">
                    {bilgiler.referans_no}
                  </p>
                  <p className="text-sm text-primary/80 text-sky-400">
                    {bilgiler.firma_ad}
                  </p>
                  <p
                    className={classNames('text-xl', 'font-bold', {
                      'text-emerald-500': yesil,
                      'text-yellow-500': sari,
                      'text-red-500': kirmizi,
                    })}
                  >
                    {bilgiler.status}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                {yetki === 'admin' && (
                  <>
                    <Button
                      href={`/ptcard/${bilgiler.referans_no}`}
                      as={Link}
                      color="primary"
                      showAnchorIcon
                      variant="solid"
                    >
                      Düzenle
                    </Button>
                    <Button
                      onClick={deletePatent}
                      color="danger"
                      variant="bordered"
                      className="font-bold"
                      startContent={
                        <DeleteDocumentIcon
                          className={cn(iconClasses, 'text-danger')}
                        />
                      }
                    >
                      Patent Kartını Sil
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageItem

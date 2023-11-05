'use client'

import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { DeleteDocumentIcon } from '@/icons/DeleteDocumentIcon'
import { EditIcon } from '@/icons/EditIcon'
import { EyeIcon } from '@/icons/EyeIcon'
/* import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GiPlainCircle } from 'react-icons/gi'
import { Chip, Avatar } from '@nextui-org/react'
import { NotificationIcon } from '@/icons/NotificationIcon'
import { CheckIcon } from '@/icons/CheckIcon'
import { EyeIcon } from '@/icons/EyeIcon'
import { EditIcon } from '@/icons/EditIcon' */
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

type PatentlerX = Database['public']['Tables']['patentler']['Row']
interface PatentCard {
  data: PatentlerX
  bilgiler: PatentlerX
  patentResimler: {
    patent_resim_url: string | null;
    patent_id: string;
}[] | null
  kullanici: string
  patent_id: string | null
}



const ImageItem: React.FC<PatentCard> = ({
  data,
  bilgiler,
  patentResimler,
  kullanici,
  patent_id,
}) => {

   

    let patentResimler_idx: string[] | null
    let patentResimler_resim_urlx: (string | null)[]
    let patent_resimler_urlx: (string | null)[] = []

if (patentResimler != null) {

  let patentResimler_id = patentResimler.map(({ patent_id }) => patent_id)

  patentResimler_idx = patentResimler_id

  let patentResimler_resim_url = patentResimler.map(
    ({ patent_resim_url }) => patent_resim_url
  )
  patentResimler_resim_urlx = patentResimler_resim_url


  var ilgiliPatentResimler = patentResimler.reduce(
    (result: any, thing) => {
      if (thing.patent_id.includes(`${patent_id}`)) {
        result.push(thing)
      }
      return result
    },
    []
  )

  let patent_resimler_url = ilgiliPatentResimler.map(
    ({ patent_resim_url }: any) => patent_resim_url
  )
  patent_resimler_urlx = patent_resimler_url
}

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

  const [patent_url, setPatentUrl] = useState<PatentlerX['patent_figure_url']>(
    patent_resimler_urlx[currentPatentIndex]
  )
  const [url, setUrl] = useState<PatentlerX['patent_figure_url']>(
    patent_resimler_urlx[currentPatentIndex]
  )
  const [patent_figure_url, setPatentFigureUrl] = useState<
    PatentlerX['patent_figure_url']
  >(patent_resimler_urlx[currentPatentIndex])

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
        .eq('id', kullanici)
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
    } catch (error: any) {
      alert(error.message)
    }
  }

  let resim_url: string | null

  // slider functions *************
  // Patent Resimler ******************
  const prevPatentSlide = () => {
    const isFirstSlide = currentPatentIndex === 0
    const newIndex = isFirstSlide
      ? patent_resimler_urlx.length - 1
      : currentPatentIndex - 1
    setCurrentPatentIndex(newIndex)
    setPatentUrl(patent_resimler_urlx[currentPatentIndex])
  }

  const nextPatentSlide = () => {
    const isLastSlide = currentPatentIndex === patent_resimler_urlx.length - 1
    const newIndex = isLastSlide ? 0 : currentPatentIndex + 1
    setCurrentPatentIndex(newIndex)
    setPatentUrl(patent_resimler_urlx[currentPatentIndex])
  }

  if ((url === null) || (url === undefined)) {
    resim_url =
      'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5ODkxODI3NSwiZXhwIjoxNzkzNTI2Mjc1fQ.lb7bGb--HDNNLsPPXqUNjPpZNPD7zlbrGoezrglkFEI&t=2023-11-02T09%3A44%3A35.926Z'
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
        <div className="relative col-span-6 md:col-span-4" >
        <Card
          shadow="sm"
          key={data?.id}
          isPressable
          onPress={onOpen}
          className="border-1 border-primary bg-primary/5 hover:bg-primary/20"
        >
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            alt="Album cover"
            className="object-cover "
            height={170}            
            src={resim_url!}
            width={170}
          />
          </Card>
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
                  src={resim_url!}
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
              <Button asChild className="bg-primary hover:bg-primary/50">
                  <Link href={`/patentdetay/${bilgiler?.referans_no}`}>
                    <EyeIcon className={cn(iconClasses, 'text-white')} />
                    Patent Detay
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
                    <Button onClick={deletePatent} variant="destructive">
                      <DeleteDocumentIcon
                        className={cn(iconClasses, 'text-white')}
                      />
                      Patenti Sil
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

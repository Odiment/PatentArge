'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@nextui-org/react'
/* import Image from 'next/image' */
import spaceman from '@/assets/spaceman-1.png'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

//https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/markalar/ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg

/* const CDNURL =
  "https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/avatars/" */

/* const CDNURL =
  "https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/markaLogo/" */

/* type Profiles = Database["public"]["Tables"]["profiles"]["Row"] */

/* const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg" */
// const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138154.png"

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaLogoProps {
    uid: string[]
    url: string | null
    tp_logo_url: string | null
    size: number
    onUpload: any
}

const MarkaLogo: React.FC<MarkaLogoProps> = ({
  uid,
  url,
  tp_logo_url,
  size,
  onUpload,
}) => {
  const supabase = createClientComponentClient<Database>()
  //const [logoUrl, setLogoUrl] = useState<Markalar["logo_url"]>("")

  const [markaLogoUrl, setMarkaLogoUrl] = useState<MarkalarX['logo_url']>(url)

  const [uploading, setUploading] = useState(false)

  /*   const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(url)
  const [urlGlob, setUrlGlob] = useState<Profiles["avatar_url"]>(url) */

  const [images, setImages] = useState([])
  const [LogoFilePath, setLogoFilePath] = useState<string>()

  console.log(`prop - url ${url}`)

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
        setMarkaLogoUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadMarkaLogo(url)
  }, [url, supabase])

  const uploadMarkaLogo: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      let { error: uploadError } = await supabase.storage
        .from('markaLogo')
        .upload(filePath, file)

      setLogoFilePath(filePath)
      /*       if (uploadError) {
        throw uploadError
      } */

      onUpload(filePath)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  /*   console.log(`markaUrl = ${markaUrl}`)
  console.log(`logoaUrl = ${logoUrl}`) */
  /*   console.log(`images = ${images}`)
  console.log(`url = ${url}`)

  console.log(`{CDNURL + url} = ${CDNURL + url}`)

  console.log(`urlGlob = ${urlGlob}`) */

  /*   console.log(`markaLogoUrl = ${markaLogoUrl}`)
  console.log(`url = ${url}`)
  console.log(`LogoFilePath = ${LogoFilePath}`) */

  const hiddenFileInput = useRef(null)

  const handleClick = () => {
    (hiddenFileInput as any).current.click()
  }

let resim_url: string | null  

  if ((markaLogoUrl !== null) && (markaLogoUrl !== undefined )) {
    if (markaLogoUrl.includes('blob' || 'data')) {
    resim_url = markaLogoUrl
  } else {
    resim_url = tp_logo_url
  }
} 

  return (
    <div className="flex flex-col">
      <div>
        {/* {markaLogoUrl !== null && markaLogoUrl.includes('blob' || 'data') ? ( */}
          <Image
            width={size}
            height={size}
            className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
            /* src={markaLogoUrl} */
            src={resim_url!}
            alt="MarkaLogo"
            /* fill */
            /* className="avatar image" */
            /* style={{ height: size, width: size }} */
          />
{/*         ) : (
          <Image
            alt="MarkaLogoStatic"
            width={size}
            height={size}
            className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
            src={resim_url!}
          />
        )} */}
      </div>
      <div className="w-full">
        <Button
          className="w-full bg-primary hover:bg-primary/50 font-bold"
          size="lg"
          /* disabled={loading} */
          onClick={handleClick}
        >
          Bilgisayardan Resim Yükle
          <Wand2 className="w-4 h-4 ml-2" />
        </Button>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          ref={hiddenFileInput}
          accept="image/*"
          onChange={uploadMarkaLogo}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

export default MarkaLogo
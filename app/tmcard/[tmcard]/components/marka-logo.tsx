'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@nextui-org/react'
/* import Image from 'next/image' */
import spaceman from '@/assets/spaceman-1.png'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Database } from '../../../database.types'

//https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/markalar/ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg

/* const CDNURL =
  "https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/avatars/" */

/* const CDNURL =
  "https://iaxdtlsmlrqyczqwvzhk.supabase.co/storage/v1/object/public/markaLogo/" */

type Markalar = Database['public']['Tables']['markalar']['Row']

/* type Profiles = Database["public"]["Tables"]["profiles"]["Row"] */

/* const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg" */
// const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138154.png"

export default function MarkaLogo({
  uid,
  url,
  tp_logo_url,
  size,
  onUpload,
}: {
  uid: string
  url: Markalar['logo_url']
  tp_logo_url: string
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClientComponentClient<Database>()
  //const [logoUrl, setLogoUrl] = useState<Markalar["logo_url"]>("")

  const [markaLogoUrl, setMarkaLogoUrl] = useState<Markalar['logo_url']>(url)

  const [uploading, setUploading] = useState(false)

  /*   const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(url)
  const [urlGlob, setUrlGlob] = useState<Profiles["avatar_url"]>(url) */

  const [images, setImages] = useState([])
  const [LogoFilePath, setLogoFilePath] = useState([])

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

  const handleClick = (event) => {
    hiddenFileInput.current.click()
  }

  return (
    <div className="flex flex-col">
      <div>
        {markaLogoUrl !== null && markaLogoUrl.includes('blob' | 'data') ? (
          <Image
            width={size}
            height={size}
            className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
            /* src={markaLogoUrl} */
            src={markaLogoUrl}
            alt="MarkaLogo"
            /* fill */
            /* className="avatar image" */
            /* style={{ height: size, width: size }} */
          />
        ) : (
          /*           <div
            className="avatar no-image"
            style={{ height: 300, width: 300 }}
          /> */
          <Image
            width={size}
            height={size}
            className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
            src={tp_logo_url}
            /*             src="https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/avatars/aec65205-9440-482f-a539-9293fb7bb8a0-0.5921580138461082.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2FlYzY1MjA1LTk0NDAtNDgyZi1hNTM5LTkyOTNmYjdiYjhhMC0wLjU5MjE1ODAxMzg0NjEwODIucG5nIiwiaWF0IjoxNjk1NzU5Nzc4LCJleHAiOjE3MjcyOTU3Nzh9.rAgx9t6ExaXl_Y-M9peTr3IHA1TD9gHf9wsGd-PWsbw&t=2023-09-26T20%3A22%3A55.712Z"
            alt="MarkaLogo" */
            /* fill */
            /* className="avatar image" */
            /* style={{ height: size, width: size }} */
          />
        )}
      </div>
      <div className="w-full">
        <Button
          className="w-full bg-primary hover:bg-primary/50 font-bold"
          size="lg"
          /* disabled={loading} */
          onClick={handleClick}
        >
          Bilgisayarından Resim Yükle
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

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@nextui-org/react'
/* import Image from 'next/image' */
/* import spaceman from '@/assets/spaceman-1.png' */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimFigureProps {
    uid: string[]
    tasarim_url: string | null
    size: number
    txt: string
    onUpload: any
}

const TasarimFigure: React.FC<TasarimFigureProps> = ({
  uid,
  tasarim_url,
  size,
  txt,
  onUpload,
}) => {
  const supabase = createClientComponentClient<Database>()
  const [tasarim_figure_url, setTasarimFigureUrl] =
    useState<TasarimlarX['tasarim_figure_url']>(tasarim_url)
  const [url, setUrl] = useState<TasarimlarX['tasarim_figure_url']>(tasarim_url)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const [LogoFilePath, setLogoFilePath] = useState<string>()

  /*   console.log(`prop - url ${url}`) */

  useEffect(() => {
    async function downloadTasarimFigure(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('tasarimFigure')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setTasarimFigureUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (tasarim_url) downloadTasarimFigure(tasarim_url)
  }, [tasarim_url, supabase])

  const uploadTasarimFigure: React.ChangeEventHandler<HTMLInputElement> = async (
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
        .from('tasarimFigure')
        .upload(filePath, file)

      setLogoFilePath(filePath)
      onUpload(filePath)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const hiddenFileInput = useRef(null)

  const handleClick: any = () => {
    (hiddenFileInput as any).current.click()
  }

  let resim_url: string | null

  

  if ((tasarim_url !== null) && (tasarim_url !== undefined)) {
    if (tasarim_url.includes('http')) {
    resim_url = tasarim_url
  } else {
    resim_url = tasarim_figure_url
  }
}

  return (
    <div className="flex flex-col">
      <div>
        <Image
          width={size}
          height={size}
          className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
          src={resim_url!}
          alt="tasarim_figure_url"
        />
      </div>
      <div className="pt-2">
        <Button
          className="w-full bg-primary hover:bg-primary/50 font-bold "
          size="lg"
          onClick={handleClick}
        >
          {txt}
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
          onChange={uploadTasarimFigure}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

export default TasarimFigure

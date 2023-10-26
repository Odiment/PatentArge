'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@nextui-org/react'
/* import Image from 'next/image' */
/* import spaceman from '@/assets/spaceman-1.png' */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Database } from '../../../database.types'

type Patentler = Database['public']['Tables']['patentler']['Row']

/* type Profiles = Database["public"]["Tables"]["profiles"]["Row"] */

/* const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg" */
// const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138154.png"

export default function PatentFigure({
  uid,
  patent_url,
  size,
  txt,
  onUpload,
}: {
  uid: string
  patent_url: Patentler['patent_figure_url']
  size: number
  txt: string
  onUpload: (patent_figure_url: string) => void
}) {
  const supabase = createClientComponentClient<Database>()
  const [patent_figure_url, setPatentFigureUrl] =
    useState<Patentler['patent_figure_url']>(patent_url)
  const [url, setUrl] = useState<Patentler['patent_figure_url']>(patent_url)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const [LogoFilePath, setLogoFilePath] = useState([])

  /*   console.log(`prop - url ${url}`) */

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

  const uploadPatentFigure: React.ChangeEventHandler<HTMLInputElement> = async (
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
        .from('patentFigure')
        .upload(filePath, file)

      setLogoFilePath(filePath)
      /*       console.log('patent-figure: filePath')
      console.log(filePath) */

      /*     console.log('patent-figure:patent_figure_url')
      console.log(patent_figure_url) */
      onUpload(filePath)
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const hiddenFileInput = useRef(null)

  const handleClick = (event) => {
    hiddenFileInput.current.click()
  }

  let resim_url: string | null

  if (patent_url !== undefined && patent_url.includes('http')) {
    resim_url = patent_url
  } else {
    resim_url = patent_figure_url
  }

  /*  resim_url = patent_figure_url */

  /*   console.log('url')
  console.log(url)
  console.log('patent_figure_url')
  console.log(patent_figure_url)
  console.log('patent_url')
  console.log(patent_url)
  console.log('resim_url')
  console.log(resim_url) */

  return (
    <div className="flex flex-col">
      <div>
        <Image
          width={size}
          height={size}
          className="aspect-square object-cover rounded-lg transition-all duration-300 hover:scale-105"
          src={resim_url}
          alt="patent_figure_url"
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
          onChange={uploadPatentFigure}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

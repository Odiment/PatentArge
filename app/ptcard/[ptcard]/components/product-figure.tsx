'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Image } from '@nextui-org/react'

/* import Image from 'next/image' */
/* import spaceman from '@/assets/spaceman-1.png' */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Wand2, ArrowLeftSquare, ArrowRightSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'

/* const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138155.jpg" */
// const url = "ebdd1d12-fcff-46c2-bbb7-2408dc29d7f7-0.9834786322138154.png"

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface ProductFigureProps {
    uid: string[]
    product_url: string | null
    product_remote_url: string | null
    size: number
    txt: string
    onUpload: any
}

const ProductFigure: React.FC<ProductFigureProps> = ({
  uid,
  product_url,
  product_remote_url,
  size,
  txt,
  onUpload,
}) => {
  const supabase = createClientComponentClient<Database>()

  const [product_figure_url, setProductFigureUrl] =
    useState<PatentlerX['product_figure_url']>(product_url)
  const [url, setUrl] = useState<PatentlerX['product_figure_url']>(product_url)

  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const [LogoFilePath, setLogoFilePath] = useState<string>()

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function downloadProductFigure(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('patentFigure')
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

    if (product_url) downloadProductFigure(product_url)
  }, [product_url, supabase])

  const uploadProductFigure: React.ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
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
      onUpload(filePath, product_figure_url)
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

  let null_url =
    'https://qzxxwmyywwqvbreysvto.supabase.co/storage/v1/object/sign/patentFigure/format.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXRlbnRGaWd1cmUvZm9ybWF0LnBuZyIsImlhdCI6MTY5NzM3Mjc3OSwiZXhwIjoxNzkxOTgwNzc5fQ.2s1NRy0rUx9cDryhuovBt4Uuy6BFQPrVCfzXDfp5BpI&t=2023-10-15T12%3A26%3A19.101Z'

  if (product_url !== 'placeholder') {
    resim_url = product_url
  } else {
    resim_url = product_remote_url
  }

  /*   console.log('product_url')
  console.log(product_url)
  console.log('product_remote_url')
  console.log(product_remote_url)
  console.log('resim_url')
  console.log(resim_url) */

  /*   if (product_url !== undefined && product_url.includes('http')) {
    resim_url = product_url
  } else {
    resim_url = url
  }

  if (url === null) {
    resim_url = product_remote_url
  } else {
    resim_url = url
  } */

  /*   console.log('product_url')
  console.log(product_url)
  console.log('url')
  console.log(url) */

  return (
    <div className="flex flex-col">
      <Image
        width={size}
        height={size}
        className="aspect-square object-cover rounded-lg transition-all duration-300"
        src={resim_url!}
        alt="product_figure_url"
      />

      {/*       <div>
        <Image
          width={size}
          height={size}
          className="aspect-square object-cover rounded-lg transition-all duration-300"
          src={resim_url}
          alt="product_figure_url"
        />
      </div> */}
      <div className="flex items-center justify-center pt-2">
        <Button
          className="w-full bg-primary hover:bg-primary/50 font-bold"
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
          onChange={uploadProductFigure}
          disabled={uploading}
        />
      </div>
    </div>
  )
}

export default ProductFigure

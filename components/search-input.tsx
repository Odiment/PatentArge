'use client'

import { ChangeEventHandler, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import qs from 'query-string'

import { useDebounce } from '@/hooks/use-debounce'
import { Input } from '@/components/ui/input'
import { BiSearch } from 'react-icons/bi'
import { Button } from '@nextui-org/react'

export const SearchInput = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  /*   const categoryId = searchParams.get('categoryId') */
  const name = searchParams.get('name')

  const [value, setValue] = useState(name || '')
  const debouncedValue = useDebounce<string>(value, 500)

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    const query = {
      name: debouncedValue,
      /* categoryId: categoryId, */
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }, [debouncedValue, router /*  categoryId */])

  return (
    <>
      <div className="">
        <div className=" ">
          <div className="hidden md:flex min-w-[300px] lg:w-[620px]">
            <Input
              onChange={onChange}
              value={value}
              placeholder="Search..."
              className="w-full px-4 py-2 bg-primary/10 border-1 border-primary/60 rounded-tl-full rounded-bl-full placeholder:text-zinc-400"
            />
            <div className="bg-primary px-5 py-3 rounded-tr-full rounded-br-full cursor-pointer">
              <BiSearch />
            </div>
            {/*  <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground " /> */}
          </div>
          {/*           <div className="">
            <Button color="primary" variant="ghost" size="sm">
               Kart
            </Button>
            <Button color="primary" variant="ghost" size="sm">
            Y.Kart
            </Button>
            <Button color="primary" variant="ghost" size="sm">
              Tablo
            </Button>
          </div> */}
        </div>
      </div>
    </>
  )
}

/* "use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export const SearchInput = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = searchParams.get("categoryId")
  const name = searchParams.get("name")

  return (
    <div className="relative">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input placeholder="Search..." className="pl-10 bg-primary/10" />
    </div>
  )
}
 */

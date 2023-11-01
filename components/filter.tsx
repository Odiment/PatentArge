'use client'

import { ChangeEventHandler, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import qs from 'query-string'

import { useDebounce } from '@/hooks/use-debounce'
import { Input } from '@/components/ui/input'
import { BiSearch } from 'react-icons/bi'
import { Button } from '@nextui-org/react'

import { Tabs, Tab } from '@nextui-org/react'

const Filter = () => {
  const colors = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
  ]

  const router = useRouter()
  const searchParams = useSearchParams()

  const kategori = searchParams.get('kategori')

  const [value, setValue] = useState<any>(kategori || 'tumu')

  useEffect(() => {
    const query = {
      kategori: value,
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }, [value, router])

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Tabs
          /* key={color} */
          selectedKey={value}
          onSelectionChange={setValue}
          color="primary"
          aria-label="Tabs colors"
          radius="full"
        >
          <Tab key="tumu" title="Tümü" />
          <Tab key="tescil" title="Tescil">
            {/* <Button onClick={() => setValue('tescil')}>Tescil</Button> */}
          </Tab>
          <Tab key="basvuru" title="Başvuru" />
          <Tab key="iptal" title="İptal" />
          <Tab key="yalnizcaGecerli" title="İptal Olmayanlar" />
        </Tabs>
      </div>
    </>
  )
}

export default Filter

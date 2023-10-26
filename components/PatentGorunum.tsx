'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { ChevronDownIcon } from '@/icons/ChevronDownIcon'

export default function MarkaGorunum({ user }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Görünüm']))

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  )

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const onNavigate = (url: string, pro: boolean) => {
    return router.push(url)
  }

  return (
    <>
      {pathname.includes('patent') && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="capitalize"
              endContent={<ChevronDownIcon className="text-small" />}
            >
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem
              key="d.kart"
              onClick={() => onNavigate('/patent/list')}
            >
              Patent Kart
            </DropdownItem>
            <DropdownItem
              key="y.kart"
              onClick={() => onNavigate('/patentyataykart/list')}
            >
              Patent Yatay Kart
            </DropdownItem>
            <DropdownItem
              key="tablo"
              onClick={() => onNavigate('/patenttablo/list')}
            >
              Patent Tablo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  )
}

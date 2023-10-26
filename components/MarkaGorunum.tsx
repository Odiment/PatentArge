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
      {pathname.includes('marka') && (
        <Dropdown className="bg-primary">
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="capitalize bg-background border-1 border-primary"
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
              className="text-background"
              key="d.kart"
              onClick={() => onNavigate('/marka/list')}
            >
              Marka Dikey Kart
            </DropdownItem>
            <DropdownItem
              className="text-background"
              key="y.kart"
              onClick={() => onNavigate('/markayataykart/list')}
            >
              Marka Yatay Kart
            </DropdownItem>
            <DropdownItem
              className="text-background"
              key="tablo"
              onClick={() => onNavigate('/markatablo/list')}
            >
              Marka Tablo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  )
}

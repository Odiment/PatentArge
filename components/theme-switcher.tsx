'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set(['tema']))

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Dropdown placement="bottom-end" className='bg-primary text-'>
      <DropdownTrigger>
        <Button isIconOnly aria-label="Tema" color="default">
          <SunMoon />
          {/* {selectedValue} */}
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
        <DropdownItem key="light" onClick={() => setTheme('light')}>
          Light
        </DropdownItem>
        <DropdownItem key="dark" onClick={() => setTheme('dark')}>
          Dark
        </DropdownItem>
        <DropdownItem key="modern" onClick={() => setTheme('moderndark')}>
          Modern Dark
        </DropdownItem>
        <DropdownItem key="retrolight" onClick={() => setTheme('retrolight')}>
          Retro Light
        </DropdownItem>
        <DropdownItem key="retrodark" onClick={() => setTheme('retrodark')}>
          Retro Dark
        </DropdownItem>
        <DropdownItem
          key="emeraldlight"
          onClick={() => setTheme('emeraldlight')}
        >
          Emerald Light
        </DropdownItem>
        <DropdownItem key="cyanddark" onClick={() => setTheme('cyanddark')}>
          Cyan Dark
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

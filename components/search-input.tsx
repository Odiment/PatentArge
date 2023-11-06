"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import qs from "query-string";

import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { BiSearch } from "react-icons/bi";
import { Button } from "@nextui-org/react";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*   const categoryId = searchParams.get('categoryId') */
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");
  const debouncedValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debouncedValue,
      /* categoryId: categoryId, */
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, router /*  categoryId */]);

  const pathname = usePathname();

  return (
    <>
      {(pathname.includes("marka") ||
        pathname.includes("patent") ||
        pathname.includes("tasarim")) && (
        <div
          key={pathname}
          className="hidden md:flex min-w-[200px] md:w-[300px] lg:w-[450px]">
          <Input
            key={name}
            onChange={onChange}
            value={value}
            placeholder="Marka ibaresi, buluş balığı veya tasarım başlığı ile arama yapınız..."
            className="w-full px-4 py-2 bg-primary/10 border-1 border-primary/60 rounded-tl-full rounded-bl-full placeholder:text-zinc-400"
          />
          <div key={3} className="bg-primary px-5 py-3 rounded-tr-full rounded-br-full cursor-pointer">
            <BiSearch />
          </div>
        </div>
      )}
    </>
  );
};

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

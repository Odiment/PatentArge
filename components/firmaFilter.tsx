"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import qs from "query-string";

import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { BiSearch } from "react-icons/bi";
import { Button } from "@nextui-org/react";

export const FirmaFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*   const categoryId = searchParams.get('categoryId') */
  const firma = searchParams.get("firma");

  const [value, setValue] = useState(firma || "");
  const debouncedValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      firma: debouncedValue,
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
          <div key={firma} className="hidden md:flex min-w-[200px] md:w-[300px] lg:w-[450px]">
            <Input
              onChange={onChange}
              value={value}
              placeholder="BÜYÜK HARF kullanarak Firma adını yazınız ..."
              className="w-full px-4 py-2 bg-primary/10 border-1 border-primary/60 rounded-tl-full rounded-bl-full placeholder:text-zinc-400"
            />
            <div key={4} className="bg-primary px-5 py-3 rounded-tr-full rounded-br-full cursor-pointer">
              <BiSearch />
            </div>
          </div>
          )}
    </>
  );
};

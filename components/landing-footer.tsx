"use client";

import { Poppins } from "next/font/google";
import Link from "next/link"
import { cn } from "@/lib/utils";

const font = Poppins({ weight: '400', subsets: ['latin'] });

export const LandingFooter = () => {
    return (
    /*Header Container */
    <header className="bg-transparent border-t-2 dark:border-[#b9b9b9]/20 border-[#6b7280]/40 p-6">
      <div className="container flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className={cn("text-1xl dark:text-zinc-400 text-primary", font.className)}>
              Odiment
              </h1>
            </Link>  
            
            
      </div>
    
    </header>
  
  )
}
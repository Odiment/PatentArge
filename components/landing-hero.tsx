"use client";

import TypewriterComponent from "typewriter-effect";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({ weight: '500', subsets: ['latin'] });


export const LandingHero = () => {
    return (
        <div className="text-[#1e293b] font-bold py-36 text-center space-y-5">
           <div className="text-4xl sm:text-5xl md:trxt-6xl lg:text-7xl space-y-5 font-extrabold">
            <h1 className={cn("text-6xl font-bold dark:text-[#e7e5e4] text-primary", font.className)}>
                Fikirden Değere</h1>
            <div className={cn("text-5xl text-transparent bg-clip-text text-[#3ecf8e]",font.className)}>
                <TypewriterComponent 
                options={{
                    strings:[
                        "Fikir Yönetimi.",
                        "Patent Yönetimi.",
                        "Fikri Haklar.",
                        "Ar-Ge Merkezi Yönetimi.",
                    ],
                    autoStart:true,
                    loop:true,
                    
                }} 
                />
            </div>
            <div className={cn("text-sm md:text-xl font-light text-zinc-400",font.className)}>

            </div>
           </div>
        </div>
    )
}
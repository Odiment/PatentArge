"use client";

import { Card, CardContent, CardHeader, CardTitle, CardImg } from "@/components/ui/landing-card";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const fontbaslik = Poppins({ weight: '600', subsets: ['latin'] });
const testimonials = [
  {
    name: "Fikir Yönetim",
    title: "Modülü",
    img: "./2.jpg",
    description: "Organizasyonunuzun içinde gelişen fikirlerin değerlendrilmesi, kurumsal hafızanızda kalması, ödüllendirilmesi gibi süreçleri sağlar.",
  },
  {
    name: "Patent Yönetim",
    title: "Modülü",
    img: "./5.jpg",
    description: "Organizasyonunuzun sahip olduğu tüm patent portföyünü süreç ve değere dönüşümünü yönetmenizi sağlar",
  },
  {
    name: "Fikri Haklar",
    title: "Modülü",
    img: "./4.jpg",
    description: "Marka Tasarım ve akademik çıktıların, tek bir merkezde yönetilmesine imkan tanır.",
  },
  {
    name: "Ar-Ge Merkezi Yönetim",
    title: "Modülü",
    img: "./3.jpg",
    description: "Sanayi bakanlığı başarı kriterlerini ve tüm merkez parametrelerinin yönetilmesini sağlar.",
  },
];

export const LandingContent = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-10 pb-20">
      <h2 className={cn("text-center text-4xl dark:text-[#e7e5e4] text-secodary  font-extrabold mb-10", fontbaslik.className)}>Modüller</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-transparent border-line dark:text-[#e7e5e4] text-[#1e293b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg dark:text-[#e7e5e4] text-primary">{item.name}</p>
                  <p className="dark:text-zinc-400 text-secodary text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardImg className="pt-4 px-0">
               <img src={item.img} alt="" className="rounded-lg" />
              </CardImg>
              <CardContent className="pt-3 px-0 dark:text-[#e7e5e4] text-secodary">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
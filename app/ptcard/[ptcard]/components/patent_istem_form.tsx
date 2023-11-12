"use client";

//import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentIstemFormProps {
  secilenPatent: PatentlerX[] | null;
  secilenPatentIstemler:
    | {
        patent_id: any;
        istem_no: any;
        istem_metni: any;
      }[];

  session: Session | null;
}

const formSchema = z.object({
    istem_no: z.string(),
  istem_metni: z.string(),
});

export default function PatentIstemForm({
  secilenPatent,
  secilenPatentIstemler,
  session,
}: PatentIstemFormProps) {
  const supabase = createClientComponentClient<Database>();

  const [loading, setLoading] = useState(true);

  const [patentIstemNo, setPatentIstemNo] = useState<string | null>(null);
  const [patentIstemAciklamasi, setPatentIstemAciklamasi] = useState<
    string | null
  >(null);

  const [formStep, setFormStep] = React.useState(0);

  const user = session?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        istem_no: "",
      istem_metni: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmitYeniPatentIstem(veri: z.infer<typeof formSchema>) {
    if (secilenPatent != null) {
      setPatentIstemNo(veri.istem_no);
      setPatentIstemAciklamasi(veri.istem_metni);

      try {
        const { data, error, status } = await supabase
          .from("patent_istemler")
          .insert({
            patent_id: secilenPatent[0].id,
            istem_no: veri.istem_no,
            istem_metni: veri.istem_metni,
          })
          .single();

        if (error) throw error;

        toast({
          variant: "affirmative",
          title: "Veri tabanında patent istemi için bir id oluşturuldu",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
              <code className="text-white">
                {JSON.stringify(veri.istem_no, null, 2)}
              </code>
            </pre>
          ),
        });

        window.location.reload();
      } catch (error: any) {
        alert(error.message);
      }
    }
  }

  async function updatePatentIstem(values: z.infer<typeof formSchema>) {
    if (secilenPatent != null) {
      if (secilenPatentIstemler != null) {
        if (values.istem_no === "") {
          values.istem_no =
            secilenPatentIstemler[0].istem_no!;
        }
        if (values.istem_metni === "") {
          values.istem_metni =
            secilenPatentIstemler[0].istem_metni!;
        }

        try {
          setLoading(true);

          let { error } = await supabase
            .from("patent_istemler")
            .update({
                istem_no: values.istem_no,
              istem_metni: values.istem_metni,
            })
            .eq("patent_id", secilenPatent[0].id);
          if (error) throw error;
          /* window.location.reload(); */
        } catch (error) {
          alert("HATA: Patent İstem güncelemesi gerçekleştirilemedi!");
        } finally {
          setLoading(false);
        }
      }
    }
  }

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      {secilenPatent != null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitYeniPatentIstem)}
            className="space-y-8 pb-10">
            <div className="space-y-2 w-full col-span-2">
              <div>
                <h3 className="text-lg font-bold">
                  Patent İstem Bilgileri Giriş Formu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patent Başvurusunda yer alan istemler ve ayrıntılarını
                  girebilir veya güncelleyebilirsiniz
                </p>
              </div>
              <Separator className="bg-primary" />
            </div>

        
            <FormField
              name="istem_no"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İstem No</FormLabel>
                  <FormControl>
                    <Input
                      className="font-black italic"
                      disabled={isLoading}
                     /*  placeholder={`${secilenPatentIstemler.istem_no}`} */
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Patent İstem numarasını giriniz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="istem_metni"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İstem metnini giriniz..</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-black resize italic"
                      {...field}
                      placeholder={
                        "Kurumda kayıtlı sınıf bilgilerini kopyalayınız..."
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Patent başvurusunda yer alan istemlerin detaylarını
                    giriniz....
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-center">
              <Button
                className="bg-emerald-500 font-bold"
                size="lg"
                type="submit"
                disabled={isLoading}>
                Patent İstemi Ekle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

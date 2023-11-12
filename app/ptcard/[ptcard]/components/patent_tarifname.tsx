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

interface PatentTarifnameFormProps {
  secilenPatent: PatentlerX[] | null;
  secilenPatentTarifname:
    | {
        patent_id: any;
        tarifname: any;
      }[];

  session: Session | null;
}

const formSchema = z.object({
  tarifname: z.string(),
});

export default function PatentTarifnameForm({
  secilenPatent,
  secilenPatentTarifname,
  session,
}: PatentTarifnameFormProps) {
  const supabase = createClientComponentClient<Database>();

  const [loading, setLoading] = useState(true);

  const [patentTarifname, setPatentTarifname] = useState<string | null>(null);

  const [formStep, setFormStep] = React.useState(0);

  const user = session?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tarifname: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmitYeniPatentTarifname(veri: z.infer<typeof formSchema>) {
    if (secilenPatent != null) {
      setPatentTarifname(veri.tarifname);

      try {
        const { data, error, status } = await supabase
          .from("patent_tarifname")
          .insert({
            patent_id: secilenPatent[0].id,
            tarifname: veri.tarifname,
          })
          .single();

        if (error) throw error;

        toast({
          variant: "affirmative",
          title: "Veri tabanında patent tarifnamesi için bir id oluşturuldu",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-emerald-900 p-4">
              <code className="text-white">
                {JSON.stringify(veri.tarifname, null, 2)}
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

  async function updatePatentTarifname(values: z.infer<typeof formSchema>) {
    if (secilenPatent != null) {
      if (secilenPatentTarifname != null) {        
        if (values.tarifname === "") {
          values.tarifname = secilenPatentTarifname[0].tarifname!;
        }

        try {
          setLoading(true);

          let { error } = await supabase
            .from("patent_tarifname")
            .update({
              tarifname: values.tarifname,
            })
            .eq("patent_id", secilenPatent[0].id);
          if (error) throw error;
          /* window.location.reload(); */
        } catch (error) {
          alert("HATA: Patent tarifname güncelemesi gerçekleştirilemedi!");
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
            onSubmit={form.handleSubmit(onSubmitYeniPatentTarifname)}
            className="space-y-8 pb-10">
            <div className="space-y-2 w-full col-span-2">
              <div>
                <h3 className="text-lg font-bold">
                  Patent Özet ve Tarifnamesi Giriş Formu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patent Başvurusunda yer alan özet, tarifname ve ayrıntılarını
                  girebilir veya güncelleyebilirsiniz
                </p>
              </div>
              <Separator className="bg-primary" />
            </div>
            <FormField
              name="tarifname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarifname metnini giriniz..</FormLabel>
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
                    Patent başvurusunda yer alan tarifnamenin detaylarını
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
                Özet ve Tarifname Ekle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

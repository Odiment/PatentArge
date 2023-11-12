"use client";

//import axios from "axios";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteDocumentIcon } from "@/icons/DeleteDocumentIcon";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const iconClasses =
"text-xl text-default-500 pointer-events-none flex-shrink-0";  

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
  secilenPatentIstemler: {
    id: any;
    patent_id: any;
    istem_no: any | null;
    istem_metni: any | null;    
}
  session: Session | null;
/*   secilenPatentSurecBilgileri: {
    patent_id: any;
    islem_tarihi: any;
    islem: any;
    islem_aciklamasi: any;
}[]; */
}

const formSchema = z.object({
    istem_no: z.string(),
    istem_metni: z.string(),
});

export default function PatentIstemFormEdit({
  secilenPatent,
  secilenPatentIstemler,
  session,
  /* secilenPatentSurecBilgileri, */
}: PatentIstemFormProps) {

  const supabase = createClientComponentClient<Database>();
  const [sil, setSil] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);

  const user = session?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        istem_no: "",
        istem_metni: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function updatePatent(values: z.infer<typeof formSchema>) {

    if (secilenPatent != null) {
     

      if (secilenPatentIstemler != null) {
        if (values.istem_no === "") {
          values.istem_no =
          secilenPatentIstemler.istem_no!;
        }
        if (values.istem_metni === "") {
          values.istem_metni =
          secilenPatentIstemler.istem_metni!;
        }

        try {
          setLoading(true);

          let { error } = await supabase
            .from("patent_istemler")
            .update({
                istem_no: values.istem_no,
                istem_metni: values.istem_metni,
            })
            .eq("id", secilenPatentIstemler.id);
          if (error) throw error;
          window.location.reload();
        } catch (error) {
          alert("HATA: Patent istem güncelemesi gerçekleştirilemedi!");
        } finally {
          setLoading(false);
        }
      }
    }
  }

  async function deletePatentIstem() {
    try {
      const { error } = await supabase
        .from("patent_istemler")
        .delete()
        .eq("id", secilenPatentIstemler.id);

      setSil(true);

      if (error) throw error;
      /* window.location.reload(); */
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="h-full max-w-3xl mx-auto">
      {secilenPatent != null && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updatePatent)}
            className="">
            <div className="space-y-2 w-full col-span-2">
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
                        placeholder={`${secilenPatentIstemler.istem_no}`}
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
                  <FormLabel>İstem metnini giriniz...</FormLabel>
                  <FormControl>
                    <Textarea
                      className="font-black resize italic"
                      {...field}
                      placeholder={`${secilenPatentIstemler?.istem_metni}`}
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
                Patent İstemini Güncelle
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
              <Button
              className="bg-red-500 font-bold hover:bg-red-300"
              size="lg"
              /* disabled={loading} */
              onClick={() => deletePatentIstem()}>
              İstemi Sil
              <DeleteDocumentIcon className={cn(iconClasses, "text-white")} />
            </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

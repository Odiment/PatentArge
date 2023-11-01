export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      firma_profil: {
        Row: {
          created_at: string
          firma_ad: string
          firma_id: string
          id: string
          user_email: string | undefined
          username: string
        }
        Insert: {
          created_at?: string
          firma_ad: string
          firma_id: string
          id?: string
          user_email: string | undefined
          username: string
        }
        Update: {
          created_at?: string
          firma_ad?: string
          firma_id?: string
          id?: string
          user_email?: string | undefined
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "firma_profil_firma_id_fkey"
            columns: ["firma_id"]
            referencedRelation: "firmalar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "firma_profil_user_email_fkey"
            columns: ["user_email"]
            referencedRelation: "profiles"
            referencedColumns: ["email"]
          }
        ]
      }
      firmalar: {
        Row: {
          email: string | null
          firma: string | null
          firma_ad: string | null
          firma_adres: string | null
          firma_unvan: string
          id: string
          sahip_no: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          email?: string | null
          firma?: string | null
          firma_ad?: string | null
          firma_adres?: string | null
          firma_unvan: string
          id?: string
          sahip_no?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          email?: string | null
          firma?: string | null
          firma_ad?: string | null
          firma_adres?: string | null
          firma_unvan?: string
          id?: string
          sahip_no?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      markalar: {
        Row: {
          basvuru_no: string | null
          basvuru_tarihi: string | null
          class_no: string | null
          created_at: string
          deger: string | null
          durum_aciklamasi: string | null
          firma_ad: string | null
          firma_id: string
          firma_unvan: string
          id: string | null
          logo_url: string | null
          marka: string | null
          marka_durumu: string | null
          referans_no: string | null
          son_islem: string | null
          son_islem_tarihi: string | null
          status: string | null
          tp_avatar: string | null
          tp_logo_url: string | null
        }
        Insert: {
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          class_no?: string | null
          created_at?: string
          deger?: string | null
          durum_aciklamasi?: string | null
          firma_ad?: string | null
          firma_id: string
          firma_unvan: string
          id?: string | null
          logo_url?: string | null
          marka?: string | null
          marka_durumu?: string | null
          referans_no?: string | null
          son_islem?: string | null
          son_islem_tarihi?: string | null
          status?: string | null
          tp_avatar?: string | null
          tp_logo_url?: string | null
        }
        Update: {
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          class_no?: string | null
          created_at?: string
          deger?: string | null
          durum_aciklamasi?: string | null
          firma_ad?: string | null
          firma_id?: string
          firma_unvan?: string
          id?: string | null
          logo_url?: string | null
          marka?: string | null
          marka_durumu?: string | null
          referans_no?: string | null
          son_islem?: string | null
          son_islem_tarihi?: string | null
          status?: string | null
          tp_avatar?: string | null
          tp_logo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "markalar_firma_id_fkey"
            columns: ["firma_id"]
            referencedRelation: "firmalar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "markalar_firma_unvan_fkey"
            columns: ["firma_unvan"]
            referencedRelation: "firmalar"
            referencedColumns: ["firma_unvan"]
          }
        ]
      }
      patent_resimler: {
        Row: {
          id: string
          patent_id: string
          patent_resim_url: string | null
        }
        Insert: {
          id?: string
          patent_id: string
          patent_resim_url?: string | null
        }
        Update: {
          id?: string
          patent_id?: string
          patent_resim_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patent_resimler_patent_id_fkey"
            columns: ["patent_id"]
            referencedRelation: "patentler"
            referencedColumns: ["id"]
          }
        ]
      }
      patentler: {
        Row: {
          basvuru_no: string | null
          basvuru_tarihi: string | null
          blob_patent_figure_url: string | null
          class_no: string | null
          created_at: string
          deger: string | null
          firma_ad: string | null
          firma_id: string
          firma_unvan: string
          id: string
          ozet: string | null
          patent_durumu: string | null
          patent_figure_url: string | null
          patent_title: string | null
          product_figure_url: string | null
          /* product_remote_figure_url: string | null */
          referans_no: string | null
          status: string | null
        }
        Insert: {
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          blob_patent_figure_url?: string | null
          class_no?: string | null
          created_at?: string
          deger?: string | null
          firma_ad?: string | null
          firma_id: string
          firma_unvan: string
          id?: string
          ozet?: string | null
          patent_durumu?: string | null
          patent_figure_url?: string | null
          patent_title?: string | null
          product_figure_url?: string | null
          /* product_remote_figure_url: string | null */
          referans_no?: string | null
          status?: string | null
        }
        Update: {
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          blob_patent_figure_url?: string | null
          class_no?: string | null
          created_at?: string
          deger?: string | null
          firma_ad?: string | null
          firma_id?: string
          firma_unvan?: string
          id?: string
          ozet?: string | null
          patent_durumu?: string | null
          patent_figure_url?: string | null
          patent_title?: string | null
          product_figure_url?: string | null
          /* product_remote_figure_url: string | null */
          referans_no?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patentler_firma_id_fkey"
            columns: ["firma_id"]
            referencedRelation: "firmalar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patentler_firma_unvan_fkey"
            columns: ["firma_unvan"]
            referencedRelation: "firmalar"
            referencedColumns: ["firma_unvan"]
          }
        ]
      }
      product_resimler: {
        Row: {
          id: string
          patent_id: string
          product_remote_url: string | null
          product_resim_url: string | null
        }
        Insert: {
          id?: string
          patent_id: string
          product_remote_url?: string | null
          product_resim_url?: string | null
        }
        Update: {
          id?: string
          patent_id?: string
          product_remote_url?: string | null
          product_resim_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_resimler_patent_id_fkey"
            columns: ["patent_id"]
            referencedRelation: "patentler"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          firma_ad: string | null
          full_name: string | null
          id: string | null
          pozisyon: string | null
          updated_at: string | null
          username: string | null
          website: string | null
          yetki: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          firma_ad?: string | null
          full_name?: string | null
          id: string
          pozisyon?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
          yetki?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          firma_ad?: string | null
          full_name?: string | null
          id?: string
          pozisyon?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
          yetki?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

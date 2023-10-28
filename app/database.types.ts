export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          yetki: string | null
          pozisyon: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          yetki?: string | null
          pozisyon?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          yetki?: string | null
          pozisyon?: string | null
        }
      }
      markalar: {
        Row: {
          firma_id: string | null
          firma_unvan: string | null
          firma_ad: string | null
          basvuru_no: string | null
          id: string | null
          created_at: string | null
          referans_no: string | null
          class_no: string | null
          marka_durumu: string | null
          basvuru_tarihi: string | null
          logo_url: string | null
          tp_logo_url: string | null
          tp_avatar: string | null
          marka: string | null
          deger: string | null
          status: string | null
        }
        Insert: {
          firma_id?: string | null
          firma_unvan?: string | null
          firma_ad?: string | null
          basvuru_no?: string | null
          id: string | null
          created_at?: string | null
          referans_no?: string | null
          class_no?: string | null
          marka_durumu?: string | null
          basvuru_tarihi?: string | null
          logo_url?: string | null
          tp_logo_url?: string | null
          tp_avatar?: string | null
          marka?: string | null
          deger?: string | null
          status?: string | null
        }
        Update: {
          firma_id?: string | null
          firma_unvan?: string | null
          firma_ad?: string | null
          basvuru_no?: string | null
          id: string | null
          created_at?: string | null
          referans_no?: string | null
          class_no?: string | null
          marka_durumu?: string | null
          basvuru_tarihi?: string | null
          logo_url?: string | null
          tp_logo_url?: string | null
          tp_avatar?: string | null
          marka?: string | null
          deger?: string | null
          status?: string | null
        }
      }
      patentler: {
        Row: {
          id: string | null
          patent_title: string | null
          firma_id: string | null
          firma_unvan: string | null
          firma_ad: string | null
          created_at: string | null
          basvuru_no: string | null
          basvuru_tarihi: string | null
          referans_no: string | null
          class_no: string | null
          deger: string | null
          status: string | null
          patent_durumu: string | null
          patent_figure_url: string | null
          blob_patent_figure_url: string | null
          product_figure_url: string | null
        }
        Insert: {
          id: string | null
          patent_title?: string | null
          firma_id: string | null
          firma_unvan?: string | null
          firma_ad?: string | null
          created_at: string | null
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          referans_no?: string | null
          class_no?: string | null
          deger?: string | null
          status?: string | null
          patent_durumu?: string | null
          patent_figure_url?: string | null
          blob_patent_figure_url?: string | null
          product_figure_url?: string | null
        }
        Update: {
          id: string | null
          patent_title?: string | null
          firma_id: string | null
          firma_unvan?: string | null
          firma_ad?: string | null
          created_at: string | null
          basvuru_no?: string | null
          basvuru_tarihi?: string | null
          referans_no?: string | null
          class_no?: string | null
          deger?: string | null
          status?: string | null
          patent_durumu?: string | null
          patent_figure_url?: string | null
          blob_patent_figure_url?: string | null
          product_figure_url?: string | null
        }
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
  }
}

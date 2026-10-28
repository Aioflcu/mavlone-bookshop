export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  __InternalSupabase: {
    PostgretVersion: "14.18"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          category: string
          cover_url: string | null
          created_at: string
          description: string
          featured: boolean
          format: string
          id: string
          old_price: number | null
          pages: number | null
          price: number
          published: boolean
          purchase_url: string | null
          rating: number | null
          rating_count: number | null
          title: string
        }
        Insert: {
          author?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          format?: string
          id?: string
          old_price?: number | null
          pages?: number | null
          price?: number
          published?: boolean
          purchase_url?: string | null
          rating?: number | null
          rating_count?: number | null
          title: string
        }
        Update: {
          author?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          format?: string
          id?: string
          old_price?: number | null
          pages?: number | null
          price?: number
          published?: boolean
          purchase_url?: string | null
          rating?: number | null
          rating_count?: number | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          created_at: string
          customer_name: string
          email: string
          phone: string | null
          address: string
          city: string
          country: string
          notes: string | null
          items: Json
          subtotal: number
          shipping: number
          total: number
          payment_method: string
          payment_reference: string | null
          status: string
          source: string
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name: string
          email: string
          phone?: string | null
          address: string
          city: string
          country: string
          notes?: string | null
          items?: Json
          subtotal?: number
          shipping?: number
          total?: number
          payment_method?: string
          payment_reference?: string | null
          status?: string
          source?: string
        }
        Update: {
          id?: string
          created_at?: string
          customer_name?: string
          email?: string
          phone?: string | null
          address?: string
          city?: string
          country?: string
          notes?: string | null
          items?: Json
          subtotal?: number
          shipping?: number
          total?: number
          payment_method?: string
          payment_reference?: string | null
          status?: string
          source?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          hero_image_url: string | null
          hero_subtitle: string
          hero_title: string
          id: number
          whatsapp: string | null
        }
        Insert: {
          contact_email?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: number
          whatsapp?: string | null
        }
        Update: {
          contact_email?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: number
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: { id: string; role: Database["public"]["Enums"]["app_role"]; user_id: string }
        Insert: { id?: string; role: Database["public"]["Enums"]["app_role"]; user_id: string }
        Update: { id?: string; role?: Database["public"]["Enums"]["app_role"]; user_id?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: { app_role: "admin" | "user" }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

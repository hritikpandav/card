 export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      card_analytics: {
        Row: {
          card_id: string
          id: string
          referrer: string | null
          user_agent: string | null
          viewed_at: string
          viewer_ip: string | null
        }
        Insert: {
          card_id: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
          viewer_ip?: string | null
        }
        Update: {
          card_id?: string
          id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_analytics_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_cards: {
        Row: {
          bio: string | null
          colors: Json | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          is_public: boolean | null
          name: string
          phone: string | null
          profile_image: string | null
          slug: string | null
          social: Json | null
          template: string | null
          title: string | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          bio?: string | null
          colors?: Json | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          phone?: string | null
          profile_image?: string | null
          slug?: string | null
          social?: Json | null
          template?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          bio?: string | null
          colors?: Json | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          phone?: string | null
          profile_image?: string | null
          slug?: string | null
          social?: Json | null
          template?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          duration_months: number
          id: string
          name: string
          price_cents: number
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string
          duration_months: number
          id?: string
          name: string
          price_cents: number
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string
          duration_months?: number
          id?: string
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_start: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      },
      user_template_payments: {
        Row: {
          id: string
          user_id: string
          template_id: string
          plan_id: string
          payment_status: string
          payment_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          plan_id: string
          payment_status?: string
          payment_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          plan_id?: string
          payment_status?: string
          payment_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_template_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_card_slug: {
        Args: { input_name: string }
        Returns: string
      }
      get_card_view_count: {
        Args: { card_uuid: string }
        Returns: number
      }
      is_user_active: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

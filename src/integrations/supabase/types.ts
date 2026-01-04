export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      first100_activities: {
        Row: {
          created_at: string
          day_id: string
          description: string | null
          embed_url: string | null
          full_text_label: string | null
          full_text_url: string | null
          id: string
          image_caption: string | null
          image_url: string | null
          quote: string | null
          quote_attribution: string | null
          sort_order: number
          sources: Json
          title: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_id: string
          description?: string | null
          embed_url?: string | null
          full_text_label?: string | null
          full_text_url?: string | null
          id?: string
          image_caption?: string | null
          image_url?: string | null
          quote?: string | null
          quote_attribution?: string | null
          sort_order?: number
          sources?: Json
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_id?: string
          description?: string | null
          embed_url?: string | null
          full_text_label?: string | null
          full_text_url?: string | null
          id?: string
          image_caption?: string | null
          image_url?: string | null
          quote?: string | null
          quote_attribution?: string | null
          sort_order?: number
          sources?: Json
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "first100_activities_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "first100_days"
            referencedColumns: ["id"]
          },
        ]
      }
      first100_days: {
        Row: {
          created_at: string
          date_display: string
          date_iso: string | null
          day: number
          editorial_state: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_display: string
          date_iso?: string | null
          day: number
          editorial_state?: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_display?: string
          date_iso?: string | null
          day?: number
          editorial_state?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      import_reports: {
        Row: {
          created_at: string
          errors: Json
          id: string
          records_created: number
          records_updated: number
          rows_processed: number
          type: string
        }
        Insert: {
          created_at?: string
          errors?: Json
          id?: string
          records_created?: number
          records_updated?: number
          rows_processed?: number
          type: string
        }
        Update: {
          created_at?: string
          errors?: Json
          id?: string
          records_created?: number
          records_updated?: number
          rows_processed?: number
          type?: string
        }
        Relationships: []
      }
      indicators: {
        Row: {
          category: string
          created_at: string
          current: string
          current_description: string
          description_paragraph: string
          editorial_state: string
          headline: string
          id: string
          promise_reference: string
          promise_reference_unresolved: boolean
          source: string
          target: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          current?: string
          current_description?: string
          description_paragraph?: string
          editorial_state?: string
          headline?: string
          id?: string
          promise_reference?: string
          promise_reference_unresolved?: boolean
          source?: string
          target?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current?: string
          current_description?: string
          description_paragraph?: string
          editorial_state?: string
          headline?: string
          id?: string
          promise_reference?: string
          promise_reference_unresolved?: boolean
          source?: string
          target?: string
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          borough: string
          city: string | null
          created_at: string
          email: string
          id: string
          last_name: string | null
          name: string
        }
        Insert: {
          borough: string
          city?: string | null
          created_at?: string
          email: string
          id?: string
          last_name?: string | null
          name: string
        }
        Update: {
          borough?: string
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          last_name?: string | null
          name?: string
        }
        Relationships: []
      }
      promises: {
        Row: {
          category: string
          created_at: string
          date_promised: string
          description: string
          editorial_state: string
          headline: string
          id: string
          last_updated: string
          owner_agency: string
          requires_state_action: string
          seo_tags: string
          short_description: string
          source_text: string
          source_url: string
          status: string
          targets: string
          updated_at: string
          updates: string
          url_slugs: string
        }
        Insert: {
          category?: string
          created_at?: string
          date_promised?: string
          description?: string
          editorial_state?: string
          headline?: string
          id?: string
          last_updated?: string
          owner_agency?: string
          requires_state_action?: string
          seo_tags?: string
          short_description?: string
          source_text?: string
          source_url?: string
          status?: string
          targets?: string
          updated_at?: string
          updates?: string
          url_slugs?: string
        }
        Update: {
          category?: string
          created_at?: string
          date_promised?: string
          description?: string
          editorial_state?: string
          headline?: string
          id?: string
          last_updated?: string
          owner_agency?: string
          requires_state_action?: string
          seo_tags?: string
          short_description?: string
          source_text?: string
          source_url?: string
          status?: string
          targets?: string
          updated_at?: string
          updates?: string
          url_slugs?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_cms_user: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const

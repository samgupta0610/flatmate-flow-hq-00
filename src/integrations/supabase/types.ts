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
      auto_send_history: {
        Row: {
          contact_id: string
          created_at: string
          error_message: string | null
          id: string
          sent_at: string
          status: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          status?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      house_groups: {
        Row: {
          created_at: string
          created_by: string
          group_name: string
          id: string
          join_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          group_name: string
          id?: string
          join_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          group_name?: string
          id?: string
          join_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      household_contacts: {
        Row: {
          contact_type: string
          created_at: string
          id: string
          name: string
          phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_type: string
          created_at?: string
          id?: string
          name: string
          phone_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_type?: string
          created_at?: string
          id?: string
          name?: string
          phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maid_contacts: {
        Row: {
          auto_send: boolean | null
          created_at: string
          days_of_week: string[] | null
          frequency: string | null
          id: string
          last_sent_at: string | null
          name: string
          phone: string
          send_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_send?: boolean | null
          created_at?: string
          days_of_week?: string[] | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          name?: string
          phone: string
          send_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_send?: boolean | null
          created_at?: string
          days_of_week?: string[] | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          name?: string
          phone?: string
          send_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maid_tasks: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          created_by: string | null
          days_of_week: string[] | null
          favorite: boolean | null
          id: string
          optional: boolean | null
          priority: string | null
          remarks: string | null
          selected: boolean | null
          task_category: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          created_by?: string | null
          days_of_week?: string[] | null
          favorite?: boolean | null
          id?: string
          optional?: boolean | null
          priority?: string | null
          remarks?: string | null
          selected?: boolean | null
          task_category?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          created_by?: string | null
          days_of_week?: string[] | null
          favorite?: boolean | null
          id?: string
          optional?: boolean | null
          priority?: string | null
          remarks?: string | null
          selected?: boolean | null
          task_category?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_contacts: {
        Row: {
          auto_send: boolean | null
          created_at: string
          days_of_week: string[] | null
          frequency: string | null
          id: string
          last_sent_at: string | null
          name: string
          phone: string
          send_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_send?: boolean | null
          created_at?: string
          days_of_week?: string[] | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          name?: string
          phone: string
          send_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_send?: boolean | null
          created_at?: string
          days_of_week?: string[] | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          name?: string
          phone?: string
          send_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_menus: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          menu_data: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          menu_data?: Json | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          menu_data?: Json | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_notifications: {
        Row: {
          created_at: string
          custom_message: string | null
          days_of_week: string[] | null
          enabled: boolean
          frequency: string
          id: string
          meal_type: string
          notification_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          days_of_week?: string[] | null
          enabled?: boolean
          frequency?: string
          id?: string
          meal_type: string
          notification_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          days_of_week?: string[] | null
          enabled?: boolean
          frequency?: string
          id?: string
          meal_type?: string
          notification_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_response_links: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          meal_date: string
          meal_type: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          meal_date: string
          meal_type: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          meal_date?: string
          meal_type?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      meal_responses: {
        Row: {
          created_at: string
          id: string
          meal_date: string
          meal_type: string
          person_name: string | null
          phone_number: string | null
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_date: string
          meal_type: string
          person_name?: string | null
          phone_number?: string | null
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_date?: string
          meal_type?: string
          person_name?: string | null
          phone_number?: string | null
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      message_history: {
        Row: {
          contact_name: string | null
          created_at: string
          id: string
          message_body: string
          message_type: string
          phone_number: string
          sent_at: string
          status: string
          ultramsg_id: string | null
          user_id: string
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          id?: string
          message_body: string
          message_type: string
          phone_number: string
          sent_at?: string
          status?: string
          ultramsg_id?: string | null
          user_id: string
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          id?: string
          message_body?: string
          message_type?: string
          phone_number?: string
          sent_at?: string
          status?: string
          ultramsg_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          house_group_id: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          house_group_id?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          house_group_id?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_house_group_id_fkey"
            columns: ["house_group_id"]
            isOneToOne: false
            referencedRelation: "house_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          description: string
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id: string
          rating: number | null
          status: Database["public"]["Enums"]["feedback_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_contacts: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          id: string
          phone_number: string
          shop_name: string
          shop_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          phone_number: string
          shop_name: string
          shop_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          phone_number?: string
          shop_name?: string
          shop_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_join_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      should_send_auto_reminder: {
        Args: {
          contact_auto_send: boolean
          contact_send_time: string
          contact_frequency: string
          contact_days_of_week: string[]
          contact_last_sent_at: string
        }
        Returns: boolean
      }
    }
    Enums: {
      feedback_status: "new" | "reviewed" | "in_progress" | "resolved"
      feedback_type:
        | "feature_request"
        | "bug_report"
        | "general"
        | "improvement"
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
      feedback_status: ["new", "reviewed", "in_progress", "resolved"],
      feedback_type: [
        "feature_request",
        "bug_report",
        "general",
        "improvement",
      ],
    },
  },
} as const

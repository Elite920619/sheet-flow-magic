export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          description: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          description: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      cached_live_events: {
        Row: {
          created_at: string
          event_data: Json
          event_id: string
          id: string
          region: string
          sport: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_id: string
          id?: string
          region: string
          sport: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_id?: string
          id?: string
          region?: string
          sport?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_bets: {
        Row: {
          ai_probability: string
          away_score: number | null
          away_team: string
          bet_type: string
          confidence: number
          created_at: string
          event_id: string
          home_score: number | null
          home_team: string
          id: string
          implied_probability: string
          league: string
          odds: string
          quarter: string | null
          sportsbook: string
          status: string | null
          time_left: string
          updated_at: string
          value_percentage: string
        }
        Insert: {
          ai_probability: string
          away_score?: number | null
          away_team: string
          bet_type: string
          confidence: number
          created_at?: string
          event_id: string
          home_score?: number | null
          home_team: string
          id?: string
          implied_probability: string
          league: string
          odds: string
          quarter?: string | null
          sportsbook: string
          status?: string | null
          time_left: string
          updated_at?: string
          value_percentage: string
        }
        Update: {
          ai_probability?: string
          away_score?: number | null
          away_team?: string
          bet_type?: string
          confidence?: number
          created_at?: string
          event_id?: string
          home_score?: number | null
          home_team?: string
          id?: string
          implied_probability?: string
          league?: string
          odds?: string
          quarter?: string | null
          sportsbook?: string
          status?: string | null
          time_left?: string
          updated_at?: string
          value_percentage?: string
        }
        Relationships: []
      }
      live_events_sync_status: {
        Row: {
          completed_at: string | null
          error_message: string | null
          events_synced: number | null
          id: string
          metadata: Json | null
          regions_completed: string[] | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          events_synced?: number | null
          id?: string
          metadata?: Json | null
          regions_completed?: string[] | null
          started_at?: string
          status?: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          events_synced?: number | null
          id?: string
          metadata?: Json | null
          regions_completed?: string[] | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_cvv: string | null
          card_expiry: string | null
          card_holder_name: string | null
          card_number: string | null
          created_at: string
          id: string
          is_default: boolean | null
          paypal_email: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          paypal_email?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_cvv?: string | null
          card_expiry?: string | null
          card_holder_name?: string | null
          card_number?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          paypal_email?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          payment_verified: boolean | null
          phone: string | null
          status: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          payment_verified?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          payment_verified?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bets: {
        Row: {
          bet_type: string
          event_name: string
          id: string
          league: string | null
          odds: string
          placed_at: string
          potential_payout: number
          settled_at: string | null
          sportsbook: string | null
          stake: number
          status: string
          teams: string | null
          user_id: string
        }
        Insert: {
          bet_type: string
          event_name: string
          id?: string
          league?: string | null
          odds: string
          placed_at?: string
          potential_payout: number
          settled_at?: string | null
          sportsbook?: string | null
          stake: number
          status?: string
          teams?: string | null
          user_id: string
        }
        Update: {
          bet_type?: string
          event_name?: string
          id?: string
          league?: string | null
          odds?: string
          placed_at?: string
          potential_payout?: number
          settled_at?: string | null
          sportsbook?: string | null
          stake?: number
          status?: string
          teams?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_verification: {
        Row: {
          address_verified: boolean | null
          created_at: string
          daily_limit: number | null
          documents_uploaded: Json | null
          email_verified: boolean | null
          id: string
          identity_verified: boolean | null
          kyc_status: string
          monthly_limit: number | null
          phone_verified: boolean | null
          updated_at: string
          user_id: string
          verification_level: number | null
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address_verified?: boolean | null
          created_at?: string
          daily_limit?: number | null
          documents_uploaded?: Json | null
          email_verified?: boolean | null
          id?: string
          identity_verified?: boolean | null
          kyc_status?: string
          monthly_limit?: number | null
          phone_verified?: boolean | null
          updated_at?: string
          user_id: string
          verification_level?: number | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address_verified?: boolean | null
          created_at?: string
          daily_limit?: number | null
          documents_uploaded?: Json | null
          email_verified?: boolean | null
          id?: string
          identity_verified?: boolean | null
          kyc_status?: string
          monthly_limit?: number | null
          phone_verified?: boolean | null
          updated_at?: string
          user_id?: string
          verification_level?: number | null
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      value_bets: {
        Row: {
          ai_prob: string
          bet_type: string
          confidence: string
          created_at: string
          event: string
          id: string
          implied_prob: string
          league: string
          odds: string
          sportsbook: string
          status: string | null
          team1: string
          team2: string
          time_left: string
          updated_at: string
          value: string
        }
        Insert: {
          ai_prob: string
          bet_type: string
          confidence: string
          created_at?: string
          event: string
          id?: string
          implied_prob: string
          league: string
          odds: string
          sportsbook: string
          status?: string | null
          team1: string
          team2: string
          time_left: string
          updated_at?: string
          value: string
        }
        Update: {
          ai_prob?: string
          bet_type?: string
          confidence?: string
          created_at?: string
          event?: string
          id?: string
          implied_prob?: string
          league?: string
          odds?: string
          sportsbook?: string
          status?: string | null
          team1?: string
          team2?: string
          time_left?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      wallet_accounts: {
        Row: {
          account_type: string
          balance: number
          created_at: string
          currency: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          currency: string
          description: string | null
          external_reference: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          processed_by: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
          wallet_account_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          currency?: string
          description?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_by?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
          wallet_account_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          currency?: string
          description?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          processed_by?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
          wallet_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_account_id_fkey"
            columns: ["wallet_account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string
          destination_details: Json
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string
          updated_at: string
          user_id: string
          wallet_transaction_id: string | null
          withdrawal_method: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string
          destination_details: Json
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
          wallet_transaction_id?: string | null
          withdrawal_method: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string
          destination_details?: Json
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          wallet_transaction_id?: string | null
          withdrawal_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          user_uuid: string
          notification_type: string
          notification_title: string
          notification_message: string
          notification_details?: string
          notification_metadata?: Json
        }
        Returns: string
      }
      get_unread_notification_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      mark_all_notifications_read: {
        Args: { user_uuid: string }
        Returns: number
      }
      mark_notification_read: {
        Args: { notification_id: string; user_uuid: string }
        Returns: boolean
      }
      process_wallet_transaction: {
        Args: {
          p_user_id: string
          p_transaction_type: string
          p_amount: number
          p_description?: string
          p_external_reference?: string
          p_payment_method?: string
          p_metadata?: Json
        }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

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
      webhook_data: {
        Row: {
          block_hash: string | null
          block_timestamp: string | null
          contract_address: string | null
          created_at: string
          event_type: string | null
          from_address: string | null
          is_from_address_cbw: boolean | null
          is_to_address_cbw: boolean | null
          log_index: string | null
          network_id: string
          to_address: string | null
          transaction_hash: string
          value: string | null
        }
        Insert: {
          block_hash?: string | null
          block_timestamp?: string | null
          contract_address?: string | null
          created_at?: string
          event_type?: string | null
          from_address?: string | null
          is_from_address_cbw?: boolean | null
          is_to_address_cbw?: boolean | null
          log_index?: string | null
          network_id: string
          to_address?: string | null
          transaction_hash: string
          value?: string | null
        }
        Update: {
          block_hash?: string | null
          block_timestamp?: string | null
          contract_address?: string | null
          created_at?: string
          event_type?: string | null
          from_address?: string | null
          is_from_address_cbw?: boolean | null
          is_to_address_cbw?: boolean | null
          log_index?: string | null
          network_id?: string
          to_address?: string | null
          transaction_hash?: string
          value?: string | null
        }
        Relationships: []
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

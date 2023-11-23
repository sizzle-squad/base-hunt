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
      badge_configuration: {
        Row: {
          contract_address: string
          cta_text: string | null
          cta_url: string | null
          game_id: number
          id: number
          image_url: string | null
          level: number | null
          minter: string
          name: string
          points: number
          token_id: number
          type: Database["public"]["Enums"]["badge_type"]
        }
        Insert: {
          contract_address: string
          cta_text?: string | null
          cta_url?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          level?: number | null
          minter: string
          name: string
          points?: number
          token_id: number
          type?: Database["public"]["Enums"]["badge_type"]
        }
        Update: {
          contract_address?: string
          cta_text?: string | null
          cta_url?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          level?: number | null
          minter?: string
          name?: string
          points?: number
          token_id?: number
          type?: Database["public"]["Enums"]["badge_type"]
        }
        Relationships: []
      }
      boost_configuration: {
        Row: {
          available_time: string | null
          boost_type: Database["public"]["Enums"]["boost_type"]
          contract_addresses: string[]
          cta_text: string | null
          cta_url: string | null
          game_id: number
          id: number
          image_url: string | null
          is_enabled: boolean
          name: string
          network: string
          nft_amount: number | null
          points: number
          refresh_time: string | null
          transaction_from: string | null
          transaction_to: string | null
          transaction_value_threshold: number | null
        }
        Insert: {
          available_time?: string | null
          boost_type?: Database["public"]["Enums"]["boost_type"]
          contract_addresses: string[]
          cta_text?: string | null
          cta_url?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          is_enabled?: boolean
          name: string
          network?: string
          nft_amount?: number | null
          points?: number
          refresh_time?: string | null
          transaction_from?: string | null
          transaction_to?: string | null
          transaction_value_threshold?: number | null
        }
        Update: {
          available_time?: string | null
          boost_type?: Database["public"]["Enums"]["boost_type"]
          contract_addresses?: string[]
          cta_text?: string | null
          cta_url?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          is_enabled?: boolean
          name?: string
          network?: string
          nft_amount?: number | null
          points?: number
          refresh_time?: string | null
          transaction_from?: string | null
          transaction_to?: string | null
          transaction_value_threshold?: number | null
        }
        Relationships: []
      }
      claimed_boost: {
        Row: {
          boost_id: number
          contract_address: string | null
          game_id: number
          id: number
          transaction_hash: string | null
          updated_at: string
          user_address: string
        }
        Insert: {
          boost_id: number
          contract_address?: string | null
          game_id: number
          id?: number
          transaction_hash?: string | null
          updated_at?: string
          user_address: string
        }
        Update: {
          boost_id?: number
          contract_address?: string | null
          game_id?: number
          id?: number
          transaction_hash?: string | null
          updated_at?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "claimed_boost_boost_id_fkey"
            columns: ["boost_id"]
            isOneToOne: false
            referencedRelation: "boost_configuration"
            referencedColumns: ["id"]
          }
        ]
      }
      level_configuration: {
        Row: {
          airdrop_command: string
          created_at: string
          game_id: number
          id: number
          level: string | null
          name: string
          threshold_points: number
        }
        Insert: {
          airdrop_command: string
          created_at?: string
          game_id: number
          id?: number
          level?: string | null
          name: string
          threshold_points: number
        }
        Update: {
          airdrop_command?: string
          created_at?: string
          game_id?: number
          id?: number
          level?: string | null
          name?: string
          threshold_points?: number
        }
        Relationships: []
      }
      score: {
        Row: {
          current_score: number
          game_id: number
          id: number
          updated_at: string
          user_address: string
        }
        Insert: {
          current_score?: number
          game_id: number
          id?: number
          updated_at?: string
          user_address: string
        }
        Update: {
          current_score?: number
          game_id?: number
          id?: number
          updated_at?: string
          user_address?: string
        }
        Relationships: []
      }
      treasure_box_configuration: {
        Row: {
          created_at: string
          game_id: number
          id: number
          location: string | null
          name: string
          total_hitpoints: number
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          location?: string | null
          name: string
          total_hitpoints: number
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          location?: string | null
          name?: string
          total_hitpoints?: number
        }
        Relationships: []
      }
      treasure_box_entries: {
        Row: {
          cbid: string | null
          created_at: string
          ens_name: string | null
          game_id: number
          id: number
          tap_count: number
          total_hitpoints: number
          user_address: string
        }
        Insert: {
          cbid?: string | null
          created_at?: string
          ens_name?: string | null
          game_id: number
          id?: number
          tap_count?: number
          total_hitpoints: number
          user_address: string
        }
        Update: {
          cbid?: string | null
          created_at?: string
          ens_name?: string | null
          game_id?: number
          id?: number
          tap_count?: number
          total_hitpoints?: number
          user_address?: string
        }
        Relationships: []
      }
      treasure_box_state: {
        Row: {
          created_at: string
          current_hitpoints: number
          game_id: number | null
          id: number
          is_open: boolean
        }
        Insert: {
          created_at?: string
          current_hitpoints: number
          game_id?: number | null
          id?: number
          is_open?: boolean
        }
        Update: {
          created_at?: string
          current_hitpoints?: number
          game_id?: number | null
          id?: number
          is_open?: boolean
        }
        Relationships: []
      }
      webhook_data: {
        Row: {
          block_hash: string | null
          block_timestamp: string | null
          contract_address: string | null
          created_at: string
          event_type: string | null
          from_address: string | null
          id: number
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
          id?: number
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
          id?: number
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
      getbadges: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      getbadgestate: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      gettransfernftboosts: {
        Args: {
          _game_id: number
          _num_badges: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      getuserrank: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      upsertscore: {
        Args: {
          _game_id: number
          _user_address: string
          _increment: number
        }
        Returns: {
          j: Json
        }[]
      }
      upserttreasurebox: {
        Args: {
          _game_id: number
          _user_address: string
          _cbid: string
          _ens_name: string
          _increment: number
          _tap_count: number
        }
        Returns: {
          j: Json
        }[]
      }
    }
    Enums: {
      badge_type: "online" | "irl" | "level"
      boost_type:
        | "TRANSFER_NFT"
        | "NFT"
        | "NFT_PER_MINT"
        | "TOKEN"
        | "RECURRING"
        | "TRANSACTION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
      address_gameid_configuration: {
        Row: {
          address: string | null
          created_at: string
          game_id: number | null
          id: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          game_id?: number | null
          id?: number
        }
        Relationships: []
      }
      badge_configuration: {
        Row: {
          artist_name: string | null
          contract_address: string
          cta_text: string | null
          cta_url: string | null
          description: string | null
          game_id: number
          id: number
          image_url: string | null
          lat_lng: string | null
          level: number | null
          minter: string
          name: string
          token_id: number
          type: Database["public"]["Enums"]["badge_type"]
        }
        Insert: {
          artist_name?: string | null
          contract_address: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          lat_lng?: string | null
          level?: number | null
          minter: string
          name: string
          token_id: number
          type?: Database["public"]["Enums"]["badge_type"]
        }
        Update: {
          artist_name?: string | null
          contract_address?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          lat_lng?: string | null
          level?: number | null
          minter?: string
          name?: string
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
          cta_button_text: string | null
          cta_text: string | null
          cta_url: string | null
          description: string
          game_id: number
          icon: Database["public"]["Enums"]["boost_icon"]
          id: number
          image_url: string | null
          is_enabled: boolean
          max_threshold: number | null
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
          cta_button_text?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string
          game_id?: number
          icon?: Database["public"]["Enums"]["boost_icon"]
          id?: number
          image_url?: string | null
          is_enabled?: boolean
          max_threshold?: number | null
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
          cta_button_text?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string
          game_id?: number
          icon?: Database["public"]["Enums"]["boost_icon"]
          id?: number
          image_url?: string | null
          is_enabled?: boolean
          max_threshold?: number | null
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
      challenge_configuration: {
        Row: {
          auto_claim: boolean | null
          content_data: Json | null
          contract_address: string | null
          created_at: string
          display_name: string
          end_timestamp: string | null
          function_type:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id: number | null
          id: number
          is_dynamic_points: boolean
          is_enabled: boolean
          network: Database["public"]["Enums"]["networks"] | null
          params: Json | null
          points: number
          start_timestamp: string | null
          type: Database["public"]["Enums"]["challenge_type"]
        }
        Insert: {
          auto_claim?: boolean | null
          content_data?: Json | null
          contract_address?: string | null
          created_at?: string
          display_name: string
          end_timestamp?: string | null
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          is_dynamic_points?: boolean
          is_enabled: boolean
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
          points: number
          start_timestamp?: string | null
          type: Database["public"]["Enums"]["challenge_type"]
        }
        Update: {
          auto_claim?: boolean | null
          content_data?: Json | null
          contract_address?: string | null
          created_at?: string
          display_name?: string
          end_timestamp?: string | null
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          is_dynamic_points?: boolean
          is_enabled?: boolean
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
          points?: number
          start_timestamp?: string | null
          type?: Database["public"]["Enums"]["challenge_type"]
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
      guild_configuration: {
        Row: {
          created_at: string
          game_id: number | null
          guild_id: string
          id: number
          name: string | null
          total_member_count: number | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          guild_id: string
          id?: number
          name?: string | null
          total_member_count?: number | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          guild_id?: string
          id?: number
          name?: string | null
          total_member_count?: number | null
        }
        Relationships: []
      }
      guild_member_configuration: {
        Row: {
          created_at: string
          game_id: number | null
          guild_id: string
          id: number
          user_address: string
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          guild_id: string
          id?: number
          user_address: string
        }
        Update: {
          created_at?: string
          game_id?: number | null
          guild_id?: string
          id?: number
          user_address?: string
        }
        Relationships: []
      }
      guild_score: {
        Row: {
          game_id: number | null
          guild_id: string | null
          id: number
          score: number | null
          updated_at: string
        }
        Insert: {
          game_id?: number | null
          guild_id?: string | null
          id?: number
          score?: number | null
          updated_at?: string
        }
        Update: {
          game_id?: number | null
          guild_id?: string | null
          id?: number
          score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      level_configuration: {
        Row: {
          airdrop_command: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          contract_address: string | null
          created_at: string
          cta_url: string | null
          description: string | null
          game_id: number
          id: number
          image_url: string | null
          level: string | null
          minter: string | null
          name: string
          threshold_points: number
          token_id: number | null
        }
        Insert: {
          airdrop_command: string
          badge_type?: Database["public"]["Enums"]["badge_type"]
          contract_address?: string | null
          created_at?: string
          cta_url?: string | null
          description?: string | null
          game_id: number
          id?: number
          image_url?: string | null
          level?: string | null
          minter?: string | null
          name: string
          threshold_points: number
          token_id?: number | null
        }
        Update: {
          airdrop_command?: string
          badge_type?: Database["public"]["Enums"]["badge_type"]
          contract_address?: string | null
          created_at?: string
          cta_url?: string | null
          description?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
          level?: string | null
          minter?: string | null
          name?: string
          threshold_points?: number
          token_id?: number | null
        }
        Relationships: []
      }
      level_data: {
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
          value: number | null
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
          value?: number | null
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
          value?: number | null
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
          cta_url: string | null
          game_id: number
          id: number
          image_url: string | null
          location: string | null
          name: string
          total_hitpoints: number
        }
        Insert: {
          created_at?: string
          cta_url?: string | null
          game_id: number
          id?: number
          image_url?: string | null
          location?: string | null
          name: string
          total_hitpoints: number
        }
        Update: {
          created_at?: string
          cta_url?: string | null
          game_id?: number
          id?: number
          image_url?: string | null
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
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
      user_challenge_status: {
        Row: {
          challenge_id: number
          created_at: string
          game_id: number
          id: number
          points: number
          status: Database["public"]["Enums"]["challenge_status"]
          user_address: string
        }
        Insert: {
          challenge_id: number
          created_at?: string
          game_id?: number
          id?: number
          points?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          user_address: string
        }
        Update: {
          challenge_id?: number
          created_at?: string
          game_id?: number
          id?: number
          points?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_status_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenge_configuration"
            referencedColumns: ["id"]
          }
        ]
      }
      user_txcount: {
        Row: {
          created_at: string
          network: Database["public"]["Enums"]["networks"]
          tx_count: number | null
          user_address: string
        }
        Insert: {
          created_at?: string
          network?: Database["public"]["Enums"]["networks"]
          tx_count?: number | null
          user_address: string
        }
        Update: {
          created_at?: string
          network?: Database["public"]["Enums"]["networks"]
          tx_count?: number | null
          user_address?: string
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
          value: number | null
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
          value?: number | null
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
          value?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      getbadgestate: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      getlevelstate: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      getscorerank: {
        Args: {
          _game_id: number
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
      boost_icon:
        | "WALLET"
        | "COFFEE"
        | "BAG"
        | "GRID"
        | "CIRCLE"
        | "LINK"
        | "USERS"
      boost_type:
        | "TRANSFER_NFT"
        | "NFT"
        | "NFT_PER_MINT"
        | "TOKEN"
        | "DEFAULT"
        | "TRANSACTION"
        | "SOCIAL"
      challenge_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE"
      challenge_type:
        | "ERC_TRANSFER"
        | "BALANCE_CHECK"
        | "CONTRACT_INTERACTION"
        | "TRIVIA"
        | "SOCIAL"
        | "EVENT_TYPE_TRANSFER_ERC1155"
        | "EVENT_TYPE_TRANSFER_ERC20"
        | "EVENT_TYPE_TRANSFER_ERC721"
        | "EVENT_TYPE_CONTRACT_EXECUTION"
        | "GUILD"
      check_function_type:
        | "checkMint"
        | "checkTrivia"
        | "checkFunctionExecution"
        | "checkBalance"
        | "checkTokenIdBalance"
        | "checkTxCountBatch"
      networks: "networks/base-mainnet" | "networks/eth-mainnet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

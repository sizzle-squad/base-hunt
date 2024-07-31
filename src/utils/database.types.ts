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
      badge_configuration: {
        Row: {
          contract_address: string | null
          function_type:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id: number | null
          id: number
          name: string | null
          network: Database["public"]["Enums"]["networks"] | null
          params: Json | null
        }
        Insert: {
          contract_address?: string | null
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          name?: string | null
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
        }
        Update: {
          contract_address?: string | null
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          name?: string | null
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
        }
        Relationships: []
      }
      challenge_configuration: {
        Row: {
          badge_id: number | null
          challenge_id: string
          contract_address: string | null
          created_at: string
          display_name: string
          function_type:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id: number | null
          id: number
          params: Json | null
        }
        Insert: {
          badge_id?: number | null
          challenge_id: string
          contract_address?: string | null
          created_at?: string
          display_name: string
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          params?: Json | null
        }
        Update: {
          badge_id?: number | null
          challenge_id?: string
          contract_address?: string | null
          created_at?: string
          display_name?: string
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          params?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_configuration_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_configuration_duplicate: {
        Row: {
          badge_id: number | null
          challenge_id: string
          content_data: Json | null
          contract_address: string | null
          created_at: string
          display_name: string
          function_type:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id: number | null
          id: number
          network: Database["public"]["Enums"]["networks"] | null
          params: Json | null
          points: number
          type: Database["public"]["Enums"]["challenge_type"]
        }
        Insert: {
          badge_id?: number | null
          challenge_id: string
          content_data?: Json | null
          contract_address?: string | null
          created_at?: string
          display_name: string
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
          points: number
          type: Database["public"]["Enums"]["challenge_type"]
        }
        Update: {
          badge_id?: number | null
          challenge_id?: string
          content_data?: Json | null
          contract_address?: string | null
          created_at?: string
          display_name?: string
          function_type?:
            | Database["public"]["Enums"]["check_function_type"]
            | null
          game_id?: number | null
          id?: number
          network?: Database["public"]["Enums"]["networks"] | null
          params?: Json | null
          points?: number
          type?: Database["public"]["Enums"]["challenge_type"]
        }
        Relationships: [
          {
            foreignKeyName: "challenge_configuration_duplicate_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          asset_address: string
          created_at: string
          id: number
          logo: string | null
          num_onboarded: number
          symbol: string | null
        }
        Insert: {
          asset_address: string
          created_at?: string
          id?: number
          logo?: string | null
          num_onboarded?: number
          symbol?: string | null
        }
        Update: {
          asset_address?: string
          created_at?: string
          id?: number
          logo?: string | null
          num_onboarded?: number
          symbol?: string | null
        }
        Relationships: []
      }
      level_configuration: {
        Row: {
          airdrop_command: string
          badge_type: Database["public"]["Enums"]["badge_type"]
          contract_address: string | null
          created_at: string
          description: string | null
          game_id: number
          id: number
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
          description?: string | null
          game_id: number
          id?: number
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
          description?: string | null
          game_id?: number
          id?: number
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
          game_id: number | null
          id: number
          updated_at: string | null
          user_address: string | null
        }
        Insert: {
          current_score: number
          game_id?: number | null
          id?: number
          updated_at?: string | null
          user_address?: string | null
        }
        Update: {
          current_score?: number
          game_id?: number | null
          id?: number
          updated_at?: string | null
          user_address?: string | null
        }
        Relationships: []
      }
      score_greater_than_250: {
        Row: {
          current_score: number
          game_id: number | null
          id: number
          updated_at: string | null
          user_address: string | null
        }
        Insert: {
          current_score: number
          game_id?: number | null
          id: number
          updated_at?: string | null
          user_address?: string | null
        }
        Update: {
          current_score?: number
          game_id?: number | null
          id?: number
          updated_at?: string | null
          user_address?: string | null
        }
        Relationships: []
      }
      score_less_than_or_equal_to_250: {
        Row: {
          current_score: number
          game_id: number | null
          id: number
          updated_at: string | null
          user_address: string | null
        }
        Insert: {
          current_score: number
          game_id?: number | null
          id: number
          updated_at?: string | null
          user_address?: string | null
        }
        Update: {
          current_score?: number
          game_id?: number | null
          id?: number
          updated_at?: string | null
          user_address?: string | null
        }
        Relationships: []
      }
      user_address_opt_in: {
        Row: {
          created_at: string
          game_id: number
          id: number
          is_opt_in: boolean
          is_opt_in_sweepstakes: boolean
          user_address: string
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          is_opt_in?: boolean
          is_opt_in_sweepstakes?: boolean
          user_address: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          is_opt_in?: boolean
          is_opt_in_sweepstakes?: boolean
          user_address?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: number | null
          created_at: string
          game_id: number | null
          id: number
          user_address: string | null
        }
        Insert: {
          badge_id?: number | null
          created_at?: string
          game_id?: number | null
          id?: number
          user_address?: string | null
        }
        Update: {
          badge_id?: number | null
          created_at?: string
          game_id?: number | null
          id?: number
          user_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_status: {
        Row: {
          challenge_id: string
          created_at: string
          game_id: number
          id: number
          points: number
          status: Database["public"]["Enums"]["challenge_status"]
          user_address: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          game_id?: number
          id?: number
          points?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          user_address: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          game_id?: number
          id?: number
          points?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          user_address?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          asset_address: string | null
          created_at: string
          id: number
          tx_hash: string | null
          user_address: string | null
        }
        Insert: {
          asset_address?: string | null
          created_at?: string
          id?: number
          tx_hash?: string | null
          user_address?: string | null
        }
        Update: {
          asset_address?: string | null
          created_at?: string
          id?: number
          tx_hash?: string | null
          user_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_asset_address_fkey"
            columns: ["asset_address"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["asset_address"]
          },
        ]
      }
      user_referrals: {
        Row: {
          created_at: string
          game_id: number
          id: number
          referral_id: string
          referred_by_id: string | null
          user_address: string
        }
        Insert: {
          created_at?: string
          game_id?: number
          id?: number
          referral_id?: string
          referred_by_id?: string | null
          user_address: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          referral_id?: string
          referred_by_id?: string | null
          user_address?: string
        }
        Relationships: []
      }
      user_spins: {
        Row: {
          created_at: string
          created_date: string | null
          game_id: number | null
          id: number
          spin_result: number | null
          user_address: string | null
        }
        Insert: {
          created_at?: string
          created_date?: string | null
          game_id?: number | null
          id?: number
          spin_result?: number | null
          user_address?: string | null
        }
        Update: {
          created_at?: string
          created_date?: string | null
          game_id?: number | null
          id?: number
          spin_result?: number | null
          user_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_spins_spin_result_fkey"
            columns: ["spin_result"]
            isOneToOne: false
            referencedRelation: "wheel_configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      wheel_configuration: {
        Row: {
          created_at: string
          enabled: boolean
          game_id: number | null
          id: number
          points: number | null
          probability: number | null
          type: Database["public"]["Enums"]["spin_type"] | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          game_id?: number | null
          id?: number
          points?: number | null
          probability?: number | null
          type?: Database["public"]["Enums"]["spin_type"] | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          game_id?: number | null
          id?: number
          points?: number | null
          probability?: number | null
          type?: Database["public"]["Enums"]["spin_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_or_create_community: {
        Args: {
          _asset_address: string
          _symbol: string
          _logo: string
        }
        Returns: undefined
      }
      get_all_badges: {
        Args: {
          _game_id: number
        }
        Returns: Json
      }
      get_challenge_completion_count: {
        Args: {
          _game_id: number
          _limit: number
          _offset: number
        }
        Returns: Json
      }
      get_challenge_count_by_challenges: {
        Args: {
          _game_id: number
          _challenge_ids: Json
        }
        Returns: Json
      }
      get_is_opt_in_sweepstakes: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: boolean
      }
      get_recent_payouts: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_referral_data: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          referral_id: string
          count: number
        }[]
      }
      get_top_referrers: {
        Args: {
          _game_id: number
        }
        Returns: {
          user_address: string
          count: number
        }[]
      }
      get_user_challenge_status: {
        Args: {
          _user_address: string
          _challenge_ids: Json
        }
        Returns: Json
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
      getscorerankv2: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: {
          j: Json
        }[]
      }
      getspindata: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: Json
      }
      getuserbadges: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: Json
      }
      "getuserbadges-v2": {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: Json
      }
      getuserguild: {
        Args: {
          _user_address: string
          _game_id: number
        }
        Returns: Json
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
      guildmembercount: {
        Args: {
          _game_id: number
        }
        Returns: {
          guild: string
          count: number
        }[]
      }
      incrementuserscore: {
        Args: {
          _game_id: number
          _user_address: string
          _score: number
        }
        Returns: boolean
      }
      opt_in_and_track_referrals: {
        Args: {
          _game_id: number
          _user_address: string
          _referral_id: string
        }
        Returns: boolean
      }
      opt_in_sweepstakes: {
        Args: {
          _game_id: number
          _user_address: string
        }
        Returns: undefined
      }
      reward_referral: {
        Args: {
          _game_id: number
          _referree_address: string
        }
        Returns: undefined
      }
      update_accumulate_user_score: {
        Args: {
          _game_id: number
          _user_address: string
          _read_only: boolean
        }
        Returns: number
      }
      update_spin_and_points: {
        Args: {
          _game_id: number
          _user_address: string
          _last_spin_id: number
          _points_increment: number
        }
        Returns: Record<string, unknown>
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
        | "checkJoinGuild"
        | "checkCoinbaseOne"
        | "checkTokensCount"
        | "checkNftTokensCount"
        | "checkBypass"
      networks: "networks/base-mainnet" | "networks/eth-mainnet"
      spin_type: "POINTS" | "USDC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

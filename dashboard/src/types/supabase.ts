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
      agents: {
        Row: {
          id: string
          name: string
          description: string | null
          model_id: string | null
          prompt_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          configuration: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          model_id?: string | null
          prompt_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          configuration?: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          model_id?: string | null
          prompt_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          configuration?: Json
          is_active?: boolean
        }
      }
      prompts: {
        Row: {
          id: string
          name: string
          description: string | null
          content: string
          created_at: string
          updated_at: string
          created_by: string | null
          variables: Json
          version: number
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          content: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          variables?: Json
          version?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          content?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          variables?: Json
          version?: number
          is_active?: boolean
        }
      }
      datasets: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          file_path: string | null
          format: string | null
          row_count: number
          metadata: Json
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          file_path?: string | null
          format?: string | null
          row_count?: number
          metadata?: Json
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          file_path?: string | null
          format?: string | null
          row_count?: number
          metadata?: Json
        }
      }
      evaluations: {
        Row: {
          id: string
          name: string
          description: string | null
          agent_id: string | null
          dataset_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          status: string
          metrics: Json
          config: Json
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          agent_id?: string | null
          dataset_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          status?: string
          metrics?: Json
          config?: Json
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          agent_id?: string | null
          dataset_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          status?: string
          metrics?: Json
          config?: Json
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          api_schema: Json
          implementation: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          api_schema: Json
          implementation?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          api_schema?: Json
          implementation?: string | null
          is_active?: boolean
        }
      }
      memory_records: {
        Row: {
          id: string
          content: string
          metadata: Json
          embedding: number[] | null
          created_at: string
          updated_at: string
          agent_id: string | null
        }
        Insert: {
          id?: string
          content: string
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          agent_id?: string | null
        }
        Update: {
          id?: string
          content?: string
          metadata?: Json
          embedding?: number[] | null
          created_at?: string
          updated_at?: string
          agent_id?: string | null
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

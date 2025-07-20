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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      autor: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      Libros: {
        Row: {
          fecha_publicacion: string
          id_libro: number
          sinopsis: string
          titulo: string
          url_portada: string | null
        }
        Insert: {
          fecha_publicacion: string
          id_libro?: number
          sinopsis: string
          titulo: string
          url_portada?: string | null
        }
        Update: {
          fecha_publicacion?: string
          id_libro?: number
          sinopsis?: string
          titulo?: string
          url_portada?: string | null
        }
        Relationships: []
      }
      libros_autores: {
        Row: {
          autor_id: number
          libro_id: number
        }
        Insert: {
          autor_id: number
          libro_id: number
        }
        Update: {
          autor_id?: number
          libro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "libros_autores_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "autor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "libros_autores_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
        ]
      }
      libros_fisicos: {
        Row: {
          cantidad: number
          id: number
          libro_id: number
        }
        Insert: {
          cantidad?: number
          id?: number
          libro_id: number
        }
        Update: {
          cantidad?: number
          id?: number
          libro_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "libros_fisicos_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
        ]
      }
      libros_virtuales: {
        Row: {
          direccion_del_libro: string
          id: number
          libro_id: number | null
        }
        Insert: {
          direccion_del_libro: string
          id?: number
          libro_id?: number | null
        }
        Update: {
          direccion_del_libro?: string
          id?: number
          libro_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "libros_virtuales_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
        ]
      }
      proyecto_investigacion: {
        Row: {
          escuela: string
          id: number
          libro_id: number | null
          periodo_academico: string
          tutor_id: number
        }
        Insert: {
          escuela: string
          id?: number
          libro_id?: number | null
          periodo_academico: string
          tutor_id: number
        }
        Update: {
          escuela?: string
          id?: number
          libro_id?: number | null
          periodo_academico?: string
          tutor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_investigacion_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
          {
            foreignKeyName: "proyecto_investigacion_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          "fecha _pedido": string
          fecha_fin: string
          fecha_inicio: string
          id_reservas: number
          libro_id: number
          tipo_de_libro: string
          usuario_id: number
        }
        Insert: {
          "fecha _pedido": string
          fecha_fin: string
          fecha_inicio: string
          id_reservas?: number
          libro_id: number
          tipo_de_libro: string
          usuario_id: number
        }
        Update: {
          "fecha _pedido"?: string
          fecha_fin?: string
          fecha_inicio?: string
          id_reservas?: number
          libro_id?: number
          tipo_de_libro?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
          {
            foreignKeyName: "reservas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tesis: {
        Row: {
          escuela: string | null
          id: number
          libro_id: number | null
          periodo_academico: string | null
          tutor_id: number
        }
        Insert: {
          escuela?: string | null
          id?: number
          libro_id?: number | null
          periodo_academico?: string | null
          tutor_id: number
        }
        Update: {
          escuela?: string | null
          id?: number
          libro_id?: number | null
          periodo_academico?: string | null
          tutor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tesis_libro_id_fkey"
            columns: ["libro_id"]
            isOneToOne: false
            referencedRelation: "Libros"
            referencedColumns: ["id_libro"]
          },
          {
            foreignKeyName: "tesis_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          contraseña: string
          correo: string
          escuela: number | null
          estado: string | null
          id: number
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Insert: {
          contraseña: string
          correo: string
          escuela?: number | null
          estado?: string | null
          id?: number
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
        }
        Update: {
          contraseña?: string
          correo?: string
          escuela?: number | null
          estado?: string | null
          id?: number
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
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
      rol_usuario: "estudiante" | "docente" | "administrador"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      rol_usuario: ["estudiante", "docente", "administrador"],
    },
  },
} as const

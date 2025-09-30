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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      AnalysisFWPipe: {
        Row: {
          account_id: string
          bandStl: string
          created_at: string
          cycles: Json
          id: string
          revision_id: string
          spec_id: string | null
          tenant_id: string
          volume_m3: number
          weight_kg: number
        }
        Insert: {
          account_id: string
          bandStl: string
          created_at?: string
          cycles: Json
          id?: string
          revision_id: string
          spec_id?: string | null
          tenant_id: string
          volume_m3: number
          weight_kg: number
        }
        Update: {
          account_id?: string
          bandStl?: string
          created_at?: string
          cycles?: Json
          id?: string
          revision_id?: string
          spec_id?: string | null
          tenant_id?: string
          volume_m3?: number
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "AnalysisFWPipe_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AnalysisFWPipe_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: true
            referencedRelation: "SpecFWPipe"
            referencedColumns: ["id"]
          },
        ]
      }
      AnalysisLaminateSheet: {
        Row: {
          account_id: string
          actors: Json
          created_at: string
          id: string
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Insert: {
          account_id: string
          actors: Json
          created_at?: string
          id?: string
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Update: {
          account_id?: string
          actors?: Json
          created_at?: string
          id?: string
          revision_id?: string
          spec_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "AnalysisLaminatePlate_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AnalysisLaminateSheet_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "SpecLaminateSheet"
            referencedColumns: ["id"]
          },
        ]
      }
      AnalysisPrint3d: {
        Row: {
          account_id: string
          actors: Json | null
          created_at: string
          id: string
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Insert: {
          account_id: string
          actors?: Json | null
          created_at?: string
          id?: string
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Update: {
          account_id?: string
          actors?: Json | null
          created_at?: string
          id?: string
          revision_id?: string
          spec_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "AnalysisPrint3d_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AnalysisPrint3d_spec_id_fkey1"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "SpecPrint3d"
            referencedColumns: ["id"]
          },
        ]
      }
      AnalysisRubberCompressionMold: {
        Row: {
          account_id: string
          created_at: string
          female_bbox: Json | null
          female_stl: string
          female_volume_mm3: number
          id: string
          instance_x: number
          instance_y: number
          male_bbox: Json | null
          male_stl: string
          male_volume_mm3: number
          part_bbox: Json | null
          part_stl: string
          part_volume_mm3: number
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          female_bbox?: Json | null
          female_stl: string
          female_volume_mm3: number
          id?: string
          instance_x: number
          instance_y: number
          male_bbox?: Json | null
          male_stl: string
          male_volume_mm3: number
          part_bbox?: Json | null
          part_stl: string
          part_volume_mm3: number
          revision_id: string
          spec_id: string
          tenant_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          female_bbox?: Json | null
          female_stl?: string
          female_volume_mm3?: number
          id?: string
          instance_x?: number
          instance_y?: number
          male_bbox?: Json | null
          male_stl?: string
          male_volume_mm3?: number
          part_bbox?: Json | null
          part_stl?: string
          part_volume_mm3?: number
          revision_id?: string
          spec_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "AnalysisRubberCompressionMold_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AnalysisRubberCompressionMold_spec_id_fkey"
            columns: ["spec_id"]
            isOneToOne: false
            referencedRelation: "SpecRubberCompressionMold"
            referencedColumns: ["id"]
          },
        ]
      }
      File: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          id: string
          index: number
          name: string
          order_id: string
          part_stable_id: string | null
          tenant_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by: string
          id?: string
          index: number
          name: string
          order_id: string
          part_stable_id?: string | null
          tenant_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          id?: string
          index?: number
          name?: string
          order_id?: string
          part_stable_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "File_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      FileRevision: {
        Row: {
          account_id: string
          blob: string
          content_type: string
          created_at: string
          created_by: string
          file_id: string
          id: string
          order_id: string
          size: number
          tenant_id: string
        }
        Insert: {
          account_id: string
          blob: string
          content_type: string
          created_at?: string
          created_by: string
          file_id: string
          id?: string
          order_id: string
          size: number
          tenant_id: string
        }
        Update: {
          account_id?: string
          blob?: string
          content_type?: string
          created_at?: string
          created_by?: string
          file_id?: string
          id?: string
          order_id?: string
          size?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "FileRevision_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "File"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FileRevision_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      Item: {
        Row: {
          account_id: string
          created_at: string
          currency: string
          depends_on: number
          id: number
          lead_time_days: number
          name: string
          part_id: string | null
          quantity: number
          tenant_id: string
          total: number | null
          unit_price: number
        }
        Insert: {
          account_id: string
          created_at?: string
          currency: string
          depends_on: number
          id?: number
          lead_time_days: number
          name: string
          part_id?: string | null
          quantity: number
          tenant_id: string
          total?: number | null
          unit_price: number
        }
        Update: {
          account_id?: string
          created_at?: string
          currency?: string
          depends_on?: number
          id?: number
          lead_time_days?: number
          name?: string
          part_id?: string | null
          quantity?: number
          tenant_id?: string
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "Item_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "Part"
            referencedColumns: ["id"]
          },
        ]
      }
      Order: {
        Row: {
          account_id: string
          billing_address_id: string | null
          country3: string
          created_at: string
          created_by: string
          custom_name: string
          id: string
          latest_revision: string | null
          latest_version: string | null
          ordered_at: string | null
          ordered_revision_id: string | null
          ordered_version_id: string | null
          shipping_address_id: string | null
          tenant_id: string
        }
        Insert: {
          account_id: string
          billing_address_id?: string | null
          country3: string
          created_at?: string
          created_by?: string
          custom_name: string
          id?: string
          latest_revision?: string | null
          latest_version?: string | null
          ordered_at?: string | null
          ordered_revision_id?: string | null
          ordered_version_id?: string | null
          shipping_address_id?: string | null
          tenant_id: string
        }
        Update: {
          account_id?: string
          billing_address_id?: string | null
          country3?: string
          created_at?: string
          created_by?: string
          custom_name?: string
          id?: string
          latest_revision?: string | null
          latest_version?: string | null
          ordered_at?: string | null
          ordered_revision_id?: string | null
          ordered_version_id?: string | null
          shipping_address_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Order_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "OrderAddress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_latest_revision_fkey"
            columns: ["latest_revision"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_latest_version_fkey"
            columns: ["latest_version"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_ordered_revision_id_fkey"
            columns: ["ordered_revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_ordered_version_id_fkey"
            columns: ["ordered_version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Order_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "OrderAddress"
            referencedColumns: ["id"]
          },
        ]
      }
      OrderAddress: {
        Row: {
          account_id: string
          city: string
          country: string
          id: string
          state: string | null
          street: string
          tenant_id: string
          zip_code: string
        }
        Insert: {
          account_id: string
          city: string
          country: string
          id?: string
          state?: string | null
          street: string
          tenant_id: string
          zip_code: string
        }
        Update: {
          account_id?: string
          city?: string
          country?: string
          id?: string
          state?: string | null
          street?: string
          tenant_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      Part: {
        Row: {
          account_id: string
          actor_index: number
          analysis_id: string | null
          id: string
          index: number
          name: string
          order_id: string
          revision_id: string
          spec_id: string
          stable_id: string
          subspec_id: string
          subspec_type: string
          tenant_id: string
          type: string
          version_id: string
        }
        Insert: {
          account_id: string
          actor_index: number
          analysis_id?: string | null
          id?: string
          index: number
          name: string
          order_id: string
          revision_id: string
          spec_id: string
          stable_id?: string
          subspec_id: string
          subspec_type: string
          tenant_id: string
          type: string
          version_id: string
        }
        Update: {
          account_id?: string
          actor_index?: number
          analysis_id?: string | null
          id?: string
          index?: number
          name?: string
          order_id?: string
          revision_id?: string
          spec_id?: string
          stable_id?: string
          subspec_id?: string
          subspec_type?: string
          tenant_id?: string
          type?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Part_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Part_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Part_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      Revision: {
        Row: {
          account_id: string
          claimed_at: string | null
          created_at: string
          currency: string
          grand_total: number
          id: string
          lead_time_max_part: number
          lead_time_shipping: number
          lowest_quality: string
          lowest_validity_days: number
          new_order_review_state: string
          new_price_quality: string
          new_validity_days: number
          order_id: string | null
          result_at: string | null
          shipping_address_id: string | null
          shipping_name: string
          shipping_total: number
          tax: number
          tenant_id: string
          total: number
          version_id: string | null
        }
        Insert: {
          account_id: string
          claimed_at?: string | null
          created_at?: string
          currency: string
          grand_total: number
          id?: string
          lead_time_max_part: number
          lead_time_shipping: number
          lowest_quality: string
          lowest_validity_days: number
          new_order_review_state: string
          new_price_quality: string
          new_validity_days: number
          order_id?: string | null
          result_at?: string | null
          shipping_address_id?: string | null
          shipping_name: string
          shipping_total: number
          tax: number
          tenant_id: string
          total: number
          version_id?: string | null
        }
        Update: {
          account_id?: string
          claimed_at?: string | null
          created_at?: string
          currency?: string
          grand_total?: number
          id?: string
          lead_time_max_part?: number
          lead_time_shipping?: number
          lowest_quality?: string
          lowest_validity_days?: number
          new_order_review_state?: string
          new_price_quality?: string
          new_validity_days?: number
          order_id?: string | null
          result_at?: string | null
          shipping_address_id?: string | null
          shipping_name?: string
          shipping_total?: number
          tax?: number
          tenant_id?: string
          total?: number
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Revision_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Revision_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "OrderAddress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Revision_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      ShippingItem: {
        Row: {
          account_id: string
          height_mm: number
          id: string
          lead_time_days: number
          length_mm: number
          name: string
          order_id: string
          part_ids: string[]
          part_max_lead_time: number
          price: number
          revision_id: string
          tenant_id: string
          version_id: string
          weight_kg: number
          width_mm: number
        }
        Insert: {
          account_id: string
          height_mm: number
          id?: string
          lead_time_days: number
          length_mm: number
          name: string
          order_id: string
          part_ids: string[]
          part_max_lead_time: number
          price: number
          revision_id: string
          tenant_id: string
          version_id: string
          weight_kg: number
          width_mm: number
        }
        Update: {
          account_id?: string
          height_mm?: number
          id?: string
          lead_time_days?: number
          length_mm?: number
          name?: string
          order_id?: string
          part_ids?: string[]
          part_max_lead_time?: number
          price?: number
          revision_id?: string
          tenant_id?: string
          version_id?: string
          weight_kg?: number
          width_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "ShippingItem_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ShippingItem_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ShippingItem_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      SpecFWPipe: {
        Row: {
          account_id: string
          consolidation: string
          created_at: string
          custom_system: string
          finish: string
          id: string
          index: number
          inner_diameter: number
          layers: Json
          length: number
          order_id: string
          quantity: number
          revision_id: string
          selectedPattern: number
          selectedPatternSkip: number
          stable_part_id: string | null
          system: string
          tenant_id: string
          version_id: string
        }
        Insert: {
          account_id: string
          consolidation: string
          created_at?: string
          custom_system: string
          finish: string
          id?: string
          index: number
          inner_diameter: number
          layers: Json
          length: number
          order_id: string
          quantity: number
          revision_id: string
          selectedPattern: number
          selectedPatternSkip: number
          stable_part_id?: string | null
          system: string
          tenant_id: string
          version_id: string
        }
        Update: {
          account_id?: string
          consolidation?: string
          created_at?: string
          custom_system?: string
          finish?: string
          id?: string
          index?: number
          inner_diameter?: number
          layers?: Json
          length?: number
          order_id?: string
          quantity?: number
          revision_id?: string
          selectedPattern?: number
          selectedPatternSkip?: number
          stable_part_id?: string | null
          system?: string
          tenant_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpecFWPipe_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
      SpecLaminateSheet: {
        Row: {
          account_id: string
          created_at: string
          dxf: string
          id: string
          index: number
          order_id: string
          quantity: number
          revision_id: string
          size: string
          stable_part_id: string
          system: string
          tenant_id: string
          thickness: number
          version_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          dxf: string
          id?: string
          index: number
          order_id: string
          quantity: number
          revision_id: string
          size: string
          stable_part_id: string
          system: string
          tenant_id: string
          thickness: number
          version_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          dxf?: string
          id?: string
          index?: number
          order_id?: string
          quantity?: number
          revision_id?: string
          size?: string
          stable_part_id?: string
          system?: string
          tenant_id?: string
          thickness?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpecLaminateSheet_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecLaminateSheet_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecLaminateSheet_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      SpecManual: {
        Row: {
          account_id: string
          actor_indexes: number[]
          created_at: string
          id: string
          index: number
          items: Json
          name: string
          order_id: string
          price_quality: string
          revision_id: string
          stable_part_id: string | null
          subspec_actor_index: number
          subspec_id: string
          subspec_type: string
          tenant_id: string
          validity_days: number
          version_id: string
        }
        Insert: {
          account_id: string
          actor_indexes: number[]
          created_at?: string
          id?: string
          index: number
          items: Json
          name: string
          order_id: string
          price_quality: string
          revision_id: string
          stable_part_id?: string | null
          subspec_actor_index: number
          subspec_id: string
          subspec_type: string
          tenant_id: string
          validity_days: number
          version_id: string
        }
        Update: {
          account_id?: string
          actor_indexes?: number[]
          created_at?: string
          id?: string
          index?: number
          items?: Json
          name?: string
          order_id?: string
          price_quality?: string
          revision_id?: string
          stable_part_id?: string | null
          subspec_actor_index?: number
          subspec_id?: string
          subspec_type?: string
          tenant_id?: string
          validity_days?: number
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpecManual_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecManual_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecManual_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      SpecPrint3d: {
        Row: {
          account_id: string
          actor_indexes: number[]
          created_at: string
          file_name: string
          id: string
          index: number
          infill: number
          layer_height: number
          order_id: string
          post_process: string
          quantity: number
          revision_id: string
          stable_part_id: string
          stl: string
          sub_system: string
          support: string
          system: string
          tenant_id: string
          version_id: string
        }
        Insert: {
          account_id: string
          actor_indexes: number[]
          created_at?: string
          file_name?: string
          id?: string
          index: number
          infill: number
          layer_height: number
          order_id: string
          post_process: string
          quantity: number
          revision_id: string
          stable_part_id: string
          stl: string
          sub_system: string
          support: string
          system: string
          tenant_id: string
          version_id: string
        }
        Update: {
          account_id?: string
          actor_indexes?: number[]
          created_at?: string
          file_name?: string
          id?: string
          index?: number
          infill?: number
          layer_height?: number
          order_id?: string
          post_process?: string
          quantity?: number
          revision_id?: string
          stable_part_id?: string
          stl?: string
          sub_system?: string
          support?: string
          system?: string
          tenant_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpecPrint3d_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecPrint3d_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecPrint3d_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      SpecRubberCompressionMold: {
        Row: {
          account_id: string
          created_at: string
          deflashing: string
          id: string
          index: number
          material: string
          order_id: string
          quantity: number
          revision_id: string
          stable_part_id: string | null
          step: string
          stepIndex: string
          sub_material: string
          surface_finish: string
          tenant_id: string
          version_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          deflashing: string
          id?: string
          index: number
          material: string
          order_id: string
          quantity: number
          revision_id: string
          stable_part_id?: string | null
          step: string
          stepIndex: string
          sub_material: string
          surface_finish: string
          tenant_id: string
          version_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          deflashing?: string
          id?: string
          index?: number
          material?: string
          order_id?: string
          quantity?: number
          revision_id?: string
          stable_part_id?: string | null
          step?: string
          stepIndex?: string
          sub_material?: string
          surface_finish?: string
          tenant_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpecRubberCompressionMold_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecRubberCompressionMold_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecRubberCompressionMold_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "Version"
            referencedColumns: ["id"]
          },
        ]
      }
      Version: {
        Row: {
          account_id: string
          created_at: string
          id: string
          index: number
          latest_revision: string | null
          order_id: string | null
          review_state: string
          tenant_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          index: number
          latest_revision?: string | null
          order_id?: string | null
          review_state: string
          tenant_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          index?: number
          latest_revision?: string | null
          order_id?: string | null
          review_state?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Version_latest_revision_fkey"
            columns: ["latest_revision"]
            isOneToOne: false
            referencedRelation: "Revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Version_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "Order"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { lookup_invitation_token: string }
        Returns: Json
      }
      complete_profile: {
        Args: {
          p_account_name: string
          p_country_3: string
          p_tenant_id: string
          p_user_id: string
        }
        Returns: string
      }
      create_invitation: {
        Args: {
          account_id: string
          account_role: "owner" | "member"
          invitation_type: "one_time" | "24_hour"
        }
        Returns: Json
      }
      current_user_account_role: {
        Args: { account_id: string }
        Returns: Json
      }
      delete_invitation: {
        Args: { invitation_id: string }
        Returns: undefined
      }
      get_account: {
        Args: { account_id: string }
        Returns: Json
      }
      get_account_by_slug: {
        Args: { slug: string }
        Returns: Json
      }
      get_account_id: {
        Args: { slug: string }
        Returns: string
      }
      get_account_invitations: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_account_members: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_personal_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_tenant: {
        Args: { tenant_id: string }
        Returns: Json
      }
      get_tenants: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      lookup_invitation: {
        Args: { lookup_invitation_token: string }
        Returns: Json
      }
      remove_account_member: {
        Args: { account_id: string; user_id: string }
        Returns: undefined
      }
      update_account: {
        Args: {
          account_id: string
          name?: string
          public_metadata?: Json
          replace_metadata?: boolean
          slug?: string
        }
        Returns: Json
      }
      update_account_user_role: {
        Args: {
          account_id: string
          make_primary_owner?: boolean
          new_account_role: "owner" | "member"
          user_id: string
        }
        Returns: undefined
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

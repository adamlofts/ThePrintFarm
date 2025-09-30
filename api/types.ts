import {Database} from '@api/supabase';

export type Order = Database['public']['Tables']['Order']['Row'];
export type OrderAddress = Database['public']['Tables']['OrderAddress']['Row'];
export type OrderAddressInsert = Database['public']['Tables']['OrderAddress']['Insert'];
export type Version = Database['public']['Tables']['Order']['Version'];
export type Revision = Database['public']['Tables']['Revision']['Row'];
export type Part = Database['public']['Tables']['Part']['Row'];
export type Item = Database['public']['Tables']['Item']['Row'];
export type SpecFWPipe = Database['public']['Tables']['SpecFWPipe']['Row'];
export type SpecLaminateSheet = Database['public']['Tables']['SpecLaminateSheet']['Row'];
export type Account = Database['basejump']['Tables']['Account']['Row'];
export type AnalysisFWPipe = Database['public']['Tables']['AnalysisFWPipe']['Row'];
export type SpecManual = Database['public']['Tables']['SpecManual']['Row'];
export type File = Database['public']['Tables']['File']['Row'];
export type ShippingItem = Database['public']['Tables']['ShippingItem']['Row'];
export type SpecPrint3d = Database['public']['Tables']['SpecPrint3d']['Row'];
export type SpecRubberCompressionMold = Database['public']['Tables']['SpecRubberCompressionMold']['Row'];
export type ItemInsert = Database['public']['Tables']['Item']['Insert'];

export type Currency = 'USD' | 'GBP';

export type ReviewState =
    "new" |
    "in_review" |
    "reviewed";


export type OrderWithVersions = Order & {
    Version: Version[];
}
export type PartWithRelations = Part & {
    Item: Item[];
}

export type RevisionWithRelations = Revision & {
    Part: PartWithRelations[];
    OrderAddress?: OrderAddress;
    ShippingItem: ShippingItem[];
};


export type SpecAny = (SpecFWPipe | SpecManual) & { type: string };

export type QuoteSpecs = {
    [key: string]: SpecAny;
}


///    Term                    | Typical Accuracy (Cost) | Lead Time Expected? | Lead Time Certainty | Notes
//     ------------------------|-------------------------|---------------------|---------------------|------------------------------------------------------------
//     ROM (Rough Order...)    | ±50% or more            | Rarely              | Very low            | Used for feasibility checks, early budgeting.
//     Indicative Price        | ±30–50%                 | Rarely              | Very low            | Often given verbally or in brief emails for quick ballpark.
//     Preliminary Estimate    | ±30–50%                 | Sometimes           | Low                 | Based on partial design data; often changes.
//     Budgetary Estimate      | ±20–30%                 | Sometimes           | Medium-low          | Enough detail for funding approval; schedule still uncertain.
//     Detailed Estimate       | ±10–20%                 | Usually             | Medium              | Based on near-final drawings/specs; can guide procurement.
//     Target Price            | Negotiated; not binding | Yes                 | Medium              | Often used in long-term or collaborative contracts.
//     Quote (Firm Fixed...)   | ±0–5%                   | Yes                 | High                | Binding on cost; lead time tied to terms and conditions.
//     Not-to-Exceed (NTE)     | Upper bound; may be less| Yes                 | High                | Gives buyer maximum cost and delivery confidence.

export type PriceQuality =
    'no_price'
    |
    'rom'
    | 'indicative'
    | 'preliminary_estimate'
    | 'budgetary_estimate'
    | 'detailed_estimate'
    | 'target_price'
    | 'fixed_price'
    | 'not_to_exceed';


export const allSpecTypes = [
    'fwpipe',
    'rollwrappedpipe',
    'pultruded',
    'rubber_injection_mold',
    'rubber_compression_mold',
    'rubber_overmold',
    'rubber_transfer_mold',
    'laminate_sheet',
    '3dp']



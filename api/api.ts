import {base64} from "rfc4648";
import {OrderStateRequest, QuotePipeRequest,} from "@api/api";
import {SupabaseClient} from "@supabase/supabase-js";


import type {Database} from "./supabase.ts";
import {
    Currency,
    ItemInsert,
    OrderAddressInsert, PartVariation, PartWithRelations, PriceQuality,
    ReviewState, Revision, SpecAny,
    SpecFWPipe,
    SpecLaminateSheet,
    SpecPrint3d,
    SpecRubberCompressionMold
} from "./types";
import {supabase} from "@supabase/auth-ui-shared";

export type QuotePipeRequest = {
    account_id: string;

    revision_id: string;
    newVersion: boolean;

    specs: SpecFWPipe;

    new_billing_address?: OrderAddressInsert;
    new_shipping_address?: OrderAddressInsert;

    new_validity: number;
    new_price_quality: PriceQuality | '';
    new_order_review_state: ReviewState | '';
};


export type QuotePipeResponse = {
    orderId: string;
    versionId: string;
    revisionId: string;
};


export type VersionStateRequest = {
    review_state: string;
}

export type OrderStateRequest = {
    ordered_version_id: string;
    ordered_revision_id: string;
}

export function isSpecFWPipeSame(a: SpecFWPipe, b: SpecFWPipe): boolean {
    return a.selectedPattern === b.selectedPattern &&
        a.selectedPatternSkip === b.selectedPatternSkip &&
        a.quantity === b.quantity &&
        a.inner_diameter === b.inner_diameter &&
        a.length === b.length &&
        a.system === b.system &&
        a.custom_system === b.custom_system &&
        a.consolidation === b.consolidation &&
        a.finish === b.finish &&
        a.layers[0].thickness == b.layers[0].thickness &&
        a.layers[0].angle == b.layers[0].angle;
}

export function isSpecRubberCompressionMoldSame(a: SpecRubberCompressionMold, b: SpecRubberCompressionMold): boolean {
    return a.step === b.step &&
        a.quantity === b.quantity &&
        a.material === b.material &&
        a.sub_material === b.sub_material &&
        a.surface_finish === b.surface_finish &&
        a.deflashing === b.deflashing;
}

export function isSpecLaminateSheetSame(a: SpecLaminateSheet, b: SpecLaminateSheet): boolean {
    return a.step === b.step &&
        a.quantity === b.quantity &&
        a.material === b.material &&
        a.sub_material === b.sub_material &&
        a.surface_finish === b.surface_finish &&
        a.deflashing === b.deflashing;
}

export function isSpecPrint3dSame(a: SpecPrint3d, b: SpecPrint3d): boolean {
    return a.stl === b.stl &&
        a.quantity === b.quantity &&
        a.sub_system === b.sub_system;
}

export function resolvedLeadTime(itemsInPart: ItemInsert[], item: ItemInsert): number {
    let dependent_lead_time = 0;
    if (item.depends_on >= 0) {
        dependent_lead_time = resolvedLeadTime(itemsInPart, itemsInPart[item.depends_on]);
    }
    return item.lead_time_days + dependent_lead_time;
}


export const innerDiameterOptions = [  // https://lawtontubes.co.uk/
    8,
    10,
    15,
    22,
    28,
    35,
    42,
    54,
    67,
    76,
    108,
    133,
    159,
    219,
];

export const qualityOrder: PriceQuality[] = [
    'no_price',
    'rom',
    'indicative',
    'preliminary_estimate',
    'budgetary_estimate',
    'detailed_estimate',
    'target_price',
    'fixed_price',
    'not_to_exceed'
];

export const qualityTitle: Record<PriceQuality, string> = {
    no_price: "New Quote",          // Instead of "New Quote"
    rom: "Order of Magnitude Estimate",            // Rough Order of Magnitude
    indicative: "Indicative Estimate",      // Suggests not final
    preliminary_estimate: "Preliminary Estimate",
    budgetary_estimate: "Budgetary Estimate",
    detailed_estimate: "Detailed Estimate",
    target_price: "Target Quote",           // Formal quote
    fixed_price: "Fixed Quote",             // Firm quote
    not_to_exceed: "Not-to-Exceed Quote"   // Maximum limit
};

export const qualityNote: Record<PriceQuality, string> = {
    no_price: "All prices are initial estimates",
    rom: "All prices are ROM estimates",
    indicative: "All prices are indicative estimates",
    preliminary_estimate: "All prices are preliminary estimates",
    budgetary_estimate: "All prices are budgetary estimates",
    detailed_estimate: "All prices are detailed estimates",
    target_price: "All prices are target quotes",
    fixed_price: "All prices are fixed quotes",
    not_to_exceed: "All prices are not-to-exceed quotes"
};

const qualityRank = new Map<PriceQuality, number>(
    qualityOrder.map((q, i) => [q, i])
);

/** Get the numeric index for a given PriceQuality. */
export function priceQualityIndex(q: PriceQuality): number {
    return qualityRank.get(q) ?? Infinity;
}

/** Sorts an array of PriceQuality values from lowest to highest quality. */

export function compareQuality(a, b) {
    return priceQualityIndex(a) - priceQualityIndex(b);
}

export function sortByQuality(values: PriceQuality[]): PriceQuality[] {
    return [...values].sort(compareQuality);
}


export function lowestQualityOf(values: PriceQuality[]): PriceQuality {
    if (values.length === 0) {
        return 'no_price';
    }
    return values.reduce((lowest, current) =>
        priceQualityIndex(current) < priceQualityIndex(lowest) ? current : lowest
    );
}


export function revisionExpiryDate(revision: Revision) {
    const expires = new Date(revision.created_at);
    expires.setDate(expires.getDate() + revision.lowest_validity_days);
    return expires;
}

export function formatDurationToNow(date: Date): string {
    const diffSec = Math.floor(Math.abs(date.getTime() - Date.now()) / 1000);

    const units: [keyof Duration, number][] = [
        ["years", 60 * 60 * 24 * 365],
        ["months", 60 * 60 * 24 * 30],
        ["weeks", 60 * 60 * 24 * 7],
        ["days", 60 * 60 * 24],
        ["hours", 60 * 60],
        ["minutes", 60],
        ["seconds", 1],
    ];

    const df = new Intl.DurationFormat("en", {style: "long"});

    for (const [unit, secPerUnit] of units) {
        const value = Math.floor(diffSec / secPerUnit);
        if (value >= 1) {
            return `for ${df.format({[unit]: value})}`;
        }
    }

    return "just now";
}

export function formatDurationAgo(date: Date): string {
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

    const units: [keyof Duration, number][] = [
        ["years", 60 * 60 * 24 * 365],
        ["months", 60 * 60 * 24 * 30],
        ["weeks", 60 * 60 * 24 * 7],
        ["days", 60 * 60 * 24],
        ["hours", 60 * 60],
        ["minutes", 60],
        ["seconds", 1],
    ];

    const df = new Intl.DurationFormat("en", {style: "long"});

    for (const [unit, secPerUnit] of units) {
        const value = Math.floor(diffSec / secPerUnit);
        if (value >= 1) {
            return `${df.format({[unit]: value})} ago`;
        }
    }

    return "just now";
}


export function currencyFormat(v, symbol) {
    const prefix = v > 0 ? '' : '-';
    const vabs = Math.abs(v);
    return `${prefix}${symbol}${(vabs / 100).toFixed(2)}`;
}


// export function formatDate(date: Date): string {
//     return new Intl.DateTimeFormat(navigator.language, {
//         dateStyle: "long",
//         timeStyle: "short"
//     }).format(date);
// }

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat(navigator.language, {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

export function addWorkingDaysUK(startDate: Date, days: number): Date {
    // Bank holidays for England & Wales (2025 & 2026)
    // Source: https://www.gov.uk/bank-holidays
    const bankHolidays = new Set([
        // 2025
        "2025-01-01", // New Year's Day
        "2025-04-18", // Good Friday
        "2025-04-21", // Easter Monday
        "2025-05-05", // Early May bank holiday
        "2025-05-26", // Spring bank holiday
        "2025-08-25", // Summer bank holiday
        "2025-12-25", // Christmas Day
        "2025-12-26", // Boxing Day

        // 2026
        "2026-01-01", // New Year's Day
        "2026-04-03", // Good Friday
        "2026-04-06", // Easter Monday
        "2026-05-04", // Early May bank holiday
        "2026-05-25", // Spring bank holiday
        "2026-08-31", // Summer bank holiday
        "2026-12-25", // Christmas Day
        "2026-12-28", // Boxing Day (substitute day)
    ]);

    function isWorkingDay(date: Date): boolean {
        const day = date.getDay(); // 0=Sun, 6=Sat
        if (day === 0 || day === 6) return false;
        const iso = date.toISOString().slice(0, 10);
        return !bankHolidays.has(iso);
    }

    const result = new Date(startDate);
    const increment = days >= 0 ? 1 : -1;
    let remaining = Math.abs(days);

    while (remaining > 0) {
        result.setDate(result.getDate() + increment);
        if (isWorkingDay(result)) {
            remaining--;
        }
    }

    return result;
}

export type CompleteProfileRequest = {
    country3: string;
    tenant_id: string;
};

export type CompleteProfileResponse = {
    account_id: string;  // account id of the users personal account
}


export type CreateTeamRequest = {
    name: string;
};

export type CreateTeamResponse = {
    account_id: string;
}


export function defaultSpec(specType: string) {
    if (specType === 'rubber_compression_mold') {
        return defaultRubberCompressionMold();
    }
    if (specType.startsWith('rubber')) {
        return {
            ...defaultRubberCompressionMold(),
            // type: specType,
        }
    }
    if (specType === 'laminate_sheet') {
        return defaultLaminateSheet();
    }
    if (specType === '3dp') {
        return defaultSpecPrint3d();
    }
    return defaultSpecFWPipe();
}

export function defaultSpecFWPipe() {
    return {
        type: 'fwpipe',
        system: 'generic',
        custom_system: '',
        inner_diameter: 22,
        length: 1500,
        layers: [{thickness: 2, angle: 70}],
        selectedPattern: -1, // unselected
        selectedPatternSkip: 0,
        quantity: 1,
        consolidation: 'shrink_tape',
        finish: 'as_wound',
    };
}

// Part CAD (.STEP, .STP)
//
// Quantity: [number]
//
// Material / Mix: {EPDM Mix 1, EPDM Mix 2, NBR Mix 1, Silicone Mix 1, Viton Mix 1, ...}
// (Manufacturer selects available mixes, each with predefined Shore hardness and cure profile)
//
// Color: {options available for chosen material/mix}
//
// Surface Finish: {Smooth, Textured, Custom}
//
// Additional Features / Notes: {Holes, Inserts, Ribs, FDA, High Temp, Chemical Resistance, Other special requirements}
//

export function defaultRubberCompressionMold() {
    return {
        type: 'rubber_compression_mold',
        quantity: 100,

        step: '',
        stepIndex: '',

        material: 'silicone',
        sub_material: 'silicone_60a_clear',

        surface_finish: 'smooth',
        deflashing: 'manual_trim',
    };
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function degToRad(degrees) {
    return degrees * DEG2RAD;
}

export function radToDeg(radians) {
    return radians * RAD2DEG;
}

export const TENANT = {
    paymentMethods: {
        phone: {
            number: "+44 7354 053671",
        },
        email: {
            email: "team@camypro.com",
        },
        // stripe
        // PO
    }
}


export const rubberMaterialOptions = [
    {value: "epdm", label: "EPDM"},
    {value: "nbr", label: "NBR"},
    {value: "silicone", label: "Silicone"},
    {value: "viton", label: "Viton"}
];

// Example mixes — these would ideally be filtered by material
export const rubberSubMaterialOptions = {
    silicone: [
        {value: "silicone_40a_blue", label: "Silicone 40A Blue – Medical"},
        {value: "silicone_50a_red", label: "Silicone 50A Red – High Temp"},
        {value: "silicone_60a_clear", label: "Silicone 60A Clear – FDA"},
        {value: "silicone_70a_black", label: "Silicone 70A Black – General Purpose"}
    ],
    epdm: [
        {value: "epdm_60a_black", label: "EPDM 60A Black – Outdoor"},
        {value: "epdm_70a_black", label: "EPDM 70A Black – High Strength"}
    ],
    nbr: [
        {value: "nbr_65a_black", label: "NBR 65A Black – Oil Resistant"}
    ],
    viton: [
        {value: "viton_75a_black", label: "Viton 75A Black – Chemical Resistant"}
    ]
};

export const rubberSurfaceFinishOptions = [
    {value: "smooth", label: "Smooth / Polished"},
    {value: "matte", label: "Matte / Satin"},
    {value: "textured", label: "Textured"},
    {value: "mirror", label: "Mirror / High Polish"}
];

export const rubberDeflashingOptions = [
    {value: "none", label: "None"},
    {value: "manual_trim", label: "Manual Trim"},
    {value: "cryogenic", label: "Cryogenic Deflash"},
    {value: "tumble", label: "Tumble / Bead Blast"}
];

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    return `${size.toFixed(2)} ${sizes[i]}`;
}

export function defaultLaminateSheet() {
    return {
        type: 'laminate_sheet',
        quantity: 10,
        thickness: 1,

        dxf: '',
        system: 'singleSide',
    };
}


export const laminateSheetMaterialOptions = [
    {
        label: 'High Strength Carbon Fibre Sheet',
        value: 'singleSide',
        thickness: [1, 2, 3, 4],
    },
    {
        value: 'doubleSide',
        label: 'Double-Sided High Strength Carbon Fibre Sheet',
        thickness: [0.25, 0.5, 1, 1.5, 2, 3],
    },
    {
        value: 'foamCore',
        label: 'Foam Cored Carbon Fibre Panel',
        thickness: [4, 6, 11],
    },
    {
        value: 'veneer',
        label: 'Carbon Fibre Veneer Sheet',
    },
];

export function defaultSpecPrint3d() {
    return {
        type: '3dp',
        quantity: 1,

        system: 'fdm',
        sub_system: 'pla',

        layer_height: 1,
        support: '',
        infill: 1,

        stl: '',
        file_name: '',
        actor_indexes: [],

        post_process: '',
    };
}

export const print3dSubSystemOptions = [
    {value: "abs", label: "ABS"},
    {value: "pla", label: "PLA"},
    {value: "petg", label: "PETG"},
    {value: "tpu", label: "TPU"}
];


function endpoint() {
    return import.meta.env.VITE_CAMYPRO_ENDPOINT;
}


export function getTenantId(): string {
    return import.meta.env.VITE_CAMYPRO_TENANT_ID;
}

async function readFileAsyncB64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const bytes = new Uint8Array(e.target.result);
            const b64 = base64.stringify(bytes);
            // const text = e.target.result;
            resolve(b64);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
    });
}

async function req(supabase: SupabaseClient, url: string, method: string, body: object) {
    const {data} = await supabase.auth.getSession();
    const token = data.session.access_token;
    let response;
    try {
        response = await fetch(`${endpoint()}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        throw error;
    }

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}


export async function quote(supabase: SupabaseClient, body: QuotePipeRequest): Promise<Revision> {
    return req(supabase, `/1/pipeQuote`, 'POST', body);
}

export async function postOrderState(supabase: SupabaseClient, orderId: string, body: OrderStateRequest) {
    return req(supabase, `/1/orderState/${orderId}`, 'POST', body);
}


export async function completeProfile(supabase: SupabaseClient, country3: string, tenantId: string) {
    return req(supabase, `/1/completeProfile`, 'POST', {country3: country3, tenant_id: tenantId});
}

export async function createTeam(supabase: SupabaseClient, name: string) {
    return req(supabase, `/1/createTeam`, 'POST', {name: name});
}

export async function makeDownloadUrl(supabase: SupabaseClient, orderId: string, fileRevisionId: string): Promise<Revision> {
    const resp = await req(supabase, `/1/orderFile/${orderId}/dl/${fileRevisionId}`, 'POST', {});
    return resp.signed_url;
}


export async function crossSpecAndFiles(specType: string, spec: SpecAny, files: any[]) {
    if (files.length === 0) {
        return [spec];
    }

    const ret = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        ret[i] = {
            ...spec,
            type: specType,

            fileContent: await readFileAsyncB64(file),
            fileName: file.name,
        }
    }

    return ret;
}



export const reviseQuote = async (
    supabase: SupabaseClient,
    revision: Revision,
    touchedSpec,
    touchedAppendSpecs,
    appendSpecsFiles,
    isTenantAdmin,
    manualPriceSpecs,
    currency: Currency | '', quality: PriceQuality, newValidity: number,
                            newOrderReviewState: ReviewState | '',
    ) => {
    const quoteSpec = {};
    for (const key in touchedSpec) {
        quoteSpec[key] = touchedSpec[key];
    }

    // Add the amended specs.
    let nextKey = revision.Part.length;

    for (let index = 0; index < touchedAppendSpecs.length; index++) {
        const appendSpec = touchedAppendSpecs[index];
        const appendSpecFiles = appendSpecsFiles[index];

        for (const crossedSpec of await crossSpecAndFiles(appendSpec.type, appendSpec, appendSpecFiles)) {
            quoteSpec[nextKey] = crossedSpec;
            nextKey++;
        }
    }

    // Override any specs with manual prices.
    for (const key in manualPriceSpecs) {
        quoteSpec[key] = manualPriceSpecs[key];
    }

    let req: QuotePipeRequest = {
        revision_id: revision.id,
        newVersion: false,
        specs: quoteSpec,
        currency: currency,
        account_id: revision.account_id,

        new_shipping_address: null,
        new_billing_address: null,

        new_validity: -1,
        new_price_quality: "",
        new_order_review_state: ""
    }
    if (isTenantAdmin) {
        req = {
            ...req,
            new_validity: newValidity,
            new_price_quality: quality,
            new_order_review_state: newOrderReviewState,
        };
    }
    const {
        order_id,
        id: newRevisionId,
        account_id
    } = await quote(supabase, req);
    return newRevisionId;
}

export const quoteVariation = async (supabase: SupabaseClient, revisionId: string, variations: any[])=>  {
    return req(supabase, `/1/quoteVariation`, 'POST', {revision_id: revisionId, variations: variations});
}


export interface PartDispatchProps {
    part: PartWithRelations;
    partVariations: PartVariation[];
    actorIndex: number;
    partName: string;
    partType: string;
    specId: string;
    orderId: string;
    stablePartId: string;
    onSpecChange: (touched: boolean, spec: SpecAny, triggerRevise: boolean) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    readOnly: boolean;
    symbol: string;
}

export interface PartComponentProps {
    part: PartWithRelations;
    partVariations: PartVariation[];
    actorIndex: number;
    partName: string;
    partType: string;
    orderId: string;
    stablePartId: string;
    onSpecChange: (touched: boolean, spec: SpecAny, triggerRevise: boolean) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    readOnly: boolean;
    symbol: string;
    spec: SpecAny;
    analysis: any;
    files: File[];
}

import React, {ReactElement, Ref, useEffect, useState} from 'react'
import {RubberCompressionMoldComponent} from "./rubber/RubberCompressionMold";
import {LaminateSheetComponent} from "./sheet/LaminateSheetComponent";
import {Print3dComponent} from "./3dp/Print3dComponent";
import {FilamentWoundPipeComponent} from "./winding/FilamentWoundPipe";
import type {SpecAny} from "@api/types";
import {SpecFWPipeForm} from "./winding/SpecFWPipeForm";
import {SpecRubberCompressionMoldForm} from "./rubber/SpecRubberCompressionForm";
import {SpecLaminateSheetForm} from "./sheet/SpecLaminateSheetForm";
import {Print3dForm} from "./3dp/SpecPrint3dForm";
import {SpecManualForm} from "./ManualItem";
import {PartComponentProps, PartDispatchProps} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";

type KeepState = {
    spec: SpecAny;
    analysis: any;
    files: File[];
}

export function PartDispatch({partType, specId, orderId, stablePartId, ...props}: PartDispatchProps) {
    const [data, setData] = useState<KeepState>({ spec: null, analysis: null, files: null });
    const [loading, setLoading] = useState(false);

    const {supabase} = useSupabase();

    // When loading a new spec, keep the previous state rendered. This is to prevent a flicker.
    const prevDataRef = React.useRef<KeepState>(data);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecPrint3d')
                .select('*')
                .eq('id', specId)
                .single();
            const spec: SpecAny = data;
            if (!isMounted) return;

            let analysis = prevDataRef.current.analysis;
            if (!analysis) {
                ({data, error} = await supabase
                    .from('AnalysisPrint3d')
                    .select('*')
                    .eq('spec_id', spec.id)
                    .single());
                if (!isMounted) return;
                analysis = data;
            }

            let files = prevDataRef.current.files;
            if (!files) {
                ({data, error} = await supabase
                    .from('File')
                    .select('*, FileRevision(*)')
                    .eq('order_id', orderId)
                    .eq('part_stable_id', stablePartId));
                if (!isMounted) return;
                files = data;
            }

            const newData: KeepState = { spec, analysis, files };
            prevDataRef.current = newData;
            setData(newData);
            setLoading(false);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [specId])

    const spec = data.spec ?? prevDataRef.current.spec;
    const analysis = data.analysis ?? prevDataRef.current.analysis;
    const files = data.files ?? prevDataRef.current.files;

    if (!spec || !analysis || !files) {
        return null;
    }
    const componentProps: PartComponentProps = {
        part: props.part,
        partVariations: props.partVariations,
        actorIndex: props.actorIndex,
        partName: props.partName,
        partType: props.partType,
        orderId: orderId,
        stablePartId: stablePartId,
        onSpecChange: props.onSpecChange,
        isEdit: props.isEdit,
        triggerEdit: props.triggerEdit,
        triggerRemove: props.triggerRemove,
        triggerManualPrice: props.triggerManualPrice,
        readOnly: props.readOnly,
        symbol: props.symbol,

        spec: spec,
        analysis: analysis,
        files: files,
    }

    if (partType === 'fwpipe') {
        return <FilamentWoundPipeComponent {...componentProps}/>;
    }
    if (partType === 'rubber_compression_mold') {
        return <RubberCompressionMoldComponent {...componentProps}/>
    }
    if (partType === 'laminate_sheet') {
        return <LaminateSheetComponent {...componentProps}/>
    }
    if (partType === '3dp') {
        return <Print3dComponent {...componentProps}/>
    }
    return null;
}

interface FormDispatchProps {
    initial: SpecAny;
    onSpecChange: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
    symbol: string;
    isNew: boolean;
    setFiles: (files: any[]) => void;
}

export function FormDispatch({initial, onSpecChange, symbol, isNew, setFiles}: FormDispatchProps) {
    if (initial.type === 'fwpipe') {
        return <SpecFWPipeForm initial={initial} trigger={onSpecChange}/>;
    }
    if (initial.type === 'manual') {
        return <SpecManualForm initial={initial} trigger={onSpecChange} symbol={symbol}/>;
    }
    if (initial.type === 'rubber_compression_mold') {
        return <SpecRubberCompressionMoldForm initial={initial} trigger={onSpecChange} isNew={isNew}/>
    }
    if (initial.type === 'laminate_sheet') {
        return <SpecLaminateSheetForm initial={initial} trigger={onSpecChange} isNew={isNew} setFiles={setFiles}/>
    }
    if (initial.type === '3dp') {
        return <Print3dForm initial={initial} trigger={onSpecChange} isNew={isNew} setFiles={setFiles}/>
    }
    return null;
}


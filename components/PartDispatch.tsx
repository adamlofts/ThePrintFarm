import React from 'react'
import {RubberCompressionMoldComponent} from "./rubber/RubberCompressionMold";
import {LaminateSheetComponent} from "./sheet/LaminateSheetComponent";
import {Print3dComponent} from "./3dp/Print3dComponent";
import {FilamentWoundPipeComponent} from "./winding/FilamentWoundPipe";
import {SpecAny} from "@api/api";
import {SpecFWPipeForm} from "./winding/SpecFWPipeForm";
import {SpecRubberCompressionMoldForm} from "./rubber/SpecRubberCompressionForm";
import {SpecLaminateSheetForm} from "./sheet/SpecLaminateSheetForm";
import {Print3dForm} from "./3dp/SpecPrint3dForm";
import {SpecManualForm} from "./ManualItem";

interface PartDispatchProps {
    actorIndex: number;
    partName: string;
    partType: string;
    specId: string;
    orderId: string;
    stablePartId: string;
    onSpecChange: (touched: boolean, spec: SpecAny) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    readOnly: boolean;
}

export function PartDispatch({
                                 actorIndex,
                                 partName,
                                 partType,
                                 specId,
                                 stablePartId,
                                 orderId,
                                 onSpecChange,
                                 isEdit,
                                 triggerEdit,
                                 triggerRemove,
                                 triggerManualPrice,
                                 readOnly,
                             }: PartDispatchProps) {
    if (partType === 'fwpipe') {
        return <FilamentWoundPipeComponent
            spec_id={specId} onSpecChange={onSpecChange} isEditSpec={isEdit} isEditPattern={isEdit}
            triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
            readOnly={readOnly}/>;
    }
    if (partType === 'rubber_compression_mold') {
        return <RubberCompressionMoldComponent
            spec_id={specId} onSpecChange={onSpecChange} isEditSpec={isEdit} isEditPattern={isEdit}
            triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
            readOnly={readOnly} stablePartId={stablePartId} orderId={orderId}/>;
    }
    if (partType === 'laminate_sheet') {
        return <LaminateSheetComponent
            spec_id={specId} onSpecChange={onSpecChange} isEditSpec={isEdit}
            triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
            readOnly={readOnly} stablePartId={stablePartId} orderId={orderId}/>;
    }
    if (partType === '3dp') {
        return <Print3dComponent
            actorIndex={actorIndex}
            spec_id={specId} onSpecChange={onSpecChange} isEditSpec={isEdit}
            triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
            readOnly={readOnly} stablePartId={stablePartId} orderId={orderId} partName={partName}/>;
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


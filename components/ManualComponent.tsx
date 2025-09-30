import {PartDispatch} from "./PartDispatch";
import React, {useEffect, useState} from "react";
import type {PartWithRelations, SpecManual} from "@api/types";
import styles from './ManualComponent.module.css';
import {useSupabase} from "@hooks/SupabaseProvider";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {SpecManualForm} from "./ManualItem";

interface ManualComponentProps {
    partWithItems: PartWithRelations;
    onSpecChange: (touched: boolean, newSpec: SpecManual, newValid: boolean) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    symbol: string;
}

export function ManualComponent({partWithItems, onSpecChange, isEdit, triggerEdit, triggerRemove, triggerManualPrice, symbol}: ManualComponentProps) {
    const [spec, setSpec] = useState<SpecManual>();
    const { supabase, loading } = useSupabase();
    const {isTenantAdmin} = useAccountsAndTenantAdmin();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecManual')
                .select('*')
                .eq('id', partWithItems.spec_id)
                .single();
            const newSpec: SpecManual = data;
            setSpec(newSpec);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [partWithItems])

    if (isEdit && spec) {
        return <div>
            <SpecManualForm initial={spec} trigger={onSpecChange} symbol={symbol}/>
        </div>
    }

    return <div>
        {!isEdit && spec && <>
            <div className={styles.titleLine}>
                <div>{partWithItems.name}</div>

                <div className={styles.revisionButtons}>
                {isTenantAdmin && <button className={styles.adminButton} onClick={triggerEdit}>Edit...</button>}
                {isTenantAdmin && <button className={styles.adminButton} onClick={triggerRemove}>Remove</button>}
                </div>
            </div>

            <PartDispatch partName={''}
                          actorIndex={spec.subspec_actor_index}
                          partType={partWithItems.subspec_type} specId={partWithItems.subspec_id} onSpecChange={onSpecChange} isEdit={isEdit}
                          triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice} readOnly={true}
                          stablePartId={partWithItems.stable_id} orderId={partWithItems.order_id}/>
        </>}
    </div>;
}


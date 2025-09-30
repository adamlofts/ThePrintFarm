import React, {useEffect, useState} from 'react'
import styles from './RevisionComponent.module.css';
import {Item, PartWithRelations, RevisionWithRelations, SpecAny, SpecManual} from "@api/api";
import {PartDispatch} from "./PartDispatch";
import {ManualComponent} from "./ManualComponent";
import {currencyFormat, qualityNote} from "@api/api";
import {useSupabase} from "@hooks/SupabaseProvider";
import {SpecManualForm} from "./ManualItem";

interface ItemComponentProps {
    item: Item;
    last: boolean;
    symbol: string;
}


export function ItemComponent({item, last, symbol}: ItemComponentProps) {
    const lastClass = last ? styles.itemBottom : '';
    return <div className={styles.item}>
        <div className={`${styles.name} ${styles.itemLeft} ${styles.itemCell} ${lastClass}`}>
            {item.name}
        </div>
        <div className={`${styles.quantity} ${styles.itemCell} ${lastClass}`}>
            {item.quantity}
        </div>
        <div className={`${styles.unitPrice} ${styles.itemCell} ${lastClass}`}>
            {currencyFormat(item.unit_price, symbol)}
        </div>
        <div className={`${styles.total} ${styles.itemRight} ${styles.itemCell} ${lastClass}`}>
            {currencyFormat(item.total, symbol)}
        </div>
    </div>;
}


interface PartComponentProps {
    partWithItems: PartWithRelations;
    onSpecChange: (touched: boolean, spec: SpecAny) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    symbol: string;
    readOnly: boolean;
}

function PartComponent({partWithItems, onSpecChange, isEdit, triggerEdit, triggerRemove, triggerManualPrice, symbol, readOnly}: PartComponentProps) {
    const partType = partWithItems.type;
    return <>
    <div className={styles.part}>
        <div className={styles.partBody}>
            {partType === 'manual' && <ManualComponent partWithItems={partWithItems} onSpecChange={onSpecChange} isEdit={isEdit}
                                                       triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
            symbol={symbol}/>}
            <PartDispatch
                actorIndex={partWithItems.actor_index}
                orderId={partWithItems.order_id}
                          partName={partWithItems.name}
                          partType={partType} specId={partWithItems.spec_id} onSpecChange={onSpecChange} isEdit={isEdit}
                          triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
                          readOnly={readOnly} stablePartId={partWithItems.stable_id}/>

        </div>

        {partWithItems.Item.map((item, i) => <ItemComponent item={item} key={item.id} last={i === partWithItems.Item.length - 1} symbol={symbol}/>)}
    </div></>;
}

interface RevisionComponentProps {
    revision: RevisionWithRelations;
    onSpecChange: (index: number, touched: boolean, partType: string, spec: SpecAny) => void;
    editIndexes: number[];
    removeIndexes: number[];
    triggerEdit: (index: number) => void;
    triggerRemove: (index: number) => void;
    triggerManualPrice: (index: number) => void;
    manualPriceSpecs: Map<string, SpecManual>;
    updateManualPriceSpec: (index: number, newSpec: SpecManual) => void;
    readOnly: boolean;
    isEdit: boolean;
}

export function RevisionComponent({
          revision, onSpecChange, editIndexes, triggerEdit, triggerRemove, triggerManualPrice, removeIndexes,
                                      manualPriceSpecs, updateManualPriceSpec, readOnly, isEdit}: RevisionComponentProps) {

    const symbol = {
        'USD': '$',
        'GBP': '£',
    }[revision.currency];

    return <>
        <div className={styles.grid}>
            <>
                <div className={styles.name}>Item</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.unitPrice}>Unit&nbsp;Price</div>
                <div className={styles.total}>
                    Total
                </div>
            </>
            <>
                <div></div>
                <div></div>
                <div></div>
                <div className={styles.total}>{revision.currency}</div>
            </>

            {revision.Part.map((p, index) => {
                if (removeIndexes.includes(index)) {
                    return null;
                }
                const manualSpec = manualPriceSpecs[index];
                if (manualSpec) {
                    return <div key={p.id} className={styles.part}>
                        <div className={styles.partBody}>
                            <SpecManualForm
                                initial={manualSpec}
                                trigger={(touched, newSpec: SpecManual, newValid) => updateManualPriceSpec(index, newSpec)}
                                symbol={symbol}
                            />
                        </div>
                    </div>
                }
                return <PartComponent
                    partWithItems={p} key={p.id}
                    onSpecChange={(touched, newSpec) => onSpecChange(index, touched, p.type, newSpec)}
                    isEdit={editIndexes.includes(index)}
                    triggerEdit={() => triggerEdit(index)}
                    triggerRemove={() => triggerRemove(index)}
                    triggerManualPrice={() => triggerManualPrice(index)}
                    symbol={symbol}
                    readOnly={readOnly}
                />;
            })}

            <div className={styles.spacer}></div>

            {revision.ShippingItem.length > 0 && !isEdit &&
                <>
                    {revision.OrderAddress && <div className={styles.name}>Shipping to {revision.OrderAddress.country}</div>}
                    <div className={styles.totalRow}></div>
                    <div className={styles.totalRow}></div>
                    <div className={styles.total}>
                        {currencyFormat(revision.shipping_total, symbol)}
                    </div>
                </>
            }

            {revision.grand_total > 0 && !isEdit && <>
                <div className={styles.name}>Total</div>
                <div className={styles.totalRow}></div>
                <div className={styles.totalRow}></div>
                <div className={styles.total}>
                    {currencyFormat(revision.total, symbol)}
                </div>

                <div className={styles.spacer}></div>

                <div className={styles.name}>Tax</div>
                <div className={styles.totalRow}></div>
                <div className={styles.totalRow}></div>
                <div className={styles.total}>
                    {symbol}{(revision.tax / 100).toFixed(2)}
                </div>

                <div className={styles.name}>Grand Total ({revision.currency})</div>
                <div className={styles.totalRow}></div>
                <div className={styles.totalRow}></div>
                <div className={styles.total}>
                    {symbol}{(revision.grand_total / 100).toFixed(2)}
                </div>
            </>}
            <>
                <div className={styles.name}>Item</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.unitPrice}>Unit&nbsp;Price</div>
                <div className={styles.total}>
                    Total
                </div>
            </>

            <div className={styles.priceQuality}>{qualityNote[revision.lowest_quality]}</div>

        </div>


    </>
}


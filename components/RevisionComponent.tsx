import React, {useEffect, useState} from 'react'
import styles from './RevisionComponent.module.css';
import {currencyFormat, print3dSubSystemOptions, qualityNote, quoteVariation} from "@api/api";
import {Item, PartVariation, PartWithRelations, RevisionWithRelations, SpecAny, SpecManual} from "@api/types";
import {PartDispatch} from "./PartDispatch";
import {ManualComponent} from "./ManualComponent";
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
    partVariations: PartVariation[];
    onSpecChange: (touched: boolean, spec: SpecAny, triggerRevise: boolean) => void;
    isEdit: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
    symbol: string;
    readOnly: boolean;
}

function PartComponent({
                           partWithItems, partVariations,
                           onSpecChange, isEdit, triggerEdit, triggerRemove, triggerManualPrice, symbol, readOnly
                       }: PartComponentProps) {
    const partType = partWithItems.type;
    return <>
        <div className={styles.part}>
            <div className={styles.partBody}>
                {partType === 'manual' &&
                    <ManualComponent partWithItems={partWithItems} onSpecChange={onSpecChange} isEdit={isEdit}
                                     triggerEdit={triggerEdit} triggerRemove={triggerRemove}
                                     triggerManualPrice={triggerManualPrice}
                                     symbol={symbol}/>}
                <PartDispatch
                    symbol={symbol}
                    part={partWithItems}
                    partVariations={partVariations}
                    actorIndex={partWithItems.actor_index}
                    orderId={partWithItems.order_id}
                    partName={partWithItems.name}
                    partType={partType} specId={partWithItems.spec_id} onSpecChange={onSpecChange} isEdit={isEdit}
                    triggerEdit={triggerEdit} triggerRemove={triggerRemove} triggerManualPrice={triggerManualPrice}
                    readOnly={readOnly} stablePartId={partWithItems.stable_id}/>

            </div>

            {partWithItems.Item.map((item, i) => <ItemComponent item={item} key={item.id}
                                                                last={i === partWithItems.Item.length - 1}
                                                                symbol={symbol}/>)}
        </div>
    </>;
}

interface RevisionComponentProps {
    revision: RevisionWithRelations;
    onSpecChange: (index: number, touched: boolean, partType: string, spec: SpecAny, triggerRevise: boolean) => void;
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
                                      revision,
                                      onSpecChange,
                                      editIndexes,
                                      triggerEdit,
                                      triggerRemove,
                                      triggerManualPrice,
                                      removeIndexes,
                                      manualPriceSpecs,
                                      updateManualPriceSpec,
                                      readOnly,
                                      isEdit
                                  }: RevisionComponentProps) {
    const [variations, setVariations] = useState([]);
    const {supabase} = useSupabase();

    const symbol = {
        'USD': '$',
        'GBP': '£',
    }[revision.currency];

    useEffect(() => {
        const fetchData = async () => {
            const data = await quoteVariation(supabase, revision.id, [{sub_system: 'pla'}]);
            setVariations(data.variations);
        }
        fetchData();
    }, [revision]);

    return <>
        <div className={styles.grid}>
            {/*<>*/}
            {/*    <div className={styles.name}>Item</div>*/}
            {/*    <div className={styles.quantity}>Quantity</div>*/}
            {/*    <div className={styles.unitPrice}>Unit&nbsp;Price</div>*/}
            {/*    <div className={styles.total}>*/}
            {/*        Total*/}
            {/*    </div>*/}
            {/*</>*/}
            {/*<>*/}
            {/*    <div></div>*/}
            {/*    <div></div>*/}
            {/*    <div></div>*/}
            {/*    <div className={styles.total}>{revision.currency}</div>*/}
            {/*</>*/}

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
                // Collect part variations
                const variationNthParts = variations.map(v => {
                    return {
                        variation: v.variation,
                        part: v.parts[index]
                    }
                });

                // Use the part stable id as the key here so that we can preserve components when revising
                return <PartComponent
                    partWithItems={p} key={p.stable_id}
                    partVariations={variationNthParts}
                    onSpecChange={(touched, newSpec, triggerRevise) => onSpecChange(index, touched, p.type, newSpec, triggerRevise)}
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


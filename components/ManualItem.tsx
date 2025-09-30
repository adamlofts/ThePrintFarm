import React, {useState} from 'react'
import styles from './ManualItem.module.css';
import {NumberInput} from '@components/ui/NumberInput';

interface ManualItem {
    quantity: number;
    unit_price: number;
    name: string;
    lead_time_days: number;
}

interface ManualItemProps {
    index: number;
    item: ManualItem;
    onChange: (index: number, newItem: ManualItem) => void;
    symbol: string;
}

function ManualItemComponent({index, item, onChange, symbol}: ManualItemProps) {
    const handleChange = (attr) => {
        onChange(index, {...item, ...attr});
    };

    return <div className={styles.manualGridRow}>
        <input className="form-control" onChange={(evt) => handleChange({name: evt.target.value})} value={item.name}/>
        <NumberInput value={item.lead_time_days} onChange={(q) => handleChange({lead_time_days: q})}/>
        <NumberInput value={item.quantity} onChange={(q) => handleChange({quantity: q})}/>
        <NumberInput value={item.unit_price / 100} onChange={(q) => handleChange({unit_price: q * 100})}/>
        <div className={styles.total}>{symbol}{((item.quantity * item.unit_price) / 100).toFixed(2)}</div>
    </div>;
}

interface SpecManualFormProps {
    initial: SpecManual;
    trigger: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
    symbol: string;
}

export function SpecManualForm({initial, trigger, symbol}: SpecManualFormProps) {
    const [spec, setSpec] = useState<SpecManual>(initial);

    const changeAttr = (attr) => {
        const newSpec = {
            ...spec,
            ...attr
        };
        setSpec(newSpec);
        trigger(true, newSpec, true);
    }

    const updateItem = (index: number, newItem: ManualItem) => {
        const updated = [...spec.items];
        updated[index] = newItem;
        changeAttr({items: updated});
    };

    const addItem = () => {
        const updated = [...spec.items];
        updated.push({
            quantity: 1,
            unit_price: 100,
            name: "New Item",
            lead_time_days: 5,
        });
        changeAttr({items: updated});
    }

    return <>
        <input className="form-control" value={spec.name} onChange={(evt) => changeAttr({name: evt.target.value})}/>

        <div className={styles.manualGrid}>
            <div>Name</div>
            <div>Lead&nbsp;Time&nbsp;(days)</div>
            <div className={styles.numberColHeader}>Quantity</div>
            <div className={styles.numberColHeader}>Unit&nbsp;Price</div>
            <div>Total</div>

            {spec.items.map((item, index) => <ManualItemComponent
                key={index} index={index} item={item} onChange={updateItem} symbol={symbol}/>)}

            <div></div>
            <div></div>
            <div>
                <button className="btn btn-default" onClick={addItem}>+</button>
            </div>
        </div>
    </>;
}




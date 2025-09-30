import React, {useState} from 'react'
import styles from './QuoteForm.module.css';
import {NumberInput} from '@components/ui/NumberInput';
import {FilesInput} from '@components/ui/FilesInput';
import {Form} from 'react-bootstrap';
import {print3dSubSystemOptions, SpecPrint3d,} from "@api/api";

interface Print3dFormProps {
    isNew: boolean;
    initial: any;
    trigger: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
    setFiles: (files: any[]) => void;
}


export function Print3dForm({
                                initial,
                                trigger,
                                isNew,
                                setFiles,
                            }: Print3dFormProps) {
    const [spec, setSpec] = useState<SpecPrint3d>(initial);

    const changeAttr = (attr: Partial<SpecPrint3d>) => {
        const newSpec = {...spec, ...attr};
        setSpec(newSpec);
        trigger(true, newSpec, true);
    };

    return (
        <div className={styles.container}>
            {isNew && <FilesInput setFiles={setFiles}/>}

            <div className={styles.row}>
                <label className={styles.labelCol}>Quantity</label>
                <div className={styles.inputCol}>
                    <NumberInput
                        value={spec.quantity} onChange={(q) => changeAttr({quantity: q})}
                        min={1} max={5000}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <label className={styles.labelCol}>Material</label>
                <div className={styles.inputCol}>
                    <Form.Select
                        value={spec.sub_system}
                        onChange={(e) => {
                            changeAttr({sub_system: e.target.value});
                        }}
                    >
                        {print3dSubSystemOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

        </div>
    );
}


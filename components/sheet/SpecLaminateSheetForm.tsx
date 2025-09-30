import React, {useState} from 'react'
import styles from './QuoteForm.module.css';
import {NumberInput} from '@components/ui/NumberInput';
import {ChoiceNumberInput} from "@components/ui/ChoiceNumberInput";
import {Form} from 'react-bootstrap';
import {laminateSheetMaterialOptions, rubberSubMaterialOptions, SpecAny,} from "@api/api";
import {SpecLaminateSheet} from "../../api/types";
import {FilesInput} from "@components/ui/FilesInput";

interface SpecLaminateSheetFormProps {
    isNew: boolean;
    initial: any; //SpecRubberCompressionMold;
    trigger: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
    setFiles: (files: any[]) => void;
}


export function SpecLaminateSheetForm({
                                          initial,
                                          trigger,
                                          isNew,
                                          onNewQuote,
                                          setFiles,
                                      }: SpecLaminateSheetFormProps) {
    const [spec, setSpec] = useState<SpecLaminateSheet>(initial);

    const changeAttr = (attr: Partial<SpecLaminateSheet>) => {
        const newSpec = {...spec, ...attr};
        setSpec(newSpec);
        trigger(true, newSpec, true);
    };

    const subMaterials = rubberSubMaterialOptions[spec.material] || [];

    const systemOption = laminateSheetMaterialOptions.find(o => o.value === spec.system);

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
                <label className={styles.labelCol}>Sheet Material</label>
                <div className={styles.inputCol}>
                    <Form.Select
                        value={spec.system}
                        onChange={(e) => {
                            changeAttr({system: e.target.value});
                        }}
                    >
                        {laminateSheetMaterialOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {systemOption.thickness && <div className={styles.row}>
                <label className={styles.labelCol}>Thickness</label>
                <div className={styles.inputCol}>
                    <Form.Group>
                        <ChoiceNumberInput
                            value={spec.thickness} onChange={(q) => changeAttr({thickness: q})}
                            options={systemOption.thickness}
                            min={1} max={10}
                        />
                    </Form.Group>
                </div>
            </div>}

        </div>
    );
}


import React, {useState} from 'react'
import styles from './QuoteForm.module.css';
import {NumberInput} from '@components/ui/NumberInput';
import {Form} from 'react-bootstrap';
import {
    rubberDeflashingOptions,
    rubberMaterialOptions,
    rubberSubMaterialOptions,
    rubberSurfaceFinishOptions,
    SpecRubberCompressionMold,
} from "@api/api";


interface SpecRubberCompressionMoldFormProps {
    isNew: boolean;
    initial: any; //SpecRubberCompressionMold;
    trigger: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
}


export function SpecRubberCompressionMoldForm({
                                                  initial,
                                                  trigger,
                                                  isNew
                                              }: SpecRubberCompressionMoldFormProps) {
    const [spec, setSpec] = useState<SpecRubberCompressionMold>(initial);
    const [fileValidation, setFileValidation] = useState('');
    const [selectedFile, setSelectedFile] = useState();

    const changeAttr = (attr: Partial<SpecRubberCompressionMold>) => {
        const newSpec = {...spec, ...attr};
        setSpec(newSpec);
        trigger(true, newSpec, newSpec.step.length > 0 && newSpec.sub_material.length > 0);
    };

    const subMaterials = rubberSubMaterialOptions[spec.material] || [];

    const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const files = evt.target.files;
        if (!files || files.length === 0) {
            setFileValidation('No file selected');
            setSelectedFile(null);
            return;
        }

        const file = files[0];
        const fileName = file.name.toLowerCase();
        const isValidExtension = fileName.endsWith('.stp') || fileName.endsWith('.step');
        if (!isValidExtension) {
            setFileValidation('File must have a .stp or .step extension');
            setSelectedFile(null);
            return;
        }

        // Read file as text
        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;

            setFileValidation('');
            changeAttr({step: text});
        };

        reader.onerror = function () {
            setFileValidation(`Failed to read file}`)
        };

        reader.readAsText(file);
    }

    return (
        <div className={styles.container}>
            {isNew && <div className={styles.row}>
                <label className={styles.labelCol}>Part .STEP File</label>
                <div className={styles.inputCol}>
                    <input
                        type="file"
                        // ref={inputRef}
                        onChange={handleFileChange}
                    />
                    {fileValidation}
                </div>
            </div>}

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
                        value={spec.material}
                        onChange={(e) => {
                            changeAttr({material: e.target.value, sub_material: ""});
                        }}
                    >
                        {rubberMaterialOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {/* Sub-material / Mix */}
            <div className={styles.row}>
                <label className={styles.labelCol}>Mix / Grade</label>
                <div className={styles.inputCol}>
                    <Form.Select
                        value={spec.sub_material}
                        onChange={(e) => changeAttr({sub_material: e.target.value})}
                    >
                        <option value="">Select mix</option>
                        {subMaterials.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {/* Surface Finish */}
            <div className={styles.row}>
                <label className={styles.labelCol}>Surface Finish</label>
                <div className={styles.inputCol}>
                    <Form.Select
                        value={spec.surface_finish}
                        onChange={(e) => changeAttr({surface_finish: e.target.value})}
                    >
                        {rubberSurfaceFinishOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {/* Deflashing */}
            <div className={styles.row}>
                <label className={styles.labelCol}>Post-Processing</label>
                <div className={styles.inputCol}>
                    <Form.Select
                        value={spec.deflashing}
                        onChange={(e) => changeAttr({deflashing: e.target.value})}
                    >
                        {rubberDeflashingOptions.map((opt) => (
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

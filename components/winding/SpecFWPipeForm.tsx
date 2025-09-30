import React, {useState} from 'react'
import styles from './QuoteForm.module.css';
import {NumberInput} from '@components/ui/NumberInput';
import {ChoiceNumberInput} from "@components/ui/ChoiceNumberInput";
import {Form} from 'react-bootstrap';
import {innerDiameterOptions,} from "@api/api";


interface Layer {
    angle: number;
    thickness: number;
}

interface LayerProps {
    index: number;
    layer: Layer;
    onChange: (index: number, newLayer: Layer) => void;
}

function LayerComponent({index, layer, onChange}: LayerProps) {
    const handleAngleChange = (value: number) => {
        onChange(index, {...layer, angle: value});
    };
    const handleChange = (attr) => {
        onChange(index, {...layer, ...attr});
    };

    return <div className={styles.container}>

        <div className={styles.row}>
            <label className={styles.labelCol}>Wind Angle</label>
            <div className={styles.inputCol}>
                <NumberInput value={layer.angle} onChange={handleAngleChange} suffix="°" min={15} max={85}/>
            </div>
        </div>
        <div className={styles.row}>
            <label className={styles.labelCol}>Wall Thickness</label>
            <div className={styles.inputCol}>
                <NumberInput min={0.3} max={6} value={layer.thickness} onChange={(v) => handleChange({thickness: v})}
                             suffix="mm"/>
            </div>
        </div>
    </div>
}


export const systemOptions = [
    {
        "system": "generic",
        "label": "Generic Carbon Fiber",
        "fiber": "Generic Carbon Fiber Tow (12k, ~1000 MPa / 70 GPa)",
        "matrix": "Standard Epoxy 80°C",
        "process": "Wet Wound",
    },
    {
        "system": "generic120",
        "label": "High-Tg Carbon Fiber",
        "fiber": "Generic Carbon Fiber Tow (12k, ~1000 MPa / 70 GPa)",
        "matrix": "High-Tg Epoxy 120°C",
        "process": "Wet Wound",
    },
    {
        "system": "toray_cetex_tc1320_pekk",
        "label": "Toray Cetex TC1320",
        "fiber": "AS4D Carbon Fiber",
        "matrix": "PEKK (Polyetherketoneketone)",
        "process": "Thermoplastic Winding",
    },
    {
        "system": "vestape_pa12_cf45",
        "label": "Evonik VESTAPE PA12",
        "fiber": "Carbon Fiber (1900 MPa)",
        "matrix": "PA12 (Polyamide 12)",
        "process": "Thermoplastic Winding",
    }
]

interface SpecFWPipeFormProps {
    initial: SpecFWPipe;
    trigger: (touched: boolean, newSpec: SpecAny, newValid: boolean) => void;
}

export function SpecFWPipeForm({initial, trigger}: SpecFWPipeFormProps) {
    const [spec, setSpec] = useState<SpecFWPipe>(initial);

    const changeAttr = (attr) => {
        const newSpec = {
            ...spec,
            ...attr
        };
        setSpec(newSpec);
        trigger(true, newSpec, true);
    }

    // Handle updating a single layer
    const updateLayer = (index: number, newLayer: Layer) => {
        const updated = [...spec.layers];
        updated[index] = newLayer;
        changeAttr({layers: updated});
    };

    // Add a new blank layer
    const addLayer = () => {
        const updated = [...spec.layers, {material: 'a', angle: 70, thickness: 5}];
        changeAttr({layers: updated});
    };

    const systems = systemOptions.map((o, index) =>
        <option key={o.system} value={o.system}>{o.label}</option>);

    const system = spec.system && systemOptions.find((s) => s.system === spec.system);

    return <div className={styles.container}>
        <div className={styles.row}>
            <label className={styles.labelCol}>Quantity</label>
            <div className={styles.inputCol}>
                <NumberInput
                    value={spec.quantity} onChange={(q) => changeAttr({quantity: q})}
                    min={1} max={500}
                />
            </div>
        </div>

        <div className={styles.subheader}>Dimensions</div>

        <div className={styles.row}>
            <label className={styles.labelCol}>Length</label>
            <div className={styles.inputCol}>
                <NumberInput value={spec.length} onChange={(q) => changeAttr({length: q})} suffix="mm" min={5}
                             max={3000}/>
            </div>
        </div>

        <div className={styles.row}>
            <label className={styles.labelCol}>Inner Diameter</label>
            <div className={styles.inputCol}>
                <Form.Group>
                    <ChoiceNumberInput
                        value={spec.inner_diameter} onChange={(q) => changeAttr({inner_diameter: q})}
                        options={innerDiameterOptions}
                        min={10} max={250}
                    />
                </Form.Group>
            </div>
        </div>

        {spec.layers.map((layer, i) => (
            <div className={styles.row} key={i}>
                <LayerComponent
                    index={i}
                    layer={layer}
                    onChange={updateLayer}
                />
            </div>
        ))}

        <div className={styles.row}>
            <label className={styles.labelCol}>Outer Diameter</label>
            <div className={styles.inputCol}>
                {(spec.inner_diameter + spec.layers[0].thickness).toFixed(1)}mm
            </div>
        </div>

        <div className={styles.subheader}>Materials</div>
        <div className={styles.row}>
            <label className={styles.labelCol}>Fiber and Matrix</label>
            <div className={styles.inputCol}>
                <Form.Select
                    onChange={(evt) => {
                        changeAttr({system: evt.target.value});
                    }} value={spec.system}>
                    {systems}
                    <option value="">Custom</option>
                </Form.Select>
            </div>
        </div>

        {spec.system === "" &&
            <>
                <div className={styles.row}>
                    <label className={styles.labelCol}></label>
                    <div className={styles.inputCol}>
                        <Form.Control as="textarea" rows={3}
                                      onChange={(evt) => {
                                          changeAttr({custom_system: evt.target.value});
                                      }} value={spec.custom_system}/>
                    </div>
                </div>
            </>}

        {system &&
            <>
                <div className={styles.row}>
                    <label className={styles.labelCol}>Fiber</label>
                    <div className={styles.inputCol}>
                        {system.fiber}
                    </div>
                </div>
                <div className={styles.row}>
                    <label className={styles.labelCol}>Matrix</label>
                    <div className={styles.inputCol}>
                        {system.matrix}
                    </div>
                </div>
                <div className={styles.row}>
                    <label className={styles.labelCol}>Winding</label>
                    <div className={styles.inputCol}>
                        {system.process}
                    </div>
                </div>
            </>}


        <div className={styles.subheader}>Process</div>

        {/*<div className={styles.row}>*/}
        {/*    <div className="col-12">*/}
        {/*    <button type="button" className="btn btn-primary" onClick={addLayer}>*/}
        {/*        Add Layer*/}
        {/*    </button>*/}
        {/*    </div>*/}
        {/*</div>*/}


        <div className={styles.row}>
            <label className={styles.labelCol}>Consolidation</label>
            <div className={styles.inputCol}>
                <Form.Select
                    onChange={(evt) => {
                        changeAttr({consolidation: evt.target.value});
                    }} value={spec.consolidation}>
                    <option value="none">None</option>
                    <option value="shrink_tape">Shrink Tape</option>
                    <option value="vacuum_bag">Vacuum Bag</option>
                    <option value="autoclave">Autoclave</option>
                </Form.Select>
            </div>
        </div>

        <div className={styles.row}>
            <label className={styles.labelCol}>Finish</label>
            <div className={styles.inputCol}>
                <Form.Select
                    onChange={(evt) => {
                        changeAttr({finish: evt.target.value});
                    }} value={spec.finish}>
                    <option value="as_wound">As Wound</option>
                    <option value="sanded">Sanded</option>
                    <option value="painted">Sanded and Painted</option>
                </Form.Select>
            </div>
        </div>


    </div>;
}

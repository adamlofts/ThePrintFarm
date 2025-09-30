import React, {useEffect, useState} from 'react'
import {Dropdown, DropdownButton, Form, InputGroup} from 'react-bootstrap';

interface ChoiceNumberInputProps {
    value: number;
    onChange: (n: number) => void;
    options: number[];
    min?: number;
    max?: number;
}
export function ChoiceNumberInput({value, onChange, options, min, max}: ChoiceNumberInputProps) {
    const [selection, setSelection] = useState(options[0]);
    const [textValue, setTextValue] = useState('');
    const suffix = 'mm';

    let error = '';

    if (max !== null && value > max) {
        error = `Max 300${suffix}`;
    }
    if (min !== null && value < min) {
        error = `Min 10${suffix}`;
    }

    useEffect(() => {
        if (isNaN(value)) {
            return;
        }
        if (options.includes(value)) {
            setSelection(value);
            setTextValue('');
            return;
        }
        if (Number(textValue) !== value) {
            setTextValue(value.toString());
            setSelection(null);
        }
    }, [value]);

    function handleTextChange(e) {
        setTextValue(e.target.value);
        onChange(Number(e.target.value));
    }

    function handleSelect(evt) {
        let o = evt.target.value;
        if (o === 'custom') {
            setTextValue(selection.toString());
            setSelection(null);
            return
        }
        o = Number(o);
        setSelection(o);
        setTextValue('');
        onChange(o);
    }

    const items = [
        <optgroup key="1">
            {options.map((o, index) =>  <option key={o} value={o}>{o}{suffix}</option>)}
        </optgroup>,
        <optgroup key="2">
            <option key="custom" value="custom">Custom</option>
        </optgroup>,
    ];

    return (
        <InputGroup hasValidation>
            <Form.Select
                onChange={handleSelect}
                value={selection === null ? 'custom' : selection}
            >
                {items}
            </Form.Select>
            {selection === null && <><Form.Control value={textValue} onChange={handleTextChange} isInvalid={error !== ''}/>
            <InputGroup.Text>{suffix}</InputGroup.Text></>}
            {error !== '' && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>);
}

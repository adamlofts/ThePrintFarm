import React, {useEffect, useState} from 'react'
import {Form, InputGroup} from "react-bootstrap";

interface NumberInputProps {
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
    suffix?: string;
}

export function NumberInput({value, onChange, min, max, suffix} : NumberInputProps) {
    const [textValue, setTextValue] = useState(value.toString());

    let error = '';

    if (max !== null && value > max) {
        error = `Max ${max}`;
    }
    if (min !== null && value < min) {
        error = `Min ${min}`;
    }

    useEffect(() => {
        if (isNaN(value)) {
            return;
        }
        if (Number(textValue) !== value) {
            setTextValue(value.toString());
        }
    }, [value]);

    return (
        <InputGroup hasValidation>
            <Form.Control value={textValue} onChange={(e) => {
                setTextValue(e.target.value);
                onChange(Number(e.target.value));
            }} isInvalid={error !== ''}/>
            {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
            {error !== '' && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </InputGroup>);
}

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface ChoiceTextInputProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    customLabel?: string;
}

const ChoiceTextInput: React.FC<ChoiceTextInputProps> = ({
                                                             options,
                                                             value,
                                                             onChange,
                                                             customLabel = 'Custom...',
                                                         }) => {
    const [customValue, setCustomValue] = useState('');

    const isCustom = !options.includes(value);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected === '__custom__') {
            onChange(customValue); // use last custom value
        } else {
            onChange(selected);
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange(val);
    };

    return (
        <Form.Group>
            <Form.Select value={isCustom ? '__custom__' : value} onChange={handleSelectChange}>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
                <option value="__custom__">{customLabel}</option>
            </Form.Select>
            {isCustom && (
                <Form.Control
                    className="mt-2"
                    type="text"
                    placeholder="Enter custom value"
                    value={customValue}
                    onChange={handleCustomChange}
                />
            )}
        </Form.Group>
    );
};

export default ChoiceTextInput;

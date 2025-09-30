import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Button, Form, Modal} from 'react-bootstrap';

interface CreateTeamModalProps {
    show: boolean;
    onHide: () => void;
    onCreate: (teamName: string) => void;
}

export function CreateTeamModal({show, onHide, onCreate}: CreateTeamModalProps) {
    const [teamName, setTeamName] = useState('');

    const handleCreate = () => {
        if (teamName.trim()) {
            onCreate(teamName.trim());
            setTeamName('');
            onHide();
        }
    };

    const handleCancel = () => {
        setTeamName('');
        onHide();
    };

    // if (!show) return null;

    const modal = <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Create Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="teamName">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
                Create
            </Button>
        </Modal.Footer>
    </Modal>;

    return ReactDOM.createPortal(modal, document.body);
}

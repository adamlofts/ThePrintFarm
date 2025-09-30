import React from 'react'
import {NumberInput} from "@components/ui/NumberInput";

export function AlgoGenericHoop({algoGenericHoop, setAlgoGenericHoop}) {
    function buildCallback(key) {
        return (val) => {
            const newAlgoGenericHoop = {...algoGenericHoop};
            newAlgoGenericHoop[key] = val;
            setAlgoGenericHoop(newAlgoGenericHoop);
        };
    }

    return (
        <React.Fragment>

            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Spacing
                    <div className="form-text">
                        Customize the spacing between each rotation of the wind (default is band width)
                    </div></label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoGenericHoop.spacing} onChange={buildCallback('spacing')}/>
                        <span className="input-group-text">mm</span>
                    </div>

                </div>
            </div>

            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Transition Length</label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoGenericHoop.transitionLength} onChange={buildCallback('transitionLength')}/>
                        <span className="input-group-text">mm</span>
                    </div>

                    <div className="form-text">
                        Length to begin transition at ends
                    </div>
                </div>
            </div>


            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Transition Count</label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoGenericHoop.transitionCount} onChange={buildCallback('transitionCount')}/>
                        <span className="input-group-text">#</span>
                    </div>

                    <div className="form-text">
                        Number of rotations in transition
                    </div>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col"><label htmlFor="inputMesh" className="form-label">Direction</label>
                </div>
                <div className="col text-end">
                    <select className="form-select "
                            value={algoGenericHoop.clockwise ? 'cw' : 'ccw'}
                            onChange={(event) => {
                                buildCallback('clockwise')(event.target.value === 'cw')
                            }}
                    >
                        <option value="cw">Clockwise</option>
                        <option value="ccw">Counter-clockwise</option>
                    </select>
                </div>
            </div>

        </React.Fragment>
    );
}


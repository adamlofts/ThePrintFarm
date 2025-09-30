import React from 'react'
import {NumberInput} from "@components/ui/NumberInput";

export const defaultAlgoRotationalHelicalPattern = {
    helical: {
        angle: 60,
        turnA: 10,
        turnB: 10,
    }
};


export function AlgoRotationalHelicalPattern({algoRotationalHelicalPattern, setAlgoRotationalHelicalPattern}) {
    function buildCallback(key) {
        return (val) => {
            const newAlgoRotationalHelicalPattern = {...algoRotationalHelicalPattern};
            newAlgoRotationalHelicalPattern.helical[key] = val;
            setAlgoRotationalHelicalPattern(newAlgoRotationalHelicalPattern);
        };
    }

    return (
        <React.Fragment>

            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Wind Angle
                    <div className="form-text">
                        Angle in degrees
                    </div></label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoRotationalHelicalPattern.helical.angle} onChange={buildCallback('angle')}/>
                        <span className="input-group-text">°</span>
                    </div>

                </div>
            </div>

            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Turn A Distance
                    <div className="form-text">
                        From left edge
                    </div></label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoRotationalHelicalPattern.helical.turnA} onChange={buildCallback('turnA')}/>
                        <span className="input-group-text">mm</span>
                    </div>

                </div>
            </div>

            <div className="row mb-2">
                <div className="col"><label htmlFor="formlength" className="form-label">Turn B Distance
                    <div className="form-text">
                        From right edge
                    </div></label>
                </div>
                <div className="col ">
                    <div className="input-group">
                        <NumberInput value={algoRotationalHelicalPattern.helical.turnB} onChange={buildCallback('turnB')}/>
                        <span className="input-group-text">mm</span>
                    </div>

                </div>
            </div>

        </React.Fragment>
    );
}


import React from 'react'
import {NumberInput} from "@components/ui/NumberInput";

export function AlgoBend({algoBend, setAlgoBend}) {
    function buildCallback(key) {
        return (val) => {
            const newAlgoBend = {...algoBend};
            newAlgoBend[key] = val;
            setAlgoBend(newAlgoBend);
        };
    }

    const isGeodesic = !algoBend.mu;

    return (
        <React.Fragment>
            <div className="row mb-2">
                <b>Samples</b>
                <div className="col"><label htmlFor="formlength" className="form-label">Angle Range</label>
                    <div className="form-text">Range of sampled angles from the start edge tangent</div>
                </div>
                <div className="col">
                    <div className="double-text mb-2">
                        <div className="input-group">
                            <NumberInput value={algoBend.minAngle} onChange={buildCallback('minAngle')}/>
                            <span className="input-group-text">°</span>
                        </div>

                        <div className="input-group">
                            <NumberInput value={algoBend.maxAngle} onChange={buildCallback('maxAngle')}/>
                            <span className="input-group-text">°</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <NumberInput value={algoBend.startAngleCount} onChange={buildCallback('startAngleCount')}/>
                        <span className="input-group-text">sample</span>
                    </div>
                </div>
            </div>

            <div className="row mb-2">
                <b>Non-Geodesic Wind</b>
                <div className="col">Friction Limit
                    <div className="form-text">0 means geodesic. A value &gt; 0 will bend off the geodesic at the start and
                        end of the curve</div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <NumberInput value={algoBend.mu} onChange={buildCallback('mu')}/>
                        <span className="input-group-text">μ</span>
                    </div>
                </div>
            </div>

            {!isGeodesic &&
                <>
                    <div className="row mb-2">
                        <div className="col">Start Bend
                            <div className="form-text">The min and max length to turn out from the start edge. Samples
                                taken
                                from this range.</div>
                        </div>
                        <div className="col">
                            <div className="double-text mb-2">
                                <div className="input-group">
                                    <NumberInput value={algoBend.minStartTurnLength}
                                                 onChange={buildCallback('minStartTurnLength')}/>
                                    <span className="input-group-text">mm</span>
                                </div>

                                <div className="input-group">
                                    <NumberInput value={algoBend.maxStartTurnLength}
                                                 onChange={buildCallback('maxStartTurnLength')}/>
                                    <span className="input-group-text">mm</span>
                                </div>
                            </div>

                            <div className="input-group">
                                <NumberInput value={algoBend.startTurnLengthCount}
                                             onChange={buildCallback('startTurnLengthCount')}/>
                                <span className="input-group-text">sample</span>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col">Max End Bend Length
                            <div className="form-text">The max length to turn tangent to the end edge</div>
                        </div>
                        <div className="col">
                            <div className="input-group">
                                <NumberInput value={algoBend.endTurnLength} onChange={buildCallback('endTurnLength')}/>
                                <span className="input-group-text">mm</span>
                            </div>
                        </div>
                    </div>
                </>
            }


        </React.Fragment>
    );
}


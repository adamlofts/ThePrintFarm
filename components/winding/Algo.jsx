import React, {useEffect, useState} from 'react'
import {AlgoGenericHoop} from "./AlgoGenericHoop";
import {AlgoBend} from "./AlgoBend";
import {Collapse} from "bootstrap";
import {degToRad} from "three/src/math/MathUtils";
// import {Optimize} from "./Optimize";
import {AlgoRotationalHelical, defaultAlgoRotationalHelical} from "./AlgoRotationalHelical";
import {AlgoRotationalHelicalPattern, defaultAlgoRotationalHelicalPattern} from "./AlgoRotationalHelicalPattern";
// import {NumberInput} from "./NumberInput";

export const ALGO_PRIMITIVE_HOOP = 'primitive_hoop';
export const ALGO_PRIMITIVE_HELICAL = 'primitive_helical';
export const ALGO_PRIMITIVE_HELICAL_PATTERN = 'primitive_helical_pattern';
export const ALGO_PRIMITIVE_POLAR = 'primitive_polar';
export const ALGO_PRIMITIVE_POLAR_PATTERN = 'primitive_polar_pattern';
export const ALGO_PRIMITIVE_TRANSITION = 'primitive_transition_pattern';

export const ALGO_ROTATIONAL_HELICAL = 'rotation_helical';
export const ALGO_ROTATIONAL_HELICAL_PATTERN = 'rotation_helical_pattern';

export const ALGO_GENERIC_HOOP = 'generic_hoop';
export const ALGO_GENERIC_BEND = 'generic_bend';

function isAlgoGeneric(algo) {
    return (algo === ALGO_GENERIC_HOOP) || (algo === ALGO_GENERIC_BEND);
}

const defaultTurnType = 'friction';

const defaultAlgoGenericHoop = {
    spacing: 6,
    transitionLength: 5,
    transitionCount: 2,
    clockwise: false,
};

const defaultAlgoBend = {
    minAngle: 30,
    maxAngle: 40,
    startAngleCount: 1,
    mu: 0,
    minStartTurnLength: 5,
    maxStartTurnLength: 50,
    startTurnLengthCount: 1,
    endTurnLength: 250,
};

const defaultOptimizeParam = {
    requireStartFromStop: true,  // always true except when previewing
    requireAlternateWinds: false,
    tangentTolerance: 90,
    maxPatternSize: 200,
};

const defaultBandWidth = 6;

const presetBandWidth = {
    'boxcone': 14,
    'cn200': 12,
    'cone': 6,
    'boom': 1,
    'cylinder': 1,
    'airfoil': 4,
}

const presetTurnType = {
    'cncone': 'pin',
    'boxcone': 'pin',
    'cone': 'pin',
}

const presetPinSpacing = {
    'spar1': 2,
}

const presetAlgoGenericHoop = {
    'boom': {
        spacing: 3,
        transitionCount: 5,
    },
    'cylinder': {
        transitionCount: 4,
    },
}

const presetAlgoBend = {
    'cncone': {
        minAngle: 36,
        maxAngle: 75,
        startAngleCount: 80,
        mu: 0,
    },
    'boxcone': {
        minAngle: 45,
        maxAngle: 75,
        startAngleCount: 20,
        mu: 0,
    },
    'cn200': {
        minAngle: 87.5,
        maxAngle: 89,
        startAngleCount: 5,

        minStartTurnLength: 5,
        maxStartTurnLength: 150,
        startTurnLengthCount: 6,
        endTurnLength: 150,
        mu: 25,
    },
    'spar1': {
        minAngle: 84,
        maxAngle: 88,
        startAngleCount: 2,

        mu: 12,
        minStartTurnLength: 10,
        maxStartTurnLength: 30,
        startTurnLengthCount: 2,
        endTurnLength: 30,
    },
    'cone': {
        minAngle: 35,
        maxAngle: 40,
        startAngleCount: 1,
    },
    'airfoil': {
        minAngle: 75,
        maxAngle: 85,
        startAngleCount: 6,
        mu: 0,
    },
    'helmet2': {
        minAngle: 85,
        maxAngle: 87,
        startAngleCount: 1,
        mu: 0,
    },
}

const presetOptimizeParam = {
    'cncone': {
        tangentTolerance: 60,
    },
    'boxcone': {
        tangentTolerance: 60,
    },
    'cn200': {
        tangentTolerance: 6,
        requireAlternateWinds: true,
    },
    'spar1': {
        tangentTolerance: 75,
        requireAlternateWinds: true,
    },
    'cone': {
        tangentTolerance: 60,
    },
}

export function Algo({loadPatterns, loadingPatterns, setPreviewWindParam, algo, preset}) {
    const [algoGenericHoop, setAlgoGenericHoop] = useState(defaultAlgoGenericHoop);
    const [algoRotationalHelical, setAlgoRotationalHelical] = useState(defaultAlgoRotationalHelical);
    const [algoRotationalHelicalPattern, setAlgoRotationalHelicalPattern] = useState(defaultAlgoRotationalHelicalPattern);
    const [algoBend, setAlgoBend] = useState(defaultAlgoBend);
    const [optimizeParam, setOptimizeParam] = useState(defaultOptimizeParam);

    const [turnType, setTurnType] = useState(defaultTurnType);
    const [pinSpacing, setPinSpacing] = useState(defaultBandWidth);
    const [bandWidth, setBandWidth] = useState(defaultBandWidth);

    useEffect(() => {
        setPreviewWindParam({
            showPins: turnType === 'pin',
            pinSpacing: pinSpacing,
        });
    }, [turnType, pinSpacing])

    useEffect(() => {
        setTurnType(presetTurnType[preset] || defaultTurnType);
        setBandWidth(presetBandWidth[preset] || defaultBandWidth);
        setPinSpacing(presetPinSpacing[preset] || presetBandWidth[preset] || defaultBandWidth);
        setAlgoGenericHoop({
            ...defaultAlgoGenericHoop,
            ...presetAlgoGenericHoop[preset] || {},
        })
        setAlgoBend({
            ...defaultAlgoBend,
            ...presetAlgoBend[preset] || {},
        })
        setOptimizeParam({
            ...defaultOptimizeParam,
            ...presetOptimizeParam[preset] || {},
        })
    }, [preset]);

    function trigger(evt, previewCount) {
        const el = evt.target.closest('.collapse');
        new Collapse(el).toggle();

        let algoParams = [];
        if (algo === ALGO_GENERIC_BEND) {
            algoParams.push({
                ...algoBend,
                minAngle: degToRad(algoBend.minAngle),
                maxAngle: degToRad(algoBend.maxAngle),
            });
        } else if (algo === ALGO_GENERIC_HOOP) {
            algoParams.push(algoGenericHoop);
            // hack
            previewCount = 1;
        } else if (algo === ALGO_ROTATIONAL_HELICAL) {
            algoParams.push({
                ...algoRotationalHelical,
                angle: degToRad(algoRotationalHelical.angle),
            })
        } else if (algo === ALGO_ROTATIONAL_HELICAL_PATTERN) {
            algoParams.push({
                ...algoRotationalHelicalPattern,
                ...{
                    helical: {
                        ...algoRotationalHelicalPattern.helical,
                        angle: degToRad(algoRotationalHelicalPattern.helical.angle)
                    }
                }
            })
        }

        let finalOptimizeParam = optimizeParam;
        // If preview then relax optimization
        if (previewCount > 0) {
            finalOptimizeParam = {
                ...optimizeParam,
                tangentTolerance: degToRad(90),
                requireStartFromStop: false,
                requireAlternateWinds: false,
            };
        }

        // If pins then explicit spacing, otherwise bandwidth
        const p = {
            algoType: algo,
            algoParams: algoParams,
            turnType: turnType,
            optimize: finalOptimizeParam,
            maxCandidates: previewCount,
            bandWidth: Number(bandWidth),
            geomRequest: {
                showPins: turnType === 'pin',
                pinSpacing: pinSpacing,
            },
            endAtPin: turnType === 'pin',
        }
        loadPatterns(p, previewCount);
    }

    return (<>
        <div className="row">
            <div className="col"><label htmlFor="formlength" className="form-label">Band Width</label>
            </div>
            <div className="col text-end">
                <div className="input-group mb-3 fix-numerical-width-small">
                    <input id="formlength" type="text" className="form-control"
                           aria-label="Band Width" aria-describedby="basic-addon2"
                           value={bandWidth}
                           onChange={(e) => {
                               setBandWidth(e.target.value);
                           }}
                    />
                    <span className="input-group-text">mm</span>
                </div>
            </div>
        </div>

        {(algo === ALGO_GENERIC_BEND) &&
            <>
            <div className="row mb-2">
                <div className="col"><label htmlFor="material" className="form-label">Turn Around Method</label></div>
                <div className="col text-end">
                    <select className="form-select fix-numerical-width"
                            value={turnType}
                            onChange={(evt) => setTurnType(evt.target.value)}
                    >
                        <option value="friction">Friction</option>
                        <option value="pin">Pin</option>
                    </select>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col"><label htmlFor="material" className="form-label">{turnType === 'pin' && "Pin Spacing" || "Sample Spacing"}</label></div>
                <div className="col text-end">
                    <div className="input-group mb-3 fix-numerical-width-small">
                        <NumberInput value={pinSpacing} onChange={setPinSpacing}/>
                        <span className="input-group-text">mm</span>
                    </div>
                </div>
            </div>
        </>}

        {(algo === ALGO_GENERIC_HOOP) && <AlgoGenericHoop algoGenericHoop={algoGenericHoop} setAlgoGenericHoop={setAlgoGenericHoop}/>}
        {(algo === ALGO_GENERIC_BEND) && <AlgoBend algoBend={algoBend} setAlgoBend={setAlgoBend} loadPatterns={loadPatterns}
                                 loadingPatterns={loadingPatterns}
                                 setPreviewWindParam={setPreviewWindParam}/>}

        {(algo === ALGO_GENERIC_BEND) && <Optimize optimizeParam={optimizeParam} setOptimizeParam={setOptimizeParam} />}

        {(algo === ALGO_ROTATIONAL_HELICAL) && <AlgoRotationalHelical algoRotationalHelical={algoRotationalHelical} setAlgoRotationalHelical={setAlgoRotationalHelical}/>}
        {(algo === ALGO_ROTATIONAL_HELICAL_PATTERN) && <AlgoRotationalHelicalPattern algoRotationalHelicalPattern={algoRotationalHelicalPattern} setAlgoRotationalHelicalPattern={setAlgoRotationalHelicalPattern}/>}

        <div className="accordion-button-group flex-row-reverse">
            <button className="btn btn-primary pull-right" onClick={(evt) => trigger(evt, 0)}
                    disabled={loadingPatterns}>🔎 Find
                Patterns
            </button>
            {(algo === ALGO_GENERIC_BEND) && (<>
            <button className="btn btn-secondary pull-right" onClick={(evt) => trigger(evt, 10)}
                    disabled={loadingPatterns}>Preview 10
            </button>
            <button className="btn btn-secondary pull-right" onClick={(evt) => trigger(evt, 2)}
                    disabled={loadingPatterns}>Preview 2
            </button>
            <button className="btn btn-secondary pull-right" onClick={(evt) => trigger(evt, 1)}
                    disabled={loadingPatterns}>Preview 1
            </button>
            </>)}
        </div>
    </>);
}


import React from 'react'
import {radToDeg} from "three/src/math/MathUtils";

function WindRow(wind, windIndex, setWindIndex) {
    const param = wind.param;
    const startParam = param.startParam;
    const angle = radToDeg(param.theta);
    const coverage = wind.coverage * 100;
    const focused = wind.key === windIndex;
    return (
        <tr
            className={focused ? 'tr-highlight' : ''} key={wind.key}
            onClick={(evt) => setWindIndex(wind.key)}
        >
            <td>{String.fromCharCode(65 + param.startWire)}</td>
            <td>{startParam.toFixed(2)}</td>
            <td>{angle.toFixed(1)}</td>
            <td>{param.startTurnLength.toFixed(1)}</td>
            <td>{coverage.toFixed(1)}</td>
            <td>{radToDeg(wind.angleToEndEdge).toFixed(0)}</td>
        </tr>
    )
}

export function SparPattern({patternDetail, windIndex, setWindIndex}) {
    const winds = patternDetail.winds;
    for (let i = 0; i < winds.length; i++) {
        winds[i].key = i;
    }

    return (
        <React.Fragment>
            <table className="table table-bordered table-hover">
                <thead>
                <tr>
                    <td colSpan="6">Pattern Winds</td>
                </tr>
                <tr>
                    <td colSpan="2">Start</td>
                    <td>Angle</td>
                    <td>Start Bend</td>
                    <td>Coverage</td>
                    <td>End Angle</td>
                </tr>
                </thead>
                <tbody>
                {winds.map((p) => WindRow(p, windIndex, setWindIndex))}
                </tbody>
            </table>
        </React.Fragment>
    );
}


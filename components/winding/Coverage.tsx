import React from 'react'
import * as THREE from "three";
import styles from './Coverage.module.css';

const layerCount = 10;

export function layerColor(layer) {
    const h = Math.min(layer, layerCount) * (1 / (layerCount + 1));
    return new THREE.Color().setHSL(h, 1, 0.7);
}


function Layer({layer, totalArea, extraLayerArea}) {
    let area = layer.area;
    if (layer.layer === layerCount) {
        area += extraLayerArea;
    }

    const perc = (area / totalArea) * 100;

    const color = layerColor(layer.layer);

    return (
        <tr>
            <td className={styles.colorKey} style={{backgroundColor: '#' + color.getHexString()}}></td>
            <td>{layer.layer === 0 ? 'none' : layer.layer}{layer.layer === layerCount ? '+' : ''}</td>
            <td>{perc.toFixed(1)}%</td>
        </tr>
    );
}

export function Coverage({layers, toggleCoverage, coverageVisible}) {
    const totalArea = layers.map((layer) => layer.area).reduce((a, b) => a + b, 0);
    const flayers = layers.filter((layer) => layer.layer <= layerCount);
    const extraLayerArea = layers.filter((layer) => layer.layer >= layerCount)
        .map((layer) => layer.area).reduce((a, b) => a + b, 0);

    return (
        <React.Fragment>
            {/*<button className="btn btn-secondary mb-3"*/}
            {/*        onClick={toggleCoverage}>{coverageVisible ? 'Show Wind' : 'Show Coverage'}</button>*/}
            <table className="table table-sm table-bordered">
                <thead>
                <tr>
                    <th colSpan="2"># of layers</th>
                    <th>Coverage</th>
                </tr>
                </thead>
                <tbody>
                {flayers.map((layer) => <Layer key={layer.layer} layer={layer} totalArea={totalArea}
                                              extraLayerArea={extraLayerArea}/>)}
                </tbody>
            </table>
        </React.Fragment>
    )
}


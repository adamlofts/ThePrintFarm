import {useEffect, useRef} from 'react'
import * as THREE from "three";
import {base64} from "rfc4648";
import {STLLoader} from "three/addons/loaders/STLLoader";
import {createBandMaterial, parseBand} from "./3d";


export function ThreeScene({
                               geom,
                               camera,
                               controls,
                               rotaryGroup,
                               setBody,
                               animate,
                               coverageVisible,
                               scene,
                               focusedPatternDetail,
                               previewWindParam,
                               setLoadingBody,
    geomFunc, windIndex, bandGroup

                           }) {
    const geomGroup = useRef(null);

    useEffect(() => {
        let isSubscribed = true;

        const v = async () => {
            setLoadingBody(true);
            const {body, group} = await loadGeom(geomFunc, camera, controls);
            if (!isSubscribed) {
                return;
            }

            setBody(body);
            rotaryGroup.add(group);
            geomGroup.current = group;
            animate();
            setLoadingBody(false);
        }
        v();
        return () => {
            if (geomGroup.current) {
                rotaryGroup.remove(geomGroup.current);
                geomGroup.current = null;
                animate();
            }
            return isSubscribed = false;
        };
    }, [geom, previewWindParam]);

    useEffect(() => {
        let coverageGroup = new THREE.Group();

        if (!coverageVisible) {
            return;
        }
        if (focusedPatternDetail == null) {
            return;
        }

        for (const layer of focusedPatternDetail.layers) {
            const color = layerColor(layer.layer);
            let layerMaterial = new THREE.MeshStandardMaterial({color: color, metalness: 0.1, roughness: 0.5});

            const loader = new STLLoader();
            const buffer = base64.parse(layer.stl);
            const geometry = loader.parse(buffer.buffer);

            const layerMesh = new THREE.Mesh(geometry, layerMaterial);
            layerMesh.layers.set(1);
            coverageGroup.add(layerMesh);
        }
        scene.add(coverageGroup);

        animate();

        return () => { scene.remove(coverageGroup); animate(); };
    }, [focusedPatternDetail, coverageVisible]);

    useEffect(() => {
        if (focusedPatternDetail == null) {
            return;
        }

        const materialA = createBandMaterial('#00ff00');
        const materialB = createBandMaterial('#ddff00');
        const bandMaterials = [materialA, materialB];

        const stls = focusedPatternDetail.stls;
        let instanceIndex = 0;
        for (let i = 0; i < stls.length; i++) {
            if (windIndex >= 0 && windIndex !== i) {
                continue;
            }
            const wind = focusedPatternDetail.winds[i];
            const count = wind.cycleCount;
            const material = wind.param.startWire % 2 ? materialB : materialA;
            const theta = wind.cycleRotation;
            const band = parseBand(stls[i], material, count, instanceIndex, theta);
            band.visible = !coverageVisible;
            bandGroup.add(band);
            instanceIndex += count;
        }

        animate();
        return () => { bandGroup.clear(); animate(); };
    }, [focusedPatternDetail, windIndex]);

    useEffect(() => {
        for (let i = 0; i < bandGroup.children.length; i++) {
            bandGroup.children[i].visible = !coverageVisible;
        }
        animate();
    }, [coverageVisible]);

    if (geomGroup.current) {
        geomGroup.current.visible = !coverageVisible;
    }
}

import {degToRad} from "three/src/math/MathUtils";
import React, {ReactElement, Ref, useEffect, useState} from 'react'
import * as THREE from "three";
import {AnalysisLaminateSheet, endpoint, makeDownloadUrl, SpecLaminateSheet, SpecLaminateSheetForm} from "@api/api";
import {SpecLaminateSheetForm} from "./SpecLaminateSheetForm";
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from './LaminateSheetComponent.module.css';
import {formatDurationAgo, formatFileSize, isSpecLaminateSheetSame} from "@api/api";
import {RerenderOnWidthChange} from "@components/ui/RerenderOnWidthChange";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {formatDate} from "@api/api";


function byteaToUint8Array(byteaStr) {
    const hex = byteaStr.startsWith("\\x") ? byteaStr.slice(2) : byteaStr;
    const len = hex.length / 2;
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
}


interface DrawingPreviewProps {
    width: number;
    height: number;
    spec: SpecLaminateSheet;
    analyis: AnalysisLaminateSheet;
    render: (scene: THREE.Scene, camera: THREE.Camera) => void;
    canvasRef: Ref<ReactElement>;
}

function makeBox(box) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        0
    ));
    const boxCenter = new THREE.Vector3((box.min.x + box.max.x) / 2,
        (box.min.y + box.max.y) / 2,
        0);
    m.position.copy(boxCenter);

    const bh = new THREE.BoxHelper((m), 0xff0000);
    return bh;
}


function DrawingPreview({
                            width,
                            height,
                            spec,
                            analysis,
                            render,
                            canvasRef,
                        }: DrawingPreviewProps) {

    const [camera, setCamera] = useState<THREE.Camera>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [canvasFocused, setCanvasFocused] = useState(false);
    const [geomGroup, setGeomGroup] = useState();
    const [zoom, setZoom] = useState(0);  // 0 -> 1

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();

        // depth planes will be adjusted in fitCamera()

        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
        scene.add(ambientLight);

        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, intensity of 1
        directionalLight.position.set(500, 0, 0); // Looks at origin by default
        scene.add(directionalLight);

        const camera = new THREE.OrthographicCamera();

        setCamera(camera);
        setScene(scene);
    }, []);

    const fitCameraToBox = () => {
        let cameraBox = new THREE.Box3();
        for (let actor of analysis.actors) {
            let box = new THREE.Box3(new THREE.Vector3(actor.bbox[0][0], actor.bbox[0][1], 0),
                new THREE.Vector3(actor.bbox[1][0], actor.bbox[1][1], 0));
            cameraBox = cameraBox.union(box);
        }

        const padding = 1.1;

        // Box size and center
        const size = new THREE.Vector3();
        cameraBox.getSize(size);
        const center = new THREE.Vector3();
        cameraBox.getCenter(center);

        // Canvas aspect ratio
        const aspect = width / height;

        // Apply optional padding
        const scale = (1/(zoom*10+1));
        const halfWidth = (size.x / 2) * padding * scale;
        const halfHeight = (size.y / 2) * padding * scale

        // Adjust bounds to maintain 1:1 aspect on screen
        if (aspect >= 1) {
            // Wide canvas, width dominates
            camera.left = -halfWidth * aspect;
            camera.right = halfWidth * aspect;
            camera.top = halfHeight;
            camera.bottom = -halfHeight;
        } else {
            // Tall canvas, height dominates
            camera.left = -halfWidth;
            camera.right = halfWidth;
            camera.top = halfHeight / aspect;
            camera.bottom = -halfHeight / aspect;
        }

        // Position camera above the XY plane (Z axis)
        camera.position.set(center.x, center.y, 100); // Z=10 or any value >0
        camera.up.set(0, 1, 0);
        camera.lookAt(center);

        // Set near/far planes
        camera.near = -1000;
        camera.far = 1000;

        camera.updateProjectionMatrix();
    }

    const handleZoom = (evt, d) => {
        evt.preventDefault();
        evt.stopPropagation();

        // Must use functional form because handleZoom is captured in the scroll event handler
        setZoom((prevZoom) => {
            let nz = prevZoom + d / 10;
            nz = Math.min(1, nz);
            nz = Math.max(0, nz);
            return nz;
        });
    };

    //// move to parent?
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (!canvasFocused) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            handleZoom(event, event.deltaY < 0 ? 1 : -1);
        };

        const handleClick = (event) => {
            // setRotation(-15);
        };

        canvas.addEventListener('wheel', handleWheel, {passive: false});
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('click', handleClick);
        };
    }, [canvasFocused]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;

        function handleFocus() {
            setCanvasFocused(true);
        }

        function handleBlur() {
            setCanvasFocused(false);
        }

        canvas.addEventListener('focus', handleFocus);
        canvas.addEventListener('blur', handleBlur);

        return () => {
            canvas.removeEventListener('focus', handleFocus);
            canvas.removeEventListener('blur', handleBlur);
        };

    }, [canvasRef]);
    ///

    const animate = () => {
        render(scene, camera);
    }

    const handleRotation = (evt, d) => {
        evt.preventDefault();
        evt.stopPropagation();

        // Must use functional form because handleZoom is captured in the scroll event handler
        setRotation((prevRotation) => {
            let nz = prevRotation + 15 * d;
            return nz;
        });
    };

    useEffect(() => {
        if (!scene || !analysis) {
            return;
        }

        let newGeomGroup = new THREE.Group();
        scene.add(newGeomGroup);
        setGeomGroup(newGeomGroup);


        const firstMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
        const material = new THREE.LineBasicMaterial({color: 0xff0000});

        for (let actor of analysis.actors) {
            let box = new THREE.Box3(new THREE.Vector3(actor.bbox[0][0], actor.bbox[0][1], 0),
                new THREE.Vector3(actor.bbox[1][0], actor.bbox[1][1], 0));

            for (let index = 0; index < actor.polys.length; index++) {
                const poly2d = actor.polys[index];
                const points3D = poly2d.map(([x, y]) => new THREE.Vector3(x, y, 0));
                const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
                const line = new THREE.Line(geometry, index == 0 ? firstMaterial : material); //
                // const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color:layerColor(index)})); //index == 0 ? firstMaterial : material
                newGeomGroup.add(line);
            }

            // newGeomGroup.add(makeBox(box));
        }

        fitCameraToBox();
        // newGeomGroup.add(makeBox(cameraBox));
        animate();

        return () => {
            scene.remove(newGeomGroup);
            animate();
        };
    }, [scene, analysis]);

    useEffect(() => {
        if (!camera) return;
        fitCameraToBox();
        animate();
    }, [zoom]);


    return null;
}

const MemoizedDrawingPreview = React.memo(DrawingPreview);


interface LaminateSheetComponentProps {
    spec_id: string;
    stablePartId: string;
    orderId: string;
    onSpecChange: (touched: boolean, spec: SpecLaminateSheet) => void;
    isEditSpec: boolean;
    isEditPattern: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
}

export function LaminateSheetComponent({
                                           spec_id,
                                           onSpecChange,
                                           isEditSpec,
                                           isEditPattern,
                                           triggerEdit,
                                           triggerRemove,
                                           triggerManualPrice,
                                           readOnly,
                                           stablePartId, orderId
                                       }: LaminateSheetComponentProps) {
    const {supabase, loading} = useSupabase();
    const [analysis, setAnalysis] = useState<AnalysisLaminateSheet>();
    const [focusedPattern, setFocusedPattern] = useState();
    const [spec, setSpec] = useState<SpecLaminateSheet>();
    const [expanded, setExpanded] = useState(false);
    const {isTenantAdmin} = useAccountsAndTenantAdmin();
    const [coverageVisible, setCoverageVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [latestFile, setLatestFile] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecLaminateSheet')
                .select('*')
                .eq('id', spec_id)
                .single();
            const newSpec: SpecLaminateSheet = data;
            setSpec(newSpec);
            if (!isMounted) return;

            ({data, error} = await supabase
                .from('AnalysisLaminateSheet')
                .select('*')
                .eq('spec_id', newSpec.id)
                .single());
            if (!isMounted) return;
            const analysis: AnalysisLaminateSheet = data;
            setAnalysis(analysis);

            ({data, error} = await supabase
                .from('File')
                .select('*, FileRevision(*)')
                .eq('order_id', orderId)
                .eq('part_stable_id', stablePartId));
            const newFiles: any[] = data;

            for (let file of newFiles) {
                file.latestRevision = file.FileRevision[file.FileRevision.length - 1];  // fixme
            }
            setFiles(newFiles);

            if (newFiles.length > 0) {
                setLatestFile(newFiles[0]);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [spec_id]);

    if (!analysis) {
        return;
    }

    function trigger(attr) {
        const newSpec = {
            ...spec,
            ...attr,
        };
        const equal = isSpecLaminateSheetSame(spec, newSpec);
        onSpecChange(!equal, newSpec);
    }

    function handleSpec(touched: boolean, newSpec: SpecLaminateSheet, valid: boolean) {
        trigger(newSpec);
    }

    const handleDownload = async (revisionId: string) => {
        const url = await makeDownloadUrl(supabase, orderId, revisionId);
        window.location.assign(url);
    }

    const bboxPretty = (bbox) => {
        return <>{(bbox[1][0] - bbox[0][0]).toFixed(0)}mm x
        {' '}
        {(bbox[1][1] - bbox[0][1]).toFixed(0)}mm</>
    }
    const singleActor = analysis.actors.length === 1 ? analysis.actors[0] : null;

    return <>
        <div className={styles.titleLine}>
            <div>CFRP Sheet</div>
            <div className={styles.revisionButtons} role="group">
                {!isEditSpec && <button className={styles.revisionButton} onClick={() => setExpanded(!expanded)}>
                    {expanded && 'Collapse' || 'Expand'}
                </button>}
                {!readOnly && !isEditSpec &&
                    <button className={styles.revisionButton} onClick={triggerEdit}>Edit...</button>}
                {!readOnly && !isEditSpec &&
                    <button className={styles.revisionButton} onClick={triggerRemove}>Remove</button>}
                {!readOnly && isTenantAdmin && !isEditSpec &&
                    <button className={styles.adminButton} onClick={triggerManualPrice}>Manually Price</button>}
            </div>
        </div>

        {!isEditSpec && <>
            <div className={styles.subtitle}>{spec.quantity} unit{spec.quantity != 1 && 's'}
                {' '}•{' '}
                {singleActor && bboxPretty(singleActor.bbox)}
                {!singleActor && <>
                    {analysis.actors.length} parts per unit
                </>}
                {' '}•{' '}
                {spec.thickness}mm thickness
                {' '}•{' '}
                {files.length} file{files.length === 1 ? '' : 's'}
                {' '}•{' '}
                {latestFile && <a onClick={evt => setExpanded(true)}>
                    {latestFile.name}
                    {' '}{formatDurationAgo(new Date(latestFile.latestRevision.created_at))}</a>}
            </div>
        </>}

        {!isEditSpec && analysis.actors && <RerenderOnWidthChange height={400} className={styles.canvas}>
            {(width, render, canvasRef) => (
                // render() is stable, since created with useCallback.
                // Memorizing this expensive component means that it is not re-rendered when the parent element
                // changes. Only when the props change.
                <MemoizedDrawingPreview
                    width={width}
                    height={400}
                    spec={spec} analysis={analysis}
                    render={render}
                    canvasRef={canvasRef}/>
            )}
        </RerenderOnWidthChange>}

        {expanded && !isEditSpec && <>
            <section>
                <h4>Files</h4>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>File</th>
                        <th>Size</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((f) => <tr key={f.id}>
                        <td>{f.name}</td>
                        <td>{formatFileSize(f.latestRevision.size)}</td>
                        <td>{formatDate(new Date(f.latestRevision.created_at))}</td>
                        <td><a onClick={evt => handleDownload(f.latestRevision.id)}
                               className="btn btn-secondary">Download</a></td>
                        {/*<td>{JSON.stringify(f)}</td>*/}
                    </tr>)}
                    </tbody>
                </table>
            </section>
        </>}

        {expanded && !isEditSpec && <>
            <section>
                <h4>Specification</h4>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Parts</th>
                    </tr>
                    {analysis.actors.map((a, index) =>
                    <tr key={index}>
                        <td>Part {index+1}</td>
                        <td>{bboxPretty(a.bbox)}</td>
                    </tr>
                    )}
                    <tr>
                        <th colSpan="2" scope="rowgroup">Materials</th>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td>Material</td>*/}
                    {/*    <td>{materialOption.label}</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*    <td>Material</td>*/}
                    {/*    <td>{subMaterialOption.label}</td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>
            </section>

            <section>
                <h4 className={styles.h4}>Manufacturing Plan</h4>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Compression Mold</th>
                    </tr>
                    <tr>
                        <td>Spacing</td>
                        <td>10mm</td>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td>Thickness</td>*/}
                    {/*    <td>8mm</td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>

                <div>
                </div>
                {/*{JSON.stringify(analysisPattern)}*/}
            </section>


        </>}

        {isEditSpec && <>
            <section>
                <SpecLaminateSheetForm initial={spec} trigger={handleSpec}></SpecLaminateSheetForm>
            </section>
        </>}

    </>
}








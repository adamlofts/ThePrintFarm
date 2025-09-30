import {degToRad, lerp} from "three/src/math/MathUtils";
import {STLLoader} from "three/addons/loaders/STLLoader";
import React, {ReactElement, Ref, useContext, useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import {
    AnalysisRubberCompressionMold,
    endpoint, makeDownloadUrl,
    SpecRubberCompressionMold,
    SpecRubberCompressionMoldForm,
    systemOptions
} from "@api/api";
import {
    SpecRubberCompressionMold,
    SpecRubberCompressionMoldForm,
} from "./SpecRubberCompressionForm";
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from './RubberCompressionMold.module.css';
import {
    formatDurationAgo,
    formatDurationToNow, formatFileSize,
    isSpecRubberCompressionMoldSame,
    rubberMaterialOptions,
    rubberSubMaterialOptions
} from "@api/api";
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



interface MoldPreviewProps {
    width: number;
    height: number;
    spec: SpecRubberCompressionMold;
    analyis: AnalysisRubberCompressionMold;
    render: (scene: THREE.Scene, camera: THREE.Camera) => void;
    canvasRef: Ref<ReactElement>;
}

function MoldPreview({
                            width,
                            height,
                            spec,
                            analysis,
                            render,
                            canvasRef,
                        }: MoldPreviewProps) {


    const [camera, setCamera] = useState<THREE.Camera>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [canvasFocused, setCanvasFocused] = useState(false);
    const [geomGroup, setGeomGroup] = useState();

    const [rotation, setRotation] = useState(-15);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();

        // fov of 2 is almost orthographic
        // depth planes will be adjusted in fitCamera()
        const camera = new THREE.PerspectiveCamera(3, width / height, 0.1, 100);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
        scene.add(ambientLight);

        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, intensity of 1
        directionalLight.position.set(500, 0, 0); // Looks at origin by default
        scene.add(directionalLight);

        setCamera(camera);
        setScene(scene);
    }, []);

    const fitCameraToBox = (box) => {
        // Box size with optional offset
        const size = new THREE.Vector3();
        box.getSize(size);

        // Box center
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Calculate distance
        const maxSize = Math.max(size.x, size.y, size.z);
        const fov = THREE.MathUtils.degToRad(camera.fov); // vertical fov in radians
        const fitHeightDistance = maxSize / (2 * Math.tan(fov / 2));
        const fitWidthDistance = fitHeightDistance * camera.aspect;
        const distance = Math.max(fitHeightDistance, fitWidthDistance);

        // Camera set up so that Z is up, X is right and Y towards camera
        camera.position.set(
            center.y, // Y Position
            center.z,  // Z (up position)
            distance * 0.4 // X position
        );

        // Camera up vector stays Y-up in Three.js
        camera.up.set(0, 1, 0);

        // Look at the box center
        camera.lookAt(center);

        // Update near/far planes
        camera.near = distance / 1000;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
    }

    //// move to parent?
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (!canvasFocused) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            handleRotation(event, event.deltaY < 0 ? 1 : -1);
        };

        const handleClick = (event) => {
            setRotation(-15);
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
        newGeomGroup.rotation.x = degToRad(rotation);

        scene.rotation.x = Math.PI / 2; // rotate scene so Z aligns with Y-up
        scene.add(newGeomGroup);
        setGeomGroup(newGeomGroup);

        const vectors = analysis.part_bbox.map(p => new THREE.Vector3(...p));
        const part_bbox = new THREE.Box3().setFromPoints(vectors);
        const partSize = new THREE.Vector3();
        part_bbox.getSize(partSize);

        const femaleSize = new THREE.Vector3();
        if (analysis.female_bbox) {
            const box = new THREE.Box3().setFromPoints(analysis.female_bbox.map(p => new THREE.Vector3(...p)));
            box.getSize(femaleSize);
        }

        const totalInstances = analysis.instance_x * analysis.instance_y;

        const layoutInstances = (m) => {
            if (totalInstances <= 1) {
                return;
            }
            const totalWidth  = analysis.instance_x * femaleSize.x;
            const totalHeight = analysis.instance_y * femaleSize.y;
            const offsetX = -totalWidth  / 2 + femaleSize.x / 2;
            const offsetY = -totalHeight / 2 + femaleSize.y / 2;

            let i = 0;
            for (let x = 0; x < analysis.instance_x; x++) {
                for (let y = 0; y < analysis.instance_y; y++) {
                    const matrix = new THREE.Matrix4()
                        .makeTranslation(
                            offsetX + x * femaleSize.x,
                            offsetY + y * femaleSize.y,
                            0
                        );
                    m.setMatrixAt(i++, matrix);
                }
            }
            m.instanceMatrix.needsUpdate = true;
        };


        let layerMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB( 1., 0.7, 0.7 ), metalness: 0.1, roughness: 0.5});
        const loader = new STLLoader();
        const buffer = byteaToUint8Array(analysis.part_stl);
        const geometry = loader.parse(buffer.buffer);
        const mesh = new THREE.InstancedMesh(geometry, layerMaterial, totalInstances);
        newGeomGroup.add(mesh);
        layoutInstances(mesh);

        const offset = femaleSize.x * 0.6;

        if (analysis.male_bbox) {
            let layerMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB( 0.7, 0.7, 1. ), metalness: 0.1, roughness: 0.5});
            const buffer = byteaToUint8Array(analysis.male_stl);
            const geometry = loader.parse(buffer.buffer);
            const male = new THREE.InstancedMesh(geometry, layerMaterial, totalInstances);
            male.position.set(0, 0, offset);
            newGeomGroup.add(male);
            layoutInstances(male);

            let layerMaterial2 = new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB( 0.7, 1., 0.7 ), metalness: 0.1, roughness: 0.5});
            const buffer2 = byteaToUint8Array(analysis.female_stl);
            const geometry2 = loader.parse(buffer2.buffer);
            const female = new THREE.InstancedMesh(geometry2, layerMaterial2, totalInstances);
            female.position.set(0, 0, -offset);
            newGeomGroup.add(female);
            layoutInstances(female);
        }

        let cameraBox = part_bbox;
        if (totalInstances > 1) {
            // create a scaling matrix to scale by instance counts
            const scaleMatrix = new THREE.Matrix4().makeScale(
                analysis.instance_x,
                analysis.instance_y,
                1 // no scale in Z
            );
            const scaledMin = part_bbox.min.clone().applyMatrix4(scaleMatrix);
            const scaledMax = part_bbox.max.clone().applyMatrix4(scaleMatrix);

            cameraBox = new THREE.Box3(scaledMin, scaledMax);
        }
        fitCameraToBox(cameraBox);

        animate();

        return () => { scene.remove(newGeomGroup); animate(); };
    }, [scene, analysis]);

    useEffect(() => {
        if (!geomGroup) {
            return;
        }
        geomGroup.rotation.x = degToRad(rotation);
        animate();
    }, [rotation]);

    return <>

    </>;
}

// <canvas
//     className={styles.canvas}
//     ref={canvasRef} width={width} height={height}
//     onClick={(evt) => handleZoom(evt, 1)}
//     tabIndex={0} // Makes it focusable
//     onFocus={() => setCanvasFocused(true)}
//     onBlur={() => setCanvasFocused(false)}
// />
const MemoizedMoldPreview = React.memo(MoldPreview);


interface RubberCompressionMoldComponentProps {
    spec_id: string;
    stablePartId: string;
    orderId: string;
    onSpecChange: (touched: boolean, spec: SpecRubberCompressionMold) => void;
    isEditSpec: boolean;
    isEditPattern: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
}

export function RubberCompressionMoldComponent({
                                               spec_id,
                                               onSpecChange,
                                               isEditSpec,
                                               isEditPattern,
                                               triggerEdit,
                                               triggerRemove,
                                               triggerManualPrice,
                                               readOnly,
                                               stablePartId, orderId
                                           }: RubberCompressionMoldComponentProps) {
    const {supabase, loading} = useSupabase();
    const [analysis, setAnalysis] = useState<AnalysisRubberCompressionMold>();
    const [focusedPattern, setFocusedPattern] = useState();
    const [spec, setSpec] = useState<SpecRubberCompressionMold>();
    const [expanded, setExpanded] = useState(false);
    const {isTenantAdmin} = useAccountsAndTenantAdmin();
    const [coverageVisible, setCoverageVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [latestFile, setLatestFile] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecRubberCompressionMold')
                .select('*')
                .eq('id', spec_id)
                .single();
            const newSpec: SpecRubberCompressionMold = data;
            setSpec(newSpec);
            if (!isMounted) return;

            ({data, error} = await supabase
                .from('AnalysisRubberCompressionMold')
                .select('*')
                .eq('spec_id', newSpec.id)
                .single());
            if (!isMounted) return;
            const analysis: AnalysisRubberCompressionMold = data;
            setAnalysis(analysis);

            ({data, error} = await supabase
                .from('File')
                .select('*, FileRevision(*)')
                .eq('order_id', orderId)
                .eq('part_stable_id', stablePartId));
            const newFiles: any[] = data;

            for (let file of newFiles) {
                file.latestRevision = file.FileRevision[file.FileRevision.length -1];  // fixme
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
        const equal = isSpecRubberCompressionMoldSame(spec, newSpec);
        onSpecChange(!equal, newSpec);
    }

    function handleSpec(touched: boolean, newSpec: SpecRubberCompressionMold, valid: boolean) {
        trigger(newSpec);
    }

    const handleDownload = async (revisionId: string) => {
        const url = await makeDownloadUrl(supabase, orderId, revisionId);
        window.location.assign(url);
    }

    const size = new THREE.Vector3();
    if (analysis.part_bbox) {
        const vectors = analysis.part_bbox.map(p => new THREE.Vector3(...p));
        const box = new THREE.Box3().setFromPoints(vectors);
        box.getSize(size);
    }
    const materialOption = rubberMaterialOptions.find((o) => o.value === spec.material);
    const subMaterialOption = rubberSubMaterialOptions[materialOption.value].find((o) => o.value === spec.sub_material);

    return <>
        <div className={styles.titleLine}>
            <div>Compression Molded Rubber</div>
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
            <div className={styles.subtitle}>{spec.quantity} unit{spec.quantity != 1 && 's'} •
                {' '}{size.x.toFixed(0)}mm x
                {' '}{size.y.toFixed(0)}mm x
                {' '}{size.z.toFixed(0)}mm •
                &nbsp;{files.length} file{files.length === 1 ? '': 's'} •
                {latestFile && <a onClick={evt => setExpanded(true)}>
                    &nbsp;{latestFile.name}
                    &nbsp;{formatDurationAgo(new Date(latestFile.latestRevision.created_at))}</a>}
            </div>
        </>}

        {!isEditSpec && analysis.part_bbox && <RerenderOnWidthChange height={400} className={styles.canvas}>
            {(width, render, canvasRef) => (
                // render() is stable, since created with useCallback.
                // Memorizing this expensive component means that it is not re-rendered when the parent element
                // changes. Only when the props change.
                <MemoizedMoldPreview
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
                        <td><a onClick={evt => handleDownload(f.latestRevision.id)} className="btn btn-secondary">Download</a></td>
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
                        <th colSpan="2" scope="rowgroup">Part</th>
                    </tr>
                    <tr>
                        <td>Length</td>
                        <td>{size.x.toFixed(0)}mm</td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td>{size.y.toFixed(0)}mm</td>
                    </tr>
                    <tr>
                        <td>Depth</td>
                        <td>{size.z.toFixed(0)}mm</td>
                    </tr>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Materials</th>
                    </tr>
                    <tr>
                        <td>Material</td>
                        <td>{materialOption.label}</td>
                    </tr>
                    <tr>
                        <td>Material</td>
                        <td>{subMaterialOption.label}</td>
                    </tr>
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
                    <tr>
                        <td>Insert Distance</td>
                        <td>5mm</td>
                    </tr>
                    <tr>
                        <td>Instances per Mold</td>
                        <td>{analysis.instance_x * analysis.instance_y}</td>
                    </tr>
                    <tr>
                        <td>Cycles</td>
                        <td>{Math.ceil(spec.quantity / (analysis.instance_x * analysis.instance_y))}</td>
                    </tr>
                    </tbody>
                </table>

                <div>
                </div>
                {/*{JSON.stringify(analysisPattern)}*/}
            </section>


        </>}

        {isEditSpec && <>
            <section>
                <SpecRubberCompressionMoldForm initial={spec} trigger={handleSpec}></SpecRubberCompressionMoldForm>
            </section>
        </>}

    </>
}








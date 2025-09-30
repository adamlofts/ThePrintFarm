import React, {ReactElement, Ref, useEffect, useState} from 'react'
import * as THREE from "three";
import {AnalysisPrint3d, endpoint, makeDownloadUrl, SpecPrint3d, Print3dForm} from "@api/api";
import {Print3dForm} from "./SpecPrint3dForm";
import {useSupabase} from "@hooks/SupabaseProvider";
import styles from './Print3dComponent.module.css';
import {formatDurationAgo, formatFileSize, isSpecPrint3dSame} from "@api/api";
import {RerenderOnWidthChange} from "@components/ui/RerenderOnWidthChange";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {STLLoader} from "three/addons/loaders/STLLoader";

import * as THREE from 'three';
import {formatDate} from "@api/api";

/**
 * Compute tight distance to fit a Box3 along a given view direction
 * @param box THREE.Box3
 * @param fov Vertical FOV in degrees
 * @param aspect Camera aspect ratio (width/height)
 * @param forward Normalized view direction vector
 * @param up Normalized up vector
 * @returns Tight distance along the view direction
 */
function computeTightCameraDistance(box: THREE.Box3, fov: number, aspect: number, forward: THREE.Vector3, up: THREE.Vector3): number {
    const fovRad = THREE.MathUtils.degToRad(fov);

    // Get 8 corners of the Box3
    const corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    ];

    // Compute box center
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Build camera-aligned basis
    const zAxis = forward.clone().normalize().negate(); // camera looks along -Z in its local frame
    const xAxis = new THREE.Vector3().crossVectors(up, zAxis).normalize(); // right
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize(); // up

    const camMat = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);

    // Transform corners into camera-aligned space
    const cornersCam = corners.map(c => c.clone().sub(center).applyMatrix4(camMat));

    // Compute extents in camera plane
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity; // nearest depth

    for (const v of cornersCam) {
        minX = Math.min(minX, v.x);
        maxX = Math.max(maxX, v.x);
        minY = Math.min(minY, v.y);
        maxY = Math.max(maxY, v.y);
        minZ = Math.min(minZ, v.z);
    }

    const width = maxX - minX;
    const height = maxY - minY;

    const distHeight = height / (2 * Math.tan(fovRad / 2));
    const distWidth = width / (2 * Math.tan(fovRad / 2) * aspect);

    // Tightest distance along view direction, plus nearest corner offset
    return Math.max(distHeight, distWidth) + Math.abs(minZ);
}


interface ModelPreviewProps {
    actorIndex: number;
    width: number;
    height: number;
    spec: SpecPrint3d;
    analyis: AnalysisPrint3d;
    render: (scene: THREE.Scene, camera: THREE.Camera) => void;
    canvasRef: Ref<ReactElement>;
}

function makeBox3(box) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        box.max.z - box.min.z,
    ));
    const boxCenter = new THREE.Vector3((box.min.x + box.max.x) / 2,
        (box.min.y + box.max.y) / 2,
        (box.min.z + box.max.z) / 2);
    m.position.copy(boxCenter);

    const bh = new THREE.BoxHelper((m), 0xff0000);
    return bh;
}


function toThreeMatrix(m) {
    // The constructor and set() method take arguments in row-major order
    return new THREE.Matrix4().set(
        m[0][0], m[0][1], m[0][2], m[0][3],
        m[1][0], m[1][1], m[1][2], m[1][3],
        m[2][0], m[2][1], m[2][2], m[2][3],
        m[3][0], m[3][1], m[3][2], m[3][3],
    );
}

function ModelPreview({
                            width,
                            height,
                            spec,
                            analysis,
    actorIndex,
                            render,
                            canvasRef,
                        }: ModelPreviewProps) {
    const {supabase, loading} = useSupabase();
    const [camera, setCamera] = useState<THREE.Camera>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [canvasFocused, setCanvasFocused] = useState(false);
    const [geomGroup, setGeomGroup] = useState();
    const [zoom, setZoom] = useState(0);  // 0 -> 1

    const actor = analysis.actors[actorIndex];

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

        // fov of 2 is almost orthographic
        // depth planes will be adjusted in fitCamera()
        const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 10000);

        setCamera(camera);
        setScene(scene);
    }, []);

    useEffect(() => {
        if (!scene || !actor) {
            return;
        }
        let isMounted = true;


        let newGeomGroup = new THREE.Group();
        scene.add(newGeomGroup);
        setGeomGroup(newGeomGroup);

        const vectors = actor.printBox.map(p => new THREE.Vector3(...p));
        const box = new THREE.Box3().setFromPoints(vectors);
        const boxHelper = makeBox3(box);
        scene.add(boxHelper);

        // scene.add(new THREE.AxesHelper(15));

        const fetchData = async () => {
            const url = await makeDownloadUrl(supabase, spec.order_id, spec.stl);
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();

            const loader = new STLLoader();
            const geometry = loader.parse(arrayBuffer);

            let material = new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB( 1., 0.5, 0.5 ), metalness: 0.1, roughness: 0.5});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.applyMatrix4(toThreeMatrix(actor.printMatrix));

            newGeomGroup.add(mesh);

            fitCameraToBox();
            animate();
        };

        fetchData();

        return () => {
            // cleanup
            isMounted = false;
            scene.remove(newGeomGroup);
            animate();
        };
    }, [scene, analysis]); // dependency array

    const fitCameraToBox = () => {
        if (!actor) {
            return;
        }

        // This bbox is of the oriented mesh.
        // The mesh is oriented when the STL is loaded.
        // So they match.
        const vectors = actor.printBox.map(p => new THREE.Vector3(...p));
        const box = new THREE.Box3().setFromPoints(vectors);

        // Box size with optional offset
        const size = new THREE.Vector3();
        box.getSize(size);

        // Box center
        const center = new THREE.Vector3();
        box.getCenter(center);

        const distance = computeTightCameraDistance(box, camera.fov, width/height, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1,0));

        // Camera set up so that Z is up, X is right and Y towards camera
        camera.position.set(center.x, center.y, center.z + (distance * (1.1-zoom)));

        camera.up.set(0, 1, 0);

        // Look at the box center
        camera.lookAt(center);

        // Update near/far planes
        camera.near = distance / 1000;
        camera.far = distance * 100;
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
        if (!camera) return;
        fitCameraToBox();
        animate();
    }, [zoom]);


    return null;
}

const MemoizedModelPreview = React.memo(ModelPreview);


interface Print3dComponentProps {
    actorIndex: number;
    partName: string;
    spec_id: string;
    stablePartId: string;
    orderId: string;
    onSpecChange: (touched: boolean, spec: SpecPrint3d) => void;
    isEditSpec: boolean;
    isEditPattern: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
}

export function Print3dComponent({
                                     actorIndex,
                                     partName,
                                           spec_id,
                                           onSpecChange,
                                           isEditSpec,
                                           isEditPattern,
                                           triggerEdit,
                                           triggerRemove,
                                           triggerManualPrice,
                                           readOnly,
                                           stablePartId, orderId
                                       }: Print3dComponentProps) {
    const {supabase, loading} = useSupabase();
    const [analysis, setAnalysis] = useState<AnalysisPrint3d>();
    const [focusedPattern, setFocusedPattern] = useState();
    const [spec, setSpec] = useState<SpecPrint3d>();
    const [expanded, setExpanded] = useState(false);
    const {isTenantAdmin} = useAccountsAndTenantAdmin();
    const [coverageVisible, setCoverageVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [latestFile, setLatestFile] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecPrint3d')
                .select('*')
                .eq('id', spec_id)
                .single();
            const newSpec: SpecPrint3d = data;
            setSpec(newSpec);
            if (!isMounted) return;

            ({data, error} = await supabase
                .from('AnalysisPrint3d')
                .select('*')
                .eq('spec_id', newSpec.id)
                .single());
            if (!isMounted) return;
            const analysis: AnalysisPrint3d = data;
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
    const actor = analysis.actors[actorIndex];

    function trigger(attr) {
        const newSpec = {
            ...spec,
            ...attr,
        };
        const equal = isSpecPrint3dSame(spec, newSpec);
        onSpecChange(!equal, newSpec);
    }

    function handleSpec(touched: boolean, newSpec: SpecPrint3d, valid: boolean) {
        trigger(newSpec);
    }

    const handleDownload = async (revisionId: string) => {
        const url = await makeDownloadUrl(supabase, orderId, revisionId);
        window.location.assign(url);
    }

    const bboxPretty = (bbox) => {
        return <>{(bbox[1][0] - bbox[0][0]).toFixed(0)}mm x
        {' '}
        {(bbox[1][1] - bbox[0][1]).toFixed(0)}mm x
        {' '}
        {(bbox[1][2] - bbox[0][2]).toFixed(0)}mm</>
    }

    return <>
        <div className={styles.titleLine}>
            <div>{partName}</div>
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
                {actor && bboxPretty(actor.bbox)}
                {' '}•{' '}
                {files.length} file{files.length === 1 ? '' : 's'}
                {' '}•{' '}
                {latestFile && <a onClick={evt => setExpanded(true)}>
                    {latestFile.name}
                    {' '}{formatDurationAgo(new Date(latestFile.latestRevision.created_at))}</a>}
            </div>
        </>}

        {!isEditSpec && actor?.bbox && <RerenderOnWidthChange height={400} className={styles.canvas}>
            {(width, render, canvasRef) => (
                // render() is stable, since created with useCallback.
                // Memorizing this expensive component means that it is not re-rendered when the parent element
                // changes. Only when the props change.
                <MemoizedModelPreview
                    actorIndex={actorIndex}
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

        {expanded && actor && !isEditSpec && <>
            <section>
                <h4>Specification</h4>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <td>Process</td>
                        <td>{spec.system}</td>
                    </tr>
                    <tr>
                        <td>Material</td>
                        <td>{spec.sub_system}</td>
                    </tr>
                    <tr>
                        <td>Size</td>
                        <td>{actor && bboxPretty(actor.bbox)}</td>
                    </tr>
                    <tr>
                        <td>Volume</td>
                        <td>{(actor.volume/(10*10*10)).toFixed()}cm3</td>
                    </tr>
                    </tbody>
                </table>
            </section>

        </>}

        {isEditSpec && <>
            <section>
                <Print3dForm initial={spec} trigger={handleSpec}></Print3dForm>
            </section>
        </>}

    </>
}








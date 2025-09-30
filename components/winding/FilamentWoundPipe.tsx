import {degToRad, lerp} from "three/src/math/MathUtils";
import React, {ReactElement, Ref, useContext, useEffect, useRef, useState} from 'react'
import {AnalysisFWPipe, SpecFWPipe, SpecFWPipeForm, } from "@api/api";
import {SpecFWPipeForm,systemOptions} from "./SpecFWPipeForm";
import {useSupabase} from "@hooks/SupabaseProvider";
import {SparPatternList} from "./SparPatternList"
import styles from './FilamentWoundPipe.module.css';
import {ALGO_ROTATIONAL_HELICAL_PATTERN} from "./Algo";
import {ThreeScene} from "./ThreeScene";
import {isSpecFWPipeSame} from "@api/api";
import * as THREE from 'three';
import {RerenderOnWidthChange} from "@components/ui/RerenderOnWidthChange";
import {useAccountsAndTenantAdmin} from "@hooks/AccountsProvider";
import {Coverage} from "./Coverage";


interface PatternPreviewProps {
    width: number;
    height: number;
    spec: SpecFWPipe;
    analysisPattern: AnalysisFWPipe;
    analysisPatternStl: string;
    render: (cb: () => void) => void;
    coverageLayers: any;
    coverageVisible: boolean;
    canvasRef: Ref<ReactElement>;
}

function PatternPreview({
                            width,
                            height,
                            spec,
                            analysisPattern,
                            analysisPatternStl,
                            coverageLayers,
                            render,
                            coverageVisible,
                            canvasRef
                        }: PatternPreviewProps) {
    const [camera, setCamera] = useState<THREE.Camera>();
    const [rotaryGroup, setRotaryGroup] = useState<THREE.Group>();
    const [bandGroup, setBandGroup] = useState<THREE.Group>();
    const [body, setBody] = useState();
    const [loadingBody, setLoadingBody] = useState<boolean>();
    const [scene, setScene] = useState();
    const [canvasFocused, setCanvasFocused] = useState(false);


    const [zoom, setZoom] = useState(0);  // 0 -> 1

    useEffect(() => {
        // renderer and canvasRef guaranteed to be non-null

        // Scene setup
        const scene = new THREE.Scene();
        // fov of 2 is almost orthographic
        // depth planes will be adjusted in fitCamera()
        const camera = new THREE.PerspectiveCamera(2, width / height, 0.1, 100);
        fitCamera(camera);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // White light, intensity of 1
        directionalLight.position.set(500, 0, 0); // Looks at origin by default
        scene.add(directionalLight);

        camera.layers.set(1);
        ambientLight.layers.set(1);
        directionalLight.layers.set(1);

        const rotaryGroup = new THREE.Group();
        scene.add(rotaryGroup);

        const bandGroup = new THREE.Group();
        scene.add(bandGroup);

        // const axesHelper = new THREE.AxesHelper(50);
        // axesHelper.layers.set(1);
        // scene.add(axesHelper);

        setCamera(camera);
        setScene(scene);
        setRotaryGroup(rotaryGroup);
        setBandGroup(bandGroup);
    }, []);

    const fitCamera = (camera: THREE.PerspectiveCamera) => {
        // Min / max distance determined by length and radius of pipe
        const margin = 1.1; // 10% margin

        // Fit the horizontal length into the horizontal frustum
        const aspect = width / height;
        const hFovRad = 2 * Math.atan(Math.tan(degToRad(camera.fov) / 2) * aspect);

        const maxDistance = (spec.length * margin) / (2 * Math.tan(hFovRad / 2));

        // Fit the radius into the vertical frustum
        const minDistance = (spec.inner_diameter * margin) / (2 * Math.tan(degToRad(camera.fov / 2)));

        const distance = lerp(maxDistance, minDistance, zoom)
        camera.position.set(distance, 0, spec.length / 2);
        camera.lookAt(new THREE.Vector3(0, 0, spec.length / 2));

        // Ensure depth planes always work.
        camera.near = minDistance / 10;
        camera.far = maxDistance * 10;

        camera.updateProjectionMatrix();
    }

    useEffect(() => {
        if (!camera) return;
        fitCamera(camera);
        animate();
    }, [zoom]);

    useEffect(() => {
        const canvas = canvasRef?.current;
        if (!canvas) return;

        if (!canvasFocused) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            handleZoom(event, event.deltaY < 0 ? 1 : -1);
        };

        const handleClick = (event) => {
            handleZoom(event, 1);
        };

        canvas.addEventListener('wheel', handleWheel, {passive: false});
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('click', handleClick);
        };
    }, [canvasFocused]);

    useEffect(() => {
        if (!canvasRef?.current) {
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

    const animate = () => {
        render(scene, camera);
    }

    const geomFunc = () => {
        return null;
    };

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

    const geom = {};

    let focusedPatternDetail;
    if (analysisPattern) {
        focusedPatternDetail = {
            winds: [{
                param: {
                    startWire: 1,
                },
                cycleCount: analysisPattern.cycleCount,
                cycleRotation: analysisPattern.cycleRotation,
            }],
            stls: [analysisPatternStl],
            layers: coverageLayers,
        };
    }
    return <>
        {camera &&
            <ThreeScene geom={geom} camera={camera} controls={null} rotaryGroup={rotaryGroup} setBody={setBody}
                        animate={animate}
                        coverageVisible={coverageVisible} scene={scene} focusedPatternDetail={focusedPatternDetail}
                        previewWindParam={-1} setLoadingBody={setLoadingBody}
                        geomFunc={geomFunc} bandGroup={bandGroup}
                        windIndex={0}
            />}
    </>;
}

const MemoizedPatternPreview = React.memo(PatternPreview);

interface FilamentWoundPipeComponentProps {
    spec_id: string;
    onSpecChange: (touched: boolean, spec: SpecFWPipe) => void;
    isEditSpec: boolean;
    isEditPattern: boolean;
    triggerEdit: () => void;
    triggerRemove: () => void;
    triggerManualPrice: () => void;
}

export function FilamentWoundPipeComponent({
                                               spec_id,
                                               onSpecChange,
                                               isEditSpec,
                                               isEditPattern,
                                               triggerEdit,
                                               triggerRemove,
                                               triggerManualPrice,
                                               readOnly
                                           }: FilamentWoundPipeComponentProps) {
    const {supabase, loading} = useSupabase();
    const [analysis, setAnalysis] = useState<AnalysisFWPipe>();
    const [focusedPattern, setFocusedPattern] = useState();
    const [spec, setSpec] = useState<SpecFWPipe>();
    const [expanded, setExpanded] = useState(false);
    const {isTenantAdmin} = useAccountsAndTenantAdmin();
    const [coverageVisible, setCoverageVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            let {data, error} = await supabase
                .from('SpecFWPipe')
                .select('*')
                .eq('id', spec_id)
                .single();
            const newSpec: SpecFWPipe = data;
            setSpec(newSpec);
            if (!isMounted) return;

            ({data, error} = await supabase
                .from('AnalysisFWPipe')
                .select('*')
                .eq('spec_id', newSpec.id)
                .single());
            if (!isMounted) return;
            const analysis: AnalysisFWPipe = data;
            setAnalysis(analysis);

            const cycle = analysis.cycles[0];
            const analysisPattern = cycle.patterns[cycle.selectedPatternIndex];
            setFocusedPattern(analysisPattern);
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [spec_id]);

    if (!analysis) {
        return;
    }

    // This is the pattern the analysis was computed against
    const cycle = analysis.cycles[0];
    const analysisPattern = cycle.patterns[cycle.selectedPatternIndex];
    const analysisPatternStl = cycle.patternStls[0];
    const coverageLayers = cycle.coverageLayers;

    const spr = {
        patterns: analysis.cycles[0].patterns,
    }

    function trigger(attr) {
        const param = analysisPattern.params[0];
        const newSpec = {
            ...spec,
            ...attr,
        };
        const equal = isSpecFWPipeSame(spec, newSpec);
        onSpecChange(!equal, newSpec);
    }

    function handleClickPattern(newFocusedPattern) {
        setFocusedPattern(newFocusedPattern);

        const param = newFocusedPattern.params[0];
        const attr = {
            selectedPattern: param.pattern,
            selectedPatternSkip: param.patternSkip,
        }
        trigger(attr);
    }

    function handleSpec(touched: boolean, newSpec: SpecFWPipe, newValid: boolean) {
        trigger(newSpec);
    }

    const systemOption = systemOptions.find((o) => o.system === spec.system);
    const layer = spec.layers[0];

    return <>
        <div className={styles.titleLine}>
            <div>Filament Wound CFRP Pipe</div>
            <div className={styles.revisionButtons} role="group">
                {!isEditSpec && <button className={styles.revisionButton} onClick={() => setExpanded(!expanded)}>
                    {expanded && 'Collapse' || 'Expand'}
                </button>}
                {!readOnly && !isEditSpec && <button className={styles.revisionButton} onClick={triggerEdit}>Edit...</button>}
                {!readOnly && !isEditSpec && <button className={styles.revisionButton} onClick={triggerRemove}>Remove</button>}
                {isTenantAdmin && !isEditSpec &&
                <button className={styles.adminButton} onClick={triggerManualPrice}>Manually Price</button>}
            </div>
        </div>

        {!isEditSpec && <>
            <div className={styles.subtitle}>{spec.quantity} unit{spec.quantity != 1 && 's'} • {spec.length}mm x {spec.inner_diameter}mm
                • {systemOption?.label || 'Custom'} •
                Pattern {analysisPattern.params[0].pattern} / {analysisPattern.params[0].patternSkip}</div>

            <RerenderOnWidthChange height={200} className={styles.canvas}>
                {(width, render, canvasRef) => (
                    // render() is stable, since created with useCallback.
                    // Memorizing this expensive component means that it is not re-rendered when the parent element
                    // changes. Only when the props change.
                    <MemoizedPatternPreview
                        width={width} height={200}
                        spec={spec} analysisPattern={analysisPattern} analysisPatternStl={analysisPatternStl}
                        coverageLayers={coverageLayers}
                        coverageVisible={coverageVisible}
                        render={render} canvasRef={canvasRef}/>
                )}
            </RerenderOnWidthChange>
        </>}

        {expanded && !isEditSpec && <>
            <section>
                <h4>Specification</h4>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Dimensions</th>
                    </tr>
                    <tr>
                        <td>Inner Diameter</td>
                        <td>{spec.inner_diameter}mm</td>
                    </tr>
                    <tr>
                        <td>Length</td>
                        <td>{spec.length}mm</td>
                    </tr>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Materials</th>
                    </tr>
                    <tr>
                        <td>System</td>
                        <td>{spec.system} {spec.custom_system}</td>
                    </tr>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Winding</th>
                    </tr>
                    <tr>
                        <td>Angle</td>
                        <td>{layer.angle}</td>
                    </tr>
                    <tr>
                        <td>Thickness</td>
                        <td>{layer.thickness}mm</td>
                    </tr>
                    <tr>
                        <td>Consolidation</td>
                        <td>{spec.consolidation}</td>
                    </tr>
                    <tr>
                        <td>Finish</td>
                        <td>{spec.finish}</td>
                    </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <Analysis analysis={analysis} spec={spec}/>
            </section>

            <section>
                <h4 className={styles.h4}>Manufacturing Plan</h4>
                <table className={styles.table}>
                    <tbody>
                    <tr>
                        <th colSpan="2" scope="rowgroup">Plan</th>
                    </tr>
                    <tr>
                        <td>Winding Pattern</td>
                        <td>{analysisPattern.params[0].pattern} / {analysisPattern.params[0].patternSkip}</td>
                    </tr>
                    <tr>
                        <td>Turn Around Length</td>
                        <td>40m</td>
                    </tr>
                    <tr>
                        <td>Fully Wound Length</td>
                        <td>{spec.length + 40 * 2}mm</td>
                    </tr>
                    <tr>
                        <td>Winding Tension</td>
                        {/*The optimal tension is  but we have found the towpreg can be effectively un-spooled at*/}
                        {/*a wide range of tensions starting at 4lbs/1.8kgs and going as high as 20lbs/9kgs. TCR Composites has*/}
                        {/*on-site technicians available to assist with optimization of the winding machine at your facility –*/}
                        {/*contact us for assistance.*/}
                        <td>4.5 kg</td>
                    </tr>
                    {/*<tr>*/}
                    {/*    <td>Cure Cycle</td>*/}
                    {/*    <td>CURE!!!</td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>

                <div>
                </div>
                {/*{JSON.stringify(analysisPattern)}*/}
            </section>

            <section>
                <h4 className={styles.h4}>Coverage</h4>
                <div className={styles.coverage}>
                    <Coverage layers={coverageLayers}/>

                        <RerenderOnWidthChange height={200}>
                            {(width, render) => (
                                // render() is stable, since created with useCallback.
                                // Memorizing this expensive component means that it is not re-rendered when the parent element
                                // changes. Only when the props change.
                                <MemoizedPatternPreview
                                    width={width} height={200}
                                    spec={spec} analysisPattern={analysisPattern}
                                    analysisPatternStl={analysisPatternStl}
                                    coverageLayers={coverageLayers}
                                    coverageVisible={true}
                                    render={render}/>
                            )}
                        </RerenderOnWidthChange>

                </div>
            </section>

            {/*<section>*/}
            {/*    <h4 className={styles.h4}>Mechanical Properties</h4>*/}
            {/*    <tr>*/}
            {/*        <th>Tensile Modulus</th>*/}
            {/*        <td>0.7</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <th>Buckling Modulus</th>*/}
            {/*        <td>0.7</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <th>Processability Strength</th>*/}
            {/*        <td>0.7</td>*/}
            {/*    </tr>*/}
            {/*</section>*/}
        </>}

        {isEditSpec && <>
            <section>
                <SpecFWPipeForm initial={spec} trigger={handleSpec}></SpecFWPipeForm>
            </section>
        </>}

        {isEditPattern && <section>
            <h4 className={styles.h4}>Winding Pattern</h4>

            <div className={styles.patternList}>
            <SparPatternList patternResponse={spr} algo={ALGO_ROTATIONAL_HELICAL_PATTERN}
                             onClickPattern={handleClickPattern}
                             focusedPattern={focusedPattern}/>
            </div>
        </section>}
    </>
}


// New Analysis component
export function Analysis({analysis, spec}: { analysis: AnalysisFWPipe, spec: SpecFWPipe }) {
    const od = spec.inner_diameter + spec.layers[0].thickness;
    return (
        <section>
            <h4 className={styles.h4}>Dimensions</h4>

            <div className={styles.drawings}>
                <PipeCrossSection outerDiameter={od} innerDiameter={spec.inner_diameter}/>
                <PipeSideView outerDiameter={od} innerDiameter={spec.inner_diameter} length={spec.length}
                              viewWidth={500}/>
            </div>

            <h4 className={styles.h4}>Estimated Properties</h4>

            <table className={styles.table}>
                <tbody>
                <tr>
                    <th>Estimated Weight</th>
                    <td>{analysis.weight_kg.toFixed(3)} kg</td>
                </tr>
                {/*<tr>*/}
                {/*    <th>Volume</th>*/}
                {/*    <td>{analysis.volume_m3} m3</td>*/}
                {/*</tr>*/}
                <tr>
                    <th>Density</th>
                    <td>{(analysis.weight_kg / analysis.volume_m3).toFixed(2)} kg/m3</td>
                </tr>

                </tbody>
            </table>
        </section>
    );
}


export type PipeCrossSectionProps = {
    outerDiameter: number;
    innerDiameter: number;
    /** Width of the SVG viewport in pixels */
    viewWidth?: number;
    /** Height of the SVG viewport in pixels */
    viewHeight?: number;
};

/**
 * Dimension line component
 * Draws a horizontal dimension with tangent ticks and text.
 * Text size is fixed in pixels relative to viewport.
 */
type DimensionProps = {
    x1: number;
    x2: number;
    y: number;
    text: string;
    scale: number;
};

function HDimension({x1, x2, y, text}: DimensionProps) {
    return (
        <g>
            {/* Dimension line */}
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="black" strokeWidth={1}/>
            {/* Tangent ticks */}
            <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke="black" strokeWidth={1}/>
            <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke="black" strokeWidth={1}/>
            {/* Label with fixed pixel font size */}
            <text x={(x1 + x2) / 2} y={y + 16} textAnchor="middle" fill="black" fontSize={14}>
                {text}
            </text>
        </g>
    );
}

function VDimension({y1, y2, x, text}: DimensionProps) {
    return (
        <g>
            {/* Dimension line */}
            <line x1={x} y1={y1} x2={x} y2={y2} stroke="black" strokeWidth={1}/>
            {/* Tangent ticks */}
            <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke="black" strokeWidth={1}/>
            <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke="black" strokeWidth={1}/>
            {/* Label with fixed pixel font size, centered */}
            <text x={x + 5} y={(y1 + y2) / 2} textAnchor="left" fill="black" fontSize={14} dominantBaseline="middle">
                {text}
            </text>
        </g>
    );
}

export function PipeCrossSection({
                                     outerDiameter,
                                     innerDiameter,
                                     viewWidth = 200,
                                     viewHeight = 200
                                 }: PipeCrossSectionProps) {

    const paddingTop = 4;
    const paddingBottom = 30;

    const innerHeight = viewHeight - paddingTop - paddingBottom;
    const scale = (innerHeight) / outerDiameter;

    // Center coordinates
    const cx = viewWidth / 2;
    const cy = innerHeight / 2 + paddingTop;

    return (
        <svg width={viewWidth} height={viewHeight} xmlns="http://www.w3.org/2000/svg">
            {/* Pipe geometry */}
            <circle cx={cx} cy={cy} r={(outerDiameter / 2) * scale} fill="none" stroke="black" strokeWidth={1}/>
            <circle cx={cx} cy={cy} r={(innerDiameter / 2) * scale} fill="none" stroke="black" strokeWidth={1}/>

            {/* Dimensions */}
            <HDimension x1={cx - (outerDiameter / 2) * scale} x2={cx + (outerDiameter / 2) * scale}
                        y={cy + (outerDiameter / 2) * scale + 10} text={`⌀${outerDiameter} mm`} scale={scale}/>
            <HDimension x1={cx - (innerDiameter / 2) * scale} x2={cx + (innerDiameter / 2) * scale} y={cy}
                        text={`⌀${innerDiameter} mm`} scale={scale}/>
        </svg>
    );
}


export function PipeSideView({
                                 outerDiameter,
                                 innerDiameter,
                                 length,
                                 viewWidth = 200,
                                 viewHeight = 200
                             }: PipeSideViewProps) {

    const paddingTop = 4;
    const paddingBottom = 30;

    const innerHeight = viewHeight - paddingTop - paddingBottom;
    const scale = (innerHeight) / outerDiameter;

    // Center coordinates
    const x1 = 15;
    const x2 = viewWidth - 60;

    const cx = viewWidth / 2;
    const cy = innerHeight / 2 + paddingTop;

    const pipeHeight = outerDiameter * scale;
    const outerTop = cy - pipeHeight / 2;
    const outerBottom = cy + pipeHeight / 2;

    const boreHeight = innerDiameter * scale;
    const boreTop = cy - boreHeight / 2;
    const boreBottom = cy + boreHeight / 2;

    return (
        <svg width={viewWidth} height={viewHeight} xmlns="http://www.w3.org/2000/svg">
            {/* Pipe outer rectangle */}
            <rect x={x1} y={outerTop} width={x2 - x1} height={pipeHeight}
                  fill="none" stroke="black" strokeWidth={1}/>
            <rect x={x1} y={boreTop} width={x2 - x1} height={boreHeight}
                  fill="none" stroke="black" strokeWidth={1}/>
            {/* Pipe inner rectangle (bore) */}
            {/*<rect x={cx - (innerDiameter / 2) * scale} y={innerTop} width={innerDiameter * scale}*/}
            {/*      height={innerBottom - innerTop} fill="none" stroke="black" strokeWidth={0.5}/>*/}

            {/* Dimensions */}
            <HDimension x1={x1} x2={x2} y={outerBottom + 10}
                        text={`${length} mm`}/>
            <VDimension x={x2 + 10} y1={outerTop} y2={outerBottom}
                        text={`⌀${outerDiameter}mm`}/>
            <VDimension x={5} y1={boreTop} y2={boreBottom}
                        text={`\u00A0\u00A0\u00A0⌀${innerDiameter}mm`}/>
        </svg>
    );
}

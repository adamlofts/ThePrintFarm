import React, {ReactElement, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {RendererContext} from "@hooks/RendererProvider";
import * as THREE from "three";

type RerenderOnWidthChangeProps = {
    children: (
        width: number,
        render: (scene: THREE.Scene, camera: THREE.Camera) => void,
        canvasRef: React.Ref<ReactElement>
    ) => React.ReactNode;
    height: number;
    className: string;
    containerStyle?: React.CSSProperties;
};

export function RerenderOnWidthChange({children, height, className, containerStyle}: RerenderOnWidthChangeProps) {
    const {renderer, offscreen} = useContext(RendererContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const [width, setWidth] = useState<number>(0);
    const resizeTimeout = useRef<number>(0);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const updateWidth = () => {
            const newWidth = Math.floor(node.getBoundingClientRect().width - 2);  // border
            setWidth(newWidth);
        }

        const queueUpdate = () => {
            // updateWidth();
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
            resizeTimeout.current = window.setTimeout(updateWidth, 25);
        };

        const observer = new ResizeObserver(queueUpdate);
        observer.observe(node);

        // Immediately measure on mount
        updateWidth();

        return () => observer.disconnect();
    }, []);

    const queueRender = useCallback(
        (scene, camera) => {
        // Store the last seen scene and camera.
        sceneRef.current = scene;
        cameraRef.current = camera;

        if (rafId.current !== null) {
            return;
        }

        rafId.current = requestAnimationFrame(() => {
            rafId.current = null;
            if (canvasRef.current === null) {
                // canvas disposed by the time we got here.
                return;
            }
            const widthNow = Math.floor(canvasRef.current.getBoundingClientRect().width);
            internalRender(offscreen, canvasRef.current, renderer, widthNow, height, sceneRef.current, cameraRef.current);
        });
    }, [renderer, width, height]);


    // Ensure if this component re-mounts that rafId is reset.
    useEffect(() => {
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
        }
        rafId.current = null;

        return () => {
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
            rafId.current = null;
        };
    }, []);

    return (
        <div ref={containerRef} style={containerStyle}>
            <React.Fragment key={width}>
                {width > 0 ? children(width, queueRender, canvasRef) : null}
            </React.Fragment>
            <canvas
                className={className}
                ref={canvasRef} width={width} height={height}
                tabIndex={0} // Makes it focusable
            />
        </div>
    );
}


// This function runs outside the react lifecycle and MUST NOT capture any state
const internalRender = (offscreen, canvas, renderer, width, height, scene, camera) => {
    renderer.setClearColor(0x000000, 0);
    renderer.clear();

    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.setScissorTest(true);

    renderer.render(scene, camera);

    // Draw pixels to visible canvas.
    // Canvas and WebGL chose top left and bottom left as 2D origin, so we copy the bottom left, and flip as we copy.
    // The flip is mirroring the geometry, so important to keep the handedness.
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // ctx.scale(1, -1);           // flip vertically

    const sx = 0;
    const sy = 1024 - height;
    ctx.drawImage(
        offscreen, sx, sy, width, height,
        0, 0, width, height
    );
    ctx.restore();
};

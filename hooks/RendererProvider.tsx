import React, {createContext, useRef, useEffect, useState} from 'react';
import * as THREE from 'three';

type RendererProviderValue = {
    renderer: THREE.WebGLRenderer;
    offscreen: any;
}

export const RendererContext = createContext<RendererProviderValue>(null);

export function RendererProvider({ children }: { children: React.ReactNode }) {
    const ref = useRef<RendererProviderValue | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const offscreen = document.createElement('canvas');
        // document.body.append(offscreen)
        const renderer = new THREE.WebGLRenderer({ canvas: offscreen });
        renderer.setSize(1024, 1024); // default, resize as needed
        ref.current = {renderer, offscreen};

        setReady(true);
    }, []);

    if (!ready) return null; // or a loading placeholder

    return (
        <RendererContext.Provider value={ref.current}>
            {children}
        </RendererContext.Provider>
    );
}

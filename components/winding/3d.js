import * as THREE from 'three';
import {STLLoader} from 'three/addons/loaders/STLLoader.js';
import {base64} from "rfc4648";


export function createBandMaterial(color) {
    const materialHelical = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.5,
        depthTest: false
    });
    const beforeCompile = (shader) => {
        shader.vertexShader = `
            attribute float instance;
            varying float vInstance;
            ${shader.vertexShader}
        `;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',
            `
            vInstance = instance;
            #include <uv_vertex>
            `
        );
        shader.uniforms.pointIndex = {value: 0};
        shader.uniforms.instanceIndex = {value: 10000};
        shader.fragmentShader = `
            uniform int pointIndex;
            uniform int instanceIndex;
            varying float vInstance;
            ${shader.fragmentShader}
        `;

        // Replace the main color calculation with our logic
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',  // Insert our logic at the right place
            `
            vec3 finalColor = diffuseColor.rgb;  // Default color handling by MeshStandardMaterial
            float borderWidth = 0.08;
            
            // Drawing an instance beyond the selected instance
            if (vInstance > float(instanceIndex) + 0.1) {
                 discard;
            }
            
            // Drawing a point beyond the point index on the selected instance
            if ((abs(vInstance - float(instanceIndex)) < 0.1) && vUv.y > float(pointIndex)) {
                discard;
            }
            
            const vec3 BORDER_COLOR = vec3(0.68);

            if (vUv.x < borderWidth) {
                finalColor = BORDER_COLOR;
            } else if (vUv.x > (1. - borderWidth)) {
                finalColor = BORDER_COLOR;
            }
         
            // Continue with the rest of the shader logic (lighting, shadows, etc.)
            gl_FragColor = vec4(finalColor, diffuseColor.a);
    
            #include <dithering_fragment>
            `
        );

        materialHelical.userData.shader = shader;
    };

    materialHelical.defines.USE_UV = true;
    materialHelical.onBeforeCompile = beforeCompile;

    return materialHelical;
}

export function parseBand(data, material, count, startInstance, theta) {
    const buffer2 = base64.parse(data);
    const loader2 = new STLLoader();
    const geometry2 = loader2.parse(buffer2.buffer);


    const vertexCount = geometry2.getAttribute('position').count;
    const triCount = vertexCount / 3;
    const uvs = new Float32Array(vertexCount * 2);
    for (let i = 0; i < triCount / 2; i++) {
        uvs[i * 12] = 0;  // u
        uvs[i * 12 + 1] = i;  // v
        uvs[i * 12 + 2] = 1;
        uvs[i * 12 + 3] = i;
        uvs[i * 12 + 4] = 1;
        uvs[i * 12 + 5] = i + 1;

        uvs[i * 12 + 6] = 0;  // u
        uvs[i * 12 + 7] = i + 1;  // v
        uvs[i * 12 + 8] = 1;
        uvs[i * 12 + 9] = i;
        uvs[i * 12 + 10] = 0;
        uvs[i * 12 + 11] = i + 1;
    }
    geometry2.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const arr = new Float32Array(vertexCount * count);
    for (let i = 0; i < count; i++) {
        arr[i] = i + startInstance;
    }
    geometry2.setAttribute('instance', new THREE.InstancedBufferAttribute(arr, 1, false, 1));  // .setUsage(THREE.DynamicDrawUsage)

    // const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const mesh2 = new THREE.InstancedMesh(geometry2, material, count);
    mesh2.layers.set(1);

    //
    for (let i = 0; i < count; i++) {
        // const trsf = THREE.Euler(body.helicalEndAngle - body.helicalStartAngle + Math.PI, 0, 0, 'XYZ');
        const matrix = new THREE.Matrix4();
        matrix.makeRotationAxis(new THREE.Vector3(0, 0, 1), theta * i);
        mesh2.setMatrixAt(i, matrix);
    }

    return mesh2;
}

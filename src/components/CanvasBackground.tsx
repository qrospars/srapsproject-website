
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type CanvasBackgroundProps = {
    scroll: number
}

const COLORS = [
    '#cde3dd', '#d3d7e0', '#d7d6e0', '#d8e3db',
    '#d5d4e2', '#c5cfe5', '#b9c5e5', '#b0c8e8',
    '#bfd4e7'
];
const NUMBER_OF_SPHERES = 10;
const SPHERE_MAX_RADIUS = 5;
const SPHERE_MIN_RADIUS = 3;
const SPHERE_WIDTH_SEGMENTS = 32;
const SPHERE_HEIGHT_SEGMENTS = 32;
const MOUSE_MOVEMENT_FACTOR = 1;
const IS_RANDOM_SPHERES = false;
const OPACITY = 0.6;
const SPHERE_DEFORMATION = 1.3;
const DIRECTIONS = {
    "x": 1000,
    "y": 1000,
    "z": 1000,
}

// Function for linear interpolation (lerp) between two values
const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
};

const updateVertexPositions = (
    meshes: THREE.Mesh[],
    originalPositions: Float32Array[],
    directionsModification: { x: number; y: number; z: number },
    scrollPercentage: number,
) => {
    const deformationScale = scrollPercentage / 100;

    meshes.forEach((e, meshIndex) => {
        const positionAttribute = e.geometry.getAttribute('position');
        const positions = positionAttribute.array as Float32Array;

        originalPositions[meshIndex].forEach((_, vertexIndex) => {
            if (vertexIndex % 10 !== 0) return;

            const xOriginal = originalPositions[meshIndex][vertexIndex * 3];
            const yOriginal = originalPositions[meshIndex][vertexIndex * 3 + 1];
            const zOriginal = originalPositions[meshIndex][vertexIndex * 3 + 2];

            const xDeformed = xOriginal * SPHERE_DEFORMATION;
            const yDeformed = yOriginal * SPHERE_DEFORMATION;
            const zDeformed = zOriginal * SPHERE_DEFORMATION;

            const x = lerp(xOriginal, xDeformed, deformationScale);
            const y = lerp(yOriginal, yDeformed, deformationScale);
            const z = lerp(zOriginal, zDeformed, deformationScale);

            positions[vertexIndex * 3] = x;
            positions[vertexIndex * 3 + 1] = y;
            positions[vertexIndex * 3 + 2] = z;
        });

        positionAttribute.needsUpdate = true;
    });
};






const animateCameraAndRenderer = (
    camera: THREE.PerspectiveCamera,
    target: THREE.Vector3,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene
): number => {
    const lerp = (start: number, end: number, factor: number) => (1 - factor) * start + factor * end;
    const animate = () => {
        requestAnimationFrame(animate);

        camera.position.x = lerp(camera.position.x, target.x, 0.05);
        camera.position.y = lerp(camera.position.y, target.y, 0.05);
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    return requestAnimationFrame(animate); // Return the animation ID provided by requestAnimationFrame
};


const createSpheres = (
    sceneRef: React.MutableRefObject<THREE.Scene>,
    meshRefs: React.MutableRefObject<
        THREE.Mesh<
            THREE.BufferGeometry<THREE.NormalBufferAttributes>,
            THREE.Material | THREE.Material[],
            THREE.Object3DEventMap
        >[]
    >,
    originalPositionsRef: React.MutableRefObject<Float32Array[]>,
    spheres: { color: any; radius: any; position: any; }[]
) => {

    // Create spheres and add them to the scene
    for (let i = 0; i < NUMBER_OF_SPHERES; i++) {
        const { color, radius, position } = IS_RANDOM_SPHERES ? {
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            radius: Math.random() * SPHERE_MAX_RADIUS - SPHERE_MIN_RADIUS,
            position: {
                x: Math.random() * 8 - 3,
                y: Math.random() * 8 - 3,
                z: Math.random() * 8 - 1,
            },
        } : spheres[i];

        const geometry = new THREE.SphereGeometry(radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        const material = new THREE.MeshBasicMaterial({
            color,
            opacity: OPACITY,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(position.x, position.y, position.z);
        sceneRef.current.add(mesh);
        meshRefs.current.push(mesh);
        spheres.push({ color, radius, position });
        const positionAttribute = geometry.getAttribute('position');
        originalPositionsRef.current.push(new Float32Array(positionAttribute.array));
    }
};

const CanvasBackground: React.FC<CanvasBackgroundProps> = (props) => {
    const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
    const cameraRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    if (!rendererRef.current) {
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    }
    const mouseTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

    const meshRefs = useRef<THREE.Mesh[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);
    const originalPositionsRef = useRef<Float32Array[]>([]);





    let spheres = IS_RANDOM_SPHERES ? [] : initialSpheresPositions


    useEffect(function trackMouseMove() {
        const handleMouseMove = (event: MouseEvent) => {
            const xOffset = (event.clientX / window.innerWidth - 0.5) * MOUSE_MOVEMENT_FACTOR;
            const yOffset = (event.clientY / window.innerHeight - 0.5) * MOUSE_MOVEMENT_FACTOR;

            mouseTarget.current.set(xOffset, yOffset, cameraRef.current.position.z);
        };


        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(function initializeSpheres() {
        // Early exits
        if (!rendererRef.current || !canvasRef.current || !cameraRef.current) return;

        const { current: renderer } = rendererRef;
        const { current: canvas } = canvasRef;
        const { current: camera } = cameraRef;
        const { current: scene } = sceneRef;
        const currentMeshRefs = meshRefs.current;

        // Initialize renderer and canvas
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!canvas.firstChild) {
            canvas.appendChild(renderer.domElement);
        }

        // Initialize camera
        camera.position.z = 10;

        // Create spheres
        createSpheres(sceneRef, meshRefs, originalPositionsRef, spheres);

        // Cleanup function
        return () => {
            // Dispose resources
            currentMeshRefs.forEach((mesh) => {
                scene.remove(mesh);

                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material) => material.dispose());
                } else {
                    mesh.material.dispose();
                }

                mesh.geometry.dispose();
            });

            // Remove renderer from canvas and dispose
            if (renderer) {
                canvas.removeChild(renderer.domElement);
                renderer.dispose();
            }
        };
    }, [spheres]);


    useEffect(function AnimateCameraAndRender() {
        if (!rendererRef.current) return
        const animationId = animateCameraAndRenderer(
            cameraRef.current,
            mouseTarget.current,
            rendererRef.current,
            sceneRef.current
        );

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    useEffect(function changeSceneOnScroll() {
        updateVertexPositions(meshRefs.current, originalPositionsRef.current, DIRECTIONS, props.scroll);
    }, [props.scroll]);

    return <div ref={canvasRef} className="canvas-container" />;
};

export default CanvasBackground;

const initialSpheresPositions = [
    {
        "color": "#dca7c5",
        "radius": -1.558139099614932,
        "position": {
            "x": 2.406676327378335,
            "y": -0.35879211379115894,
            "z": -0.5369358385405985
        }
    },
    {
        "color": "#d8e3db",
        "radius": 1.828724011665412,
        "position": {
            "x": 4.340179556140681,
            "y": -0.9586366869222331,
            "z": 1.0405974797458697
        }
    },
    {
        "color": "#c5cfe5",
        "radius": -2.7616386897343643,
        "position": {
            "x": 3.655459240846838,
            "y": 4.452693246136281,
            "z": 3.299115848141197
        }
    },
    {
        "color": "#d7d6e0",
        "radius": -1.1941547379058055,
        "position": {
            "x": -0.8311710462777562,
            "y": -2.098540231078685,
            "z": 1.3371916542184383
        }
    },
    {
        "color": "#d5d4e2",
        "radius": -1.8791847429338844,
        "position": {
            "x": 1.5122292402599449,
            "y": 2.4274405406335546,
            "z": 5.105063433133774
        }
    },
    {
        "color": "hsl(15, 100%, 93%)",
        "radius": -2.517113601011349,
        "position": {
            "x": -0.4959892564798576,
            "y": -2.264806605461562,
            "z": 6.440248167852582
        }
    },
    {
        "color": "#c5cfe5",
        "radius": 1.2820862663151216,
        "position": {
            "x": -2.316520647175347,
            "y": -0.7035846446026142,
            "z": 3.3861730730935715
        }
    },
    {
        "color": "#7260f2",
        "radius": -2.343146815336251,
        "position": {
            "x": -1.8321979346661319,
            "y": .6512116066071627,
            "z": 1.8509726922980079
        }
    },
    {
        "color": "#d8e3db",
        "radius": -0.485871467888916,
        "position": {
            "x": 0.3050039866306502,
            "y": -1.0736931294595582,
            "z": 2.7387610814347187
        }
    },
    {
        "color": "#cde3dd",
        "radius": 0.6498044688665354,
        "position": {
            "x": -2.6848091538521928,
            "y": -2.171940177650372,
            "z": 2.590910324852798
        }
    }
]
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CanvasBackground: React.FC = () => {
    const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
    const cameraRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    const rendererRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true, alpha: true })
    );
    const mouseTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const meshRefs = useRef<THREE.Mesh[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

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
    const MOUSE_MOVEMENT_FACTOR = 0.5;
    const IS_RANDOM_SPHERES = false;
    const OPACITY = 0.5;

    let spheres = IS_RANDOM_SPHERES ? [] :
        [
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


    useEffect(() => {
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

    useEffect(() => {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        if (canvasRef.current) {
            canvasRef.current.appendChild(rendererRef.current.domElement);
        }

        cameraRef.current.position.z = 10;

        // Create spheres and add them to the scene
        for (let i = 0; i < NUMBER_OF_SPHERES; i++) {
            let color = IS_RANDOM_SPHERES ? COLORS[Math.floor(Math.random() * COLORS.length)] : spheres[i].color;
            const radius = IS_RANDOM_SPHERES ? Math.random() * SPHERE_MAX_RADIUS - SPHERE_MIN_RADIUS : spheres[i].radius;
            const geometry = new THREE.SphereGeometry(radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
            const material = new THREE.MeshBasicMaterial({
                color,
                opacity: OPACITY,
                transparent: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            let position = {
                x: IS_RANDOM_SPHERES ? Math.random() * 8 - 3 : spheres[i].position.x,
                y: IS_RANDOM_SPHERES ? Math.random() * 8 - 3 : spheres[i].position.y,
                z: IS_RANDOM_SPHERES ? Math.random() * 8 - 1 : spheres[i].position.z
            }
            mesh.position.set(position.x, position.y, position.z);
            sceneRef.current.add(mesh);
            meshRefs.current.push(mesh);
            spheres.push({
                color,
                radius,
                position
            });
        }
        console.log(spheres)

        const lerp = (start: number, end: number, factor: number) => (1 - factor) * start + factor * end;

        const animate = () => {
            requestAnimationFrame(animate);

            cameraRef.current.position.x = lerp(cameraRef.current.position.x, mouseTarget.current.x, 0.05);
            cameraRef.current.position.y = lerp(cameraRef.current.position.y, mouseTarget.current.y, 0.05);
            cameraRef.current.lookAt(sceneRef.current.position);

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();

        return () => {
            // Clean up resources
            for (let mesh of meshRefs.current) {
                sceneRef.current.remove(mesh);

                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material) => {
                        material.dispose();
                    });
                } else {
                    mesh.material.dispose();
                }

                mesh.geometry.dispose();
            }

            if (canvasRef.current) {
                canvasRef.current.removeChild(rendererRef.current.domElement);
            }

            rendererRef.current.dispose();
        };
    }, []);

    return <div ref={canvasRef} className="canvas-container" />;
};

export default CanvasBackground;

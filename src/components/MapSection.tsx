import React, { useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import { AmbientLight, DirectionalLight, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

interface City {
    name: string,
    lat: number,
    lng: number
}
const cities: City[] = [
    { name: 'Lausanne', lat: 46.5196, lng: 6.6323 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Barcelone', lat: 41.3851, lng: 2.1734 },
    { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
];

function latLngToXYZ(lat: number, lng: number, radius = 100) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [x, y, z];
}

const MapSection = React.memo(() => {
    const globeContainerRef = useRef<HTMLDivElement>(null);
    const [popoverData, setPopoverData] = useState<City | null>(null);
    const [focusedCity, setFocusedCity] = useState<string | null>(null);


    useEffect(function setupGlobeAndRaycaster() {
        if (!globeContainerRef.current) return;

        const globe = new ThreeGlobe()
            .globeImageUrl('src/assets/images/8081_earthbump4k.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .pointsData(cities)
            .pointLat('lat')
            .pointLng('lng')
            .pointRadius(0.05)
            .htmlElementsData(cities)
            .htmlElement(createLabelElement)
            .htmlAltitude(0.1);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.className = 'css2d-label-container';

        const renderer = new WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        globeContainerRef.current.appendChild(renderer.domElement);
        globeContainerRef.current.appendChild(labelRenderer.domElement);



        const scene = new Scene();
        scene.add(globe);
        scene.add(new AmbientLight(0xcccccc, Math.PI));
        scene.add(new DirectionalLight(0xffffff, 0.6 * Math.PI));

        const camera = new PerspectiveCamera();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position.x = -13;
        camera.position.y = 143;
        camera.position.z = 246;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.target.set(0, 0, 0);
        controls.update();

        function animate() {
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        });

        let animationFrameId: number | null = null;

        function zoomToCity(camera: PerspectiveCamera, controls: OrbitControls, name: string, endX: number, endY: number, endZ: number) {
            // Disable controls while animating
            controls.enabled = false;
            // Cancel any ongoing animations
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            const duration = 1000; // 5 seconds
            const startTime = performance.now();
            const startX = camera.position.x;
            const startY = camera.position.y;
            const startZ = camera.position.z;

            const animate = () => {


                const now = performance.now();
                const timeElapsed = now - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                camera.position.x = startX + progress * (endX - startX);
                camera.position.y = startY + progress * (endY - startY);
                camera.position.z = startZ + progress * (endZ - startZ);

                if (progress === 1) {
                    // controls.target.set(endX, endY, endZ);
                    controls.update();

                    // Re-enable controls after animation
                    controls.enabled = true;
                }

                controls.update();

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            animate();
        }


        let initialCameraPosition: { x: any; y: any; z: any; } | null = null;
        let initialTarget: { x: number; y: number; z: number; } | null = null;

        function handleLabelClick(city: City) {
            if (!initialCameraPosition || !initialTarget) {
                initialCameraPosition = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                };
                initialTarget = {
                    x: controls.target.x,
                    y: controls.target.y,
                    z: controls.target.z
                };
            }

            const targetPositions: Record<string, { x: number, y: number, z: number }> = {
                "Copenhagen": { x: 5.132986211936718, y: 113.30603164927582, z: 80.19502573568701 },
                "Paris": {
                    "x": -3.642802797915665,
                    "y": 95.10279386299032,
                    "z": 91.41493346808993
                },
                "Barcelone": {
                    "x": -2.1745376643235574,
                    "y": 88.90653553037562,
                    "z": 106.70869615096315
                },
                "Lausanne": {
                    "x": 19.666080900324445,
                    "y": 103.17727378086835,
                    "z": 90.90402601356948
                }
            };

            // If we're already focused on the city, go back to the initial position
            if (focusedCity === city.name) {
                console.log("go back to initial")
                zoomToCity(camera, controls, "Initial", initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
                setFocusedCity(null);
            } else {
                zoomToCity(camera, controls, city.name, targetPositions[city.name].x, targetPositions[city.name].y, targetPositions[city.name].z);
                setFocusedCity(city.name);
            }

            setPopoverData(city);
        }

        function createLabelElement(d: any): HTMLElement {
            const el = document.createElement('div');
            el.innerHTML = d.name;
            el.className = 'cityLabel'
            el.style.width = `300px`;
            el.addEventListener('click', () => handleLabelClick(d));

            return el;
        }

        return () => {
            if (!globeContainerRef.current) return;

            // Remove specific children
            globeContainerRef.current.removeChild(renderer.domElement);
            globeContainerRef.current.removeChild(labelRenderer.domElement);

            renderer.dispose();
        };
    }, []);

    return <div className='welcome__map__globe'>
        <div ref={globeContainerRef} style={{ width: '100%', height: '100vh' }}></div>
        {popoverData && (
            <div className="popover-panel">
                This is a test
            </div>
        )}
    </div>;
});

export default MapSection;
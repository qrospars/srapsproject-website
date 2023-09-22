import React, { useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import { MeshBasicMaterial, AmbientLight, Camera, DirectionalLight, Object3D, Object3DEventMap, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
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

const initialCameraPosition = {
    x: -8,
    y: 113,
    z: 103
}

const globeMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 1
});

const MapSection = React.memo(() => {

    const globeContainerRef = useRef<HTMLDivElement>(null);
    const [popoverData, setPopoverData] = useState<City | null>(null);
    const [focusedCity, setFocusedCity] = useState<string | null>(null);
    const [globeExists, setGlobeExists] = useState<ThreeGlobe | null>(null);

    const [scene, setScene] = useState<Scene | null>(null);
    const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
    const [controls, setControls] = useState<OrbitControls | null>(null);
    const [citiesLabelsAdded, setCitiesLabelsAdded] = useState<boolean>(false);

    const handleLabelClickRef = useRef<((city: City) => void) | null>(null);
    const [geojsonData, setGeojsonData] = useState<any>(null);

    useEffect(function fetchGeoJSON() {
        fetch('../src/assets/countries.geojson')
            .then(response => {
                return response.json();
            })
            .then((data) => {
                const globe = new ThreeGlobe()
                    .showGlobe(false)
                    .showAtmosphere(false)
                    // .globeImageUrl('/8081_earthmap10k_grey_nosea.png')
                    .polygonsData(data.features
                        .filter((d: { properties: { ISO_A2: string; }; }) => d.properties.ISO_A2 !== 'AQ')
                    )
                    .polygonCapColor(() => 'rgba(22, 22, 22, 0.7)')
                    .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
                    // .polygonStrokeColor(() => 'white')
                    // .bumpImageUrl('src/assets/images/8081_earthbump10k.jpg')
                    .globeMaterial(globeMaterial)
                    .pointsData(cities)
                    .pointLat('lat')
                    .pointLng('lng')
                    .pointColor(() => '#9490f5')
                    .pointRadius(0.05)

                setGlobeExists(globe);
                // setGeojsonData(data)
            })
            .catch((error) => console.error("Fetch error: ", error));
    }, []);

    useEffect(function setupScene() {
        if (!globeContainerRef.current) return;



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
        scene.add(new AmbientLight(0xcccccc, Math.PI));
        scene.add(new DirectionalLight(0xffffff, 0.6 * Math.PI));
        setScene(scene);

        const camera = new PerspectiveCamera();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position
        camera.position.x = initialCameraPosition.x;
        camera.position.y = initialCameraPosition.y;
        camera.position.z = initialCameraPosition.z;
        setCamera(camera);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.target.set(0, 0, 0);
        controls.update();
        setControls(controls);

        function animate() {
            if (!scene || !camera) return;
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        function handleResize() {
            if (!scene || !camera) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', handleResize);



        return () => {
            if (!globeContainerRef.current) return;
            window.removeEventListener('resize', handleResize);
            globeContainerRef.current.removeChild(renderer.domElement);
            globeContainerRef.current.removeChild(labelRenderer.domElement);

            renderer.dispose();
        };
    }, []);

    useEffect(function setupGlobeAndInteractions() {
        if (!scene || !camera || !controls || !globeExists) return;

        if (!citiesLabelsAdded) {
            scene.add(globeExists);
            globeExists.htmlElementsData(cities)
                .htmlElement(createLabelElement)
                .htmlAltitude(0.1);
            setCitiesLabelsAdded(true);
        }



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

        handleLabelClickRef.current = (city) => {
            if (!scene || !camera || !controls) return;


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
                zoomToCity(camera, controls, "Initial", initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
                setFocusedCity(null);
            } else {
                setFocusedCity(city.name);
                zoomToCity(camera, controls, city.name, targetPositions[city.name].x, targetPositions[city.name].y, targetPositions[city.name].z);
            }

            setPopoverData(city);
        }

        function createLabelElement(d: any): HTMLElement {
            const el = document.createElement('div');
            el.innerHTML = d.name;
            el.className = 'cityLabel'
            el.addEventListener('click', () => handleLabelClickRef.current && handleLabelClickRef.current(d));

            return el;
        }

    }, [camera, controls, scene, focusedCity, globeExists]);


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
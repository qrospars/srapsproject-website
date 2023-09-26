import React, { useEffect, useRef, useState } from "react";
import { AmbientLight, DirectionalLight, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import ThreeGlobe from "three-globe";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { hasParentWithClass } from "../utils/domManipulation";

interface GlobeProps {
    setPopoverData: React.Dispatch<React.SetStateAction<City | null>>,
    zoomDuration: 1000,
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
};

const initialMobileCameraPosition = {
    "x": 11.426280552579858,
    "y": 123.75814139580451,
    "z": 116.78509913376928
};

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

const targetMobilePositions: Record<string, { x: number, y: number, z: number }> = {
    "Copenhagen": {
        "x": 14.181041281054679,
        "y": 96.83131134494216,
        "z": 67.87352578439112
    },
    "Paris": {
        "x": 2.0038330145906973,
        "y": 88.75810258284172,
        "z": 79.38642308445375
    },
    "Barcelone": {
        "x": 2.8176248319158113,
        "y": 81.54373173028522,
        "z": 86.757714912314
    },
    "Lausanne": {
        "x": 11.249992295513248,
        "y": 84.0194294841801,
        "z": 83.65640103126772
    }
};

const globeMaterial = new MeshBasicMaterial({
    transparent: true,
    opacity: 1
});

const Globe = React.memo<GlobeProps>((props) => {
    const globeContainerRef = useRef<HTMLDivElement>(null);
    const [focusedCity, setFocusedCity] = useState<string | null>(null);
    const [globeExists, setGlobeExists] = useState<ThreeGlobe | null>(null);

    const [scene, setScene] = useState<Scene | null>(null);
    const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
    const [controls, setControls] = useState<OrbitControls | null>(null);
    const [citiesLabelsAdded, setCitiesLabelsAdded] = useState<boolean>(false);

    const handleLabelClickRef = useRef<((city: City) => void) | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(function calculateIfMobile() {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(function fetchGeoJSON() {
        fetch('../src/assets/data/countries.geojson')
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
                    .polygonCapColor(() => 'rgba(22, 22, 22, 0.8)')
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
        camera.position.x = isMobile ? initialMobileCameraPosition.x : initialCameraPosition.x;
        camera.position.y = isMobile ? initialMobileCameraPosition.y : initialCameraPosition.y;
        camera.position.z = isMobile ? initialMobileCameraPosition.z : initialCameraPosition.z;
        setCamera(camera);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
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

        function zoomToCity(camera: PerspectiveCamera, controls: OrbitControls, name: string, endX: number, endY: number, endZ: number, duration: number) {
            // Disable controls while animating
            controls.enabled = false;
            // Cancel any ongoing animations
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

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

        handleLabelClickRef.current = (city: City) => {
            if (!scene || !camera || !controls) return;
            if (city.name === '' && focusedCity === null) return;

            let initCamPos = initialCameraPosition
            let targetPos = targetPositions
            if (isMobile) {
                initCamPos = initialMobileCameraPosition
                targetPos = targetMobilePositions
            }

            // If we're already focused on the city, go back to the initial position
            if (focusedCity === city.name || city.name === '') {
                setFocusedCity(null);
                props.setPopoverData(null);
                zoomToCity(camera, controls, "Initial", initCamPos.x, initCamPos.y, initCamPos.z, props.zoomDuration * 1.5);
            } else {
                setFocusedCity(city.name);
                zoomToCity(camera, controls, city.name,
                    targetPos[city.name].x, targetPos[city.name].y, targetPos[city.name].z, props.zoomDuration);
                props.setPopoverData(city);
            }
        }

        function createLabelElement(d: any): HTMLElement {
            const el = document.createElement('div');
            el.innerHTML = d.name;
            el.className = 'cityLabel'
            el.addEventListener('click', () => handleLabelClickRef.current && handleLabelClickRef.current(d));

            return el;
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P') {
                console.log(camera?.position);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [camera, controls, scene, focusedCity, globeExists, isMobile]);

    useEffect(function HandleClickOnGlobe() {
        const handleClickInside = (event: MouseEvent) => {
            if (!handleLabelClickRef.current) return;
            const target = event.target as HTMLElement;

            // make sure to not click on a city label
            console.log(target.classList)
            if (target.parentElement
                && !target.classList.contains('cityLabel')
                && !hasParentWithClass(target, 'popoverPanel')) {
                handleLabelClickRef.current({
                    lat: 0,
                    lng: 0,
                    name: ''
                })
            }
        };

        document.addEventListener('click', handleClickInside);

        return () => {
            document.removeEventListener('click', handleClickInside);
        };
    }, []);

    return (<div
        ref={globeContainerRef}
        style={{ width: '100%', height: '100vh' }}>
    </div>)
});

export default Globe;
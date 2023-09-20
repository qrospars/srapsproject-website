import React, { useEffect, useRef } from 'react';
import ThreeGlobe from 'three-globe';
import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const cities = [
    { name: 'Lausanne', lat: 46.5196, lng: 6.6323 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Barcelone', lat: 41.3851, lng: 2.1734 },
    { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
];

const MapSection = React.memo(() => {
    const globeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!globeContainerRef.current) return;
        const globe = new ThreeGlobe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .pointsData(cities)
            .pointLat('lat')
            .pointLng('lng')
            // .pointColor(() => 'black')
            // .pointAltitude(0.3)
            // .pointRadius(0.01)
            .labelsData(cities)
            .labelText('name');
        // .labelSize(0.5)
        // .labelColor(() => 'black')
        // .labelAltitude(0.02)
        // .labelResolution(2);

        // Setup renderer
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        globeContainerRef.current.appendChild(renderer.domElement);

        // Setup scene
        const scene = new Scene();
        scene.add(globe);
        scene.add(new AmbientLight(0xcccccc, Math.PI));
        scene.add(new DirectionalLight(0xffffff, 0.6 * Math.PI));

        // Setup camera
        const camera = new PerspectiveCamera();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position.z = 500;

        // Render loop
        function animate() {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        return () => {
            // Cleanup code if necessary
            if (!globeContainerRef.current) return;
            globeContainerRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={globeContainerRef} style={{ width: '100%', height: '100vh' }}></div>;
});

export default MapSection;

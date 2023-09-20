import React, { useEffect, useRef } from 'react';
import ThreeGlobe from 'three-globe';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const cities = [
    { name: 'Lausanne', lat: 46.5196, lng: 6.6323 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Barcelone', lat: 41.3851, lng: 2.1734 },
    { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
];

const MapSection = () => {
    const globeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!globeContainerRef.current) return;
        const globe = new ThreeGlobe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .pointsData(cities)
            .pointLat('lat')
            .pointLng('lng')
            .pointColor(() => 'black')
            .pointAltitude(0.3)
            .pointRadius(0.01)
            .labelsData(cities)
            .labelText('name')
            .labelSize(0.5)
            .labelColor(() => 'black')
            .labelAltitude(0.02)
            .labelResolution(2)

        const renderer = new WebGLRenderer();
        const scene = new Scene();
        const camera = new PerspectiveCamera();
        camera.position.z = 120;
        scene.add(globe);
        renderer.render(scene, camera);
        globeContainerRef.current.appendChild(renderer.domElement);
    }, []);

    return <div ref={globeContainerRef} style={{ width: '100%', height: '100vh' }}></div>;
}

export default MapSection;
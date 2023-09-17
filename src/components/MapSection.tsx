import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import ThreeGlobe from 'three-globe';


// const cities = [
//     { name: 'Lausanne', lat: 46.5196, lng: 6.6323 },
//     { name: 'Paris', lat: 48.8566, lng: 2.3522 },
//     { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
// ];

const MapSection = () => {
    const globeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(function initializeThreeGlobe() {
        // const myGlobe = new ThreeGlobe()
        //     .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        //     .pointsData(cities.map(city => ({ lat: city.lat, lng: city.lng })));
        // const scene = new THREE.Scene();
        // scene.add(myGlobe);
        // const animate = () => {
        //     // Animation logic here
        // };

        // animate();

    }, []);

    return <div ref={globeContainerRef}></div>;
}

export default MapSection;


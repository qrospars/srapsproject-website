import React, { useEffect } from 'react';
import L from 'leaflet';

const MapSection = () => {
    useEffect(() => {
        // Your leaflet code here for creating the map and pins
        // You might want to set the pins in an array and map over them for simplicity
    }, []);

    return (
        <section className="map-section">
            <div id="mapid"></div>
        </section>
    );
}

export default MapSection;

import React, { useEffect, useRef, useState } from 'react';
import Globe from '../components/Globe';
import Vinyl from '../components/Vinyl';

const panelShouldBeRightAligned = ['Lausanne'];

const MapSection = React.memo(() => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [popoverData, setPopoverData] = useState<City | null>(null);
    const [previousClickCity, setPreviousClickCity] = useState<string>('');
    const [popoverClass, setPopoverClass] = useState('popoverPanel hidden');
    const [popoverAlignment, setPopoverAlignment] = useState<string>('');


    useEffect(() => {
        let toAdd = '';
        if (popoverData && popoverData.name !== null) {
            setPreviousClickCity(popoverData.name);
            toAdd = panelShouldBeRightAligned.includes(popoverData.name) ? 'popoverPanel--right' : 'popoverPanel--left';
            setPopoverAlignment(toAdd);
        }

        if (popoverData && popoverData.name !== null) {
            setPopoverClass('popoverPanel popoverPanel--visible');
        } else {
            setPopoverClass('popoverPanel popoverPanel--hidden');
        }
        if (!popoverData) {
            setPopoverClass('popoverPanel popoverPanel--hidden popoverPanel--left');
        }
    }, [popoverData]);








    return <div className='welcome__map__globe'>
        <Globe zoomDuration={1000} setPopoverData={setPopoverData}></Globe>
        <div ref={popoverRef} className={`${popoverClass} ${popoverAlignment}`}>
            <div className="popoverPanel__background"></div>
            <div className="popoverPanel__content">
                <div className='title aclonica'>
                    {previousClickCity}
                </div>
                <div className='subtitle bold'>
                    Dig here to find one of these unique vinyls.
                </div>
                <div className='popoverPanel__content__grid'>
                    <Vinyl imagePath={"/artworks/02_001.png"} />
                    <Vinyl imagePath={"/artworks/02_002.png"} />
                    <Vinyl imagePath={"/artworks/02_003.png"} />
                    <Vinyl imagePath={"/artworks/02_004.png"} />
                    <Vinyl imagePath={"/artworks/02_005.png"} />
                    <Vinyl imagePath={"/artworks/02_006.png"} />
                    <Vinyl imagePath={"/artworks/02_007.png"} />
                </div>

            </div>
        </div>
    </div>;
});

export default MapSection;
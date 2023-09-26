import React, { useState } from 'react';
import Globe from '../components/Globe';

const MapSection = React.memo(() => {

    const [popoverData, setPopoverData] = useState<City | null>(null);

    return <div className='welcome__map__globe'>
        <Globe setPopoverData={setPopoverData}></Globe>
        {popoverData && (
            <div className="popover-panel">
                This is a test
            </div>
        )}
    </div>;
});

export default MapSection;
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const STROKE_COLOR = "#161616";
  const [showMapLink, setShowMapLink] = useState(true);

  let location = useLocation();
  useEffect(() => {
    console.log('Changed location');
    const checkRoute = () => {
      setShowMapLink(location.pathname !== '/map');
    };
    checkRoute();

    checkRoute
  }, [location.pathname]);

  return (
    <header className="App-header">
      <Link to="/">
        <svg className="App-logo" width="500" height="50" viewBox="0 0 1136 484" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_68_1420)">
            <path d="M22.9922 444.445L701.422 52.755L1112.26 290.975" stroke={STROKE_COLOR} strokeWidth="91.23" strokeMiterlimit="10" />
            <path d="M226.322 443.825L592.932 236.065" stroke={STROKE_COLOR} strokeWidth="54.74" strokeMiterlimit="10" />
          </g>
          <defs>
            <clipPath id="clip0_68_1420">
              <rect width="1134.96" height="483.89" fill={STROKE_COLOR} transform="translate(0.182129 0.0549927)" />
            </clipPath>
          </defs>
        </svg>


      </Link>
      <nav>
        <Link className="App-contact link" to="/map">
          {showMapLink ? <span>Map</span> : <span></span>}
        </Link>
      </nav>
    </header>
  );
}

export default Header;

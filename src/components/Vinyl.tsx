import React, { useEffect, useRef } from 'react';

interface VinylProps {
    imagePath: string;
}

const Vinyl: React.FC<VinylProps> = (props) => {
    const vinylRef = useRef<HTMLImageElement>(null);
    let currentRotation = 0;
    let animationFrameId: number;

    useEffect(() => {
        const element = vinylRef.current;

        const rotateAnimation = () => {
            currentRotation++;
            if (element) {
                element.style.transform = `rotate(${currentRotation}deg) scale(1.1)`;
            }
            animationFrameId = requestAnimationFrame(rotateAnimation);
        };

        const handleMouseOver = () => {
            requestAnimationFrame(rotateAnimation);
        };

        const handleMouseOut = () => {
            if (element) {
                element.style.transform = `rotate(${currentRotation}deg) scale(1)`;
            }
            cancelAnimationFrame(animationFrameId);
        };

        if (element) {
            element.addEventListener('mouseover', handleMouseOver);
            element.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (element) {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, []);

    return (
        <img
            ref={vinylRef}
            className="popoverPanel__content__grid__item"
            src={props.imagePath}
            alt=""
        />
    );
};

export default Vinyl;

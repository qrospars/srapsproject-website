import React, { useEffect, useRef, useState } from 'react';

interface WelcomeSectionProps {
    setPlayedInitAnimation: React.Dispatch<React.SetStateAction<boolean>>;
    playedInitAnimation: boolean;
}
const WelcomeSection: React.FC<WelcomeSectionProps> = (props) => {
    const animationRefs = [
        { ref: useRef<HTMLHeadingElement | null>(null), direction: 'right' },
        { ref: useRef<HTMLHeadingElement | null>(null), direction: 'left' },
    ];

    const appElementRef = useRef<HTMLElement | null>(null);

    useEffect(function initAnimation() {
        // Disable scroll
        document.body.style.overflow = 'hidden';


        // Initialize Observers
        const leftObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("slide-from-left");
                    leftObserver.unobserve(entry.target);
                }
            },
            { root: appElementRef.current, threshold: 0.1 }
        );

        const rightObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("slide-from-right");
                    rightObserver.unobserve(entry.target);
                }
            },
            { root: appElementRef.current, threshold: 0.1 }
        );


        // Attach observer to each ref
        animationRefs.forEach((ref) => {
            if (ref.ref.current) {
                if (ref.direction === 'left') {
                    leftObserver.observe(ref.ref.current);
                } else {
                    rightObserver.observe(ref.ref.current);
                }
            }
        });

        // Cache elements
        appElementRef.current = document.querySelector('.App') as HTMLElement | null;
        const slideFromTopElement = document.getElementById("title");
        const subtitleElement = document.getElementById("subtitle");
        const mainTextElement = document.getElementById("tagline");
        const animationDuration = 2500;

        // Add initial animations
        if (slideFromTopElement && subtitleElement && mainTextElement) {
            slideFromTopElement.classList.add("slide-from-top");
            subtitleElement.classList.add("fade-in");
            mainTextElement.classList.add("slide-from-left--delayed");
        }

        const timeoutId = setTimeout(() => {
            requestAnimationFrame(() => {
                if (appElementRef.current && !props.playedInitAnimation) {
                    console.log('scrolling allowed')
                    appElementRef.current.style.overflowY = 'auto';
                }
            });
        }, animationDuration);


        // Clean-up
        return () => {
            clearTimeout(timeoutId);
            animationRefs.forEach((ref) => {
                if (ref.ref.current) {
                    if (ref.direction === 'left') {
                        leftObserver.unobserve(ref.ref.current);
                    } else {
                        rightObserver.unobserve(ref.ref.current);
                    }
                }
            });
            props.setPlayedInitAnimation(true);
        };
    }, []);




    return (
        <section id='welcome' className="welcome">
            <div className="screen welcome__titleContainer">
                <h1 id='title' className="title welcome__title hidden">[SRAPSPROJECT001]</h1>
                <p id='subtitle' className="subtitle welcome__subtitle hidden">The First Chapter Begins</p>
                <p id='tagline' className="tagline welcome__tagline italic hidden">A unique <span className='aclonica regular'>fusion</span> of <br /><span className='aclonica regular padding-left-15'>generative design</span> and <span className='regular aclonica '>house music</span>, waiting to be <br /><span className='aclonica regular padding-left-5'>discovered</span>.</p>
            </div>
            <div className="screen welcome__content">
                <div ref={animationRefs[0].ref} className='welcome__content__journey hidden'>
                    <h2 className="subtitle ">The Journey</h2>
                    <p className="text ">Dive into a blend of visual art and house beats. SRAPSPROJECT001 isn't just music; it's a unique experience born from mathematics and randomness, crafting a musical journey that's non-replicable.</p>
                </div>
                <div ref={animationRefs[1].ref} className='welcome__content__concept hidden'>
                    <h2 className="subtitle">The Concept</h2>
                    <p className="text ">A hundred vinyls. A hundred designs. Scattered across Europe, they await a lucky few. Find one and be part of our story.</p>
                </div>
                <p className="text">Can you find the remaining vinyls?</p>

                <div className='welcome__content__numbers'>
                    <div className='welcome__content__numbers__col'>
                        <h2 className="subtitle">Total vinyls</h2>
                        <p className="text number">100</p>
                    </div>
                    <div className='welcome__content__numbers__col'>
                        <h2 className="subtitle">Discovered</h2>
                        <p className="text number">0</p>
                    </div>
                    <div className='welcome__content__numbers__col'>
                        <h2 className="subtitle">Countries</h2>
                        <p className="text number">4</p>
                    </div>
                </div>
                <div className="welcome__content__social">
                    <p className="text">
                        Want to stay updated? <a href="http://www.instagram.com/sraps.music" target='_blank' className="link">Follow us on Instagram</a>.
                        <br /><br />
                        Love our project? <a href="https://sraps.bandcamp.com/album/srapsproject001" target='_blank' className="link">Support us with a pre-order on Bandcamp</a>.
                    </p>
                </div>
            </div>

            {/* <div className="screen welcome__map">
                <p className="text">You can find on the map below the location of the ones that have been found</p>
                <a href="/gallery" className="link">Join the journey. View the Gallery of Discoverers.</a>
            </div> */}

        </section>
    );
}

export default WelcomeSection;

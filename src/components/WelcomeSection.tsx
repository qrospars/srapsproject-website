import React from 'react';

const WelcomeSection = () => {
    return (
        <section className="welcome">
            <div className="screen welcome__titleContainer">
                <h1 className="title welcome__title">[SRAPSPROJECT001]</h1>
                <p className="subtitle welcome__subtitle"><span className='aclonica '>The</span> First Chapter <span className='aclonica '>Begins</span></p>
                <p className="tagline welcome__tagline italic">A unique <span className='aclonica regular'>fusion</span> of <br /><span className='aclonica regular padding-left-15'>generative design</span> and <span className='regular aclonica '>house music</span>, waiting to be <br /><span className='aclonica regular padding-left-5'>discovered</span>.</p>
            </div>
            <div className="screen welcome__content">
                <div className='welcome__content__journey'>
                    <h2 className="subtitle">The Journey</h2>
                    <p className="text ">Dive into a blend of visual art and house beats. SRAPSPROJECT001 isn't just music; it's a unique experience born from mathematics and randomness, crafting a musical journey that's non-replicable.</p>
                </div>
                <div className='welcome__content__concept'>
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

import React from 'react';

const WelcomeSection = () => {
    return (
        <section className="welcome">
            <div className="screen welcome__titleContainer">
                <h1 className="title welcome__title">[SRAPSPROJECT001]</h1>
                <p className="subtitle welcome__subtitle"><span className='aclonica '>The</span> First Chapter <span className='aclonica '>Begins</span></p>
                <p className="tagline welcome__tagline italic">A unique <span className='aclonica regular'>fusion</span> of <span className='aclonica regular padding-left-15'>generative design</span> and <span className='regular aclonica '>house music</span>, waiting to be <span className='aclonica regular padding-left-5'>discovered</span>.</p>
            </div>
            <div className="screen welcome__content">
                <h2 className="subtitle">The Journey</h2>
                <p className="text welcome__text welcome__text--journey">Dive into a blend of visual art and house beats. SRAPSPROJECT001 isn't just music; it's a unique experience born from mathematics and randomness, crafting a musical journey that's non-replicable.</p>

                <h2 className="subtitle">The Concept</h2>
                <p className="text welcome__text welcome__text--concept">A hundred vinyls. A hundred designs. Scattered across Europe, they await a lucky few. Find one and be part of our story.</p>
            </div>

            <div className="welcome__map">
                {/* Interactive Map Component Here */}
                <p className="text">Vinyls Discovered: [Number] - Can you find the rest? Here are some hints for the remaining ones.</p>
            </div>

            <div className="welcome__engagement">
                <a href="/gallery" className="link">Join the journey. View the Gallery of Discoverers.</a>
                <p className="text">Stay updated on our next surprise. <a href="https://instagram.com/SRAPSPROJECT" className="link">Follow us on Instagram</a>. Love our project? <a href="https://bandcamp.com/SRAPSPROJECT" className="link">Support us with a pre-order on Bandcamp</a>.</p>
            </div>
        </section>
    );
}

export default WelcomeSection;

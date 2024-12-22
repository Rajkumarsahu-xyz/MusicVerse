import React from 'react';
import SongsComponent from './SongsComponent';
import ArtistsComponent from './ArtistsComponent';
import AlbumsComponent from './AlbumsComponent';

function Home() {
    return (
        <div className='homeContainer'>
            <h3>MusicVerse, Where Passion Meets Rhythm.</h3>
            <h3>Explore | Create | Celebrate</h3>
            <SongsComponent/>
            <ArtistsComponent/>
            <AlbumsComponent/>
        </div>
    );
}

export default Home;
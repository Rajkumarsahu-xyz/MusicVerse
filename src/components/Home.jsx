import React from 'react';
import SongsComponent from './SongsComponent';
import ArtistsComponent from './ArtistsComponent';
import AlbumsComponent from './AlbumsComponent';

function Home() {
    return (
        <div className='homeContainer'>
            <h1>Discover</h1>
            <SongsComponent/>
            <ArtistsComponent/>
            <AlbumsComponent/>
        </div>
    );
}

export default Home;
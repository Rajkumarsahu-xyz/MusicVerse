import React from 'react';
import Home from './Home';
import TopHeader from './TopHeader';
import Playbar from './Playbar';
import { Route, Routes } from 'react-router-dom';
import CreateAlbumPage from './CreateAlbumPage';
import CreatePlaylistPage from './CreatePlaylistPage';

function LandingPage() {
    return (
        <div className='LandingPageContainer'>
            <TopHeader/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/createAlbum' element={<CreateAlbumPage/>}/>
                <Route path='/createPlaylist' element={<CreatePlaylistPage/>}/>
            </Routes>
            <Playbar />
        </div>
    );
}

export default LandingPage;
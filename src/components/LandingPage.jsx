import React from 'react';
import Home from './Home';
import TopHeader from './TopHeader';
import Playbar from './Playbar';
import { Route, Routes } from 'react-router-dom';
import CreateAlbumPage from './CreateAlbumPage';
import CreatePlaylistPage from './CreatePlaylistPage';
import AlbumDetailsPage from './AlbumDetailsPage';
import ArtistDetailsPage from './ArtistDetailsPage';
import LeftSideContainer from './LeftSideContainer';
import PlaylistDetailsPage from './PlaylistDetailsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function LandingPage() {
    return (
        <div className='LandingPageContainer'>
            <TopHeader/>
            <LeftSideContainer/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/playlists' element={<Home />}/>
                <Route path='/albums' element={<Home />}/>
                <Route path='/createAlbum' element={<CreateAlbumPage/>}/>
                <Route path='/createPlaylist' element={<CreatePlaylistPage/>}/>
                <Route path="/album/:albumId" element={<AlbumDetailsPage/>} />
                <Route path="/artist/:artistId" element={<ArtistDetailsPage/>} />
                <Route path="/playlist/:playlistId" element={<PlaylistDetailsPage/>} />
            </Routes>
            <Playbar />
            <ToastContainer/>
        </div>
    );
}

export default LandingPage;
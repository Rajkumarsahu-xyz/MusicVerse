import React from "react";
import { usePlayback } from '../PlaybackContext';
import { useNavigate } from "react-router-dom";

const AboutAlbum = () => {
    const { currentSong } = usePlayback();
    const navigate = useNavigate();

    function handleAlbumNameClick(albumId) {
        navigate(`/album/${albumId}`);
    }

    if (!currentSong) return null;

    return (
        <div className="aboutAlbumContainer">
            <h4>About the Album</h4>
            <img src={currentSong.imgUrl} alt={currentSong.title} />
            <div className="aboutTheAlbum">
                <h3 className="albumName" onClick={() => handleAlbumNameClick(currentSong.albumId)}>
                    {currentSong.albumName}
                </h3>
                <div>
                    <p>{currentSong.genre}</p>
                    <p>{currentSong.tags}</p>
                </div>
            </div>
        </div>
    );
}

export default AboutAlbum;
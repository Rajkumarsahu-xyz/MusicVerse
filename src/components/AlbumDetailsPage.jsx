import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dataApi } from '../data';
import { usePlayback } from '../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa';

const AlbumDetailsPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songUrl, setSongUrl] = useState('');

  const { isPlaying, currentAudioUrl, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  const handlePlayPause = (audioUrl, title, artist, imgUrl, songId) => {
    setCurrentSong({ title, artist, imgUrl, songId });
    playPauseToggle(audioUrl, title, artist, imgUrl, songId);
  };

  const handleAddSong = async () => {
    await dataApi.addSongsToAlbum({ albumId: album.id, songTitle, songUrl });
    setSongTitle('');
    setSongUrl('');
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      const fetchedAlbum = await dataApi.getAlbumById(albumId);
      setAlbum(fetchedAlbum);
    };
    fetchAlbum();
    console.log(album);
  }, [album, currentSong]);

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className='albumDetailsContainer'>
      <h1>{album.title}</h1>
      <img src={album.coverImageUrl} alt={album.title} />

      <div className="addSongContainer">
        <h3>Add Songs To The Album</h3>
        <div className="inputContainer">
          <label>Song Title:</label>
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
          <label>Song Url:</label>
          <input type="text" value={songUrl} onChange={(e) => setSongUrl(e.target.value)} />
        </div>
        <div className="buttonContainer">
          <button onClick={handleAddSong}>Add Song</button>
        </div>
      </div>

      <div className="songsListContainer">
        <h2>Songs</h2>
        <ul>
            {album.songs && album.songs.map((song) => (
              <li key={song.id} className='songCardsInAlbum'>
                <h3>{song.title}</h3>
                <button
                  onClick={() =>
                    handlePlayPause(song.url, song.title, song.artist, song.imgUrl, song.id)
                  }
                >
                  {isPlaying && currentSong.songId === song.id ? <FaPause /> : <FaPlay />}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AlbumDetailsPage;

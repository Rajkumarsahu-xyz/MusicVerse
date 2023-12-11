
import React, { useState, useEffect } from 'react';
import { dataApi } from '../data';
import { usePlayback } from './../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa';

const SongsComponent = () => {
  const { isPlaying, currentAudioUrl, currentSong, setCurrentSong, playPauseToggle } = usePlayback();
  const [songs, setSongs] = useState([]);

  const togglePlay = (audioUrl, title, artistId, imgUrl, songId) => {
    setCurrentSong({ title, artistId, imgUrl, songId });
    playPauseToggle(audioUrl, title, artistId, imgUrl, songId);
    console.log(currentSong);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(isPlaying);
        const songsData = await dataApi.fetchSongs();
        const filteredSongsData = songsData.slice(0, 4);
        setSongs(filteredSongsData);
        // console.log(filteredSongsData);

        await Promise.all(filteredSongsData.map(async (song) => {
          const album = await dataApi.getAlbumById(song.albumId);
          song.coverImageUrl = album.coverImageUrl;
          setSongs((prevSongs) => {
            return prevSongs.map((prevSong) => {
              if (prevSong.id === song.id) {
                return { ...prevSong, coverImageUrl: song.coverImageUrl };
              }
              return prevSong;
            });
          });
          // console.log(song);
          return album;
        }));
        
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [currentSong]);

  return (
    <div className='songsContainer'>
      <h2>Songs</h2>
      <div className='songsItems'>
        {songs.map((song, index) => (
          <div key={index} className='songCard'>
            <img src={song.coverImageUrl} alt={`Song ${index + 1}`} />
            <h4>{song.title}</h4>
            <div onClick={() => togglePlay(song.url, song.title, song.artistId, song.coverImageUrl, song.id)}>
              {isPlaying && currentSong.songId === song.id ? <FaPause className="playPauseButton"/> : <FaPlay className="playPauseButton"/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsComponent;

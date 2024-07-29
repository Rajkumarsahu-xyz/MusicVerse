import React, { useState, useEffect } from 'react';
import { usePlayback } from './../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const SongsComponent = () => {
  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();
  const [songs, setSongs] = useState([]);

  const togglePlay = (audioUrl, title, artistId, imgUrl, songId, artistName) => {
    setCurrentSong({ title, artistId, imgUrl, songId, artistName });
    playPauseToggle(audioUrl, title, artistId, imgUrl, songId, artistName);
    console.log(currentSong);
  };

  useEffect(() => {
    const fetchData = async () => {
      const songsCollection = collection(db, 'songs');
      const songsQuery = query(songsCollection);

      try {
        const songsSnapshot = await getDocs(songsQuery);
        const songsData = songsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        
        const songsWithAlbumData = await Promise.all(
          songsData.map(async (song) => {
            const albumQuery = doc(collection(db, 'albums'), song.album_id);
            const albumDoc = await getDoc(albumQuery);
            const albumData = albumDoc.data();
            return {
              ...song,
              imgUrl: albumData?.coverImageUrl || '', 
            };
          })
        );

        const songsWithArtistData = await Promise.all(
          songsWithAlbumData.map(async (song) => {
            const artistQuery = doc(collection(db, 'artists'), song.artist_id);
            const artistDoc = await getDoc(artistQuery);
            const artistData = artistDoc.data();
            return {
              ...song,
              artistName: artistData?.name || '', 
            };
          })
        );

        const validSongsWithAlbumData = songsWithArtistData.filter((song) => song !== null);

        setSongs(validSongsWithAlbumData.slice(0, 4));
        console.log(validSongsWithAlbumData.slice(0, 4));
        
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='songsContainer'>
      <h2>Songs</h2>
      <div className='songsItems'>
        {songs.map((song, index) => (
          <div key={index} className='songCard'>
            <img src={song.imgUrl} alt={`Song ${index + 1}`} />
            <h4>{song.title}</h4>
            <div onClick={() => togglePlay(song.audioUrl, song.title, song.artist_id, song.imgUrl, song.id, song.artistName)}>
              {(isPlaying && currentSong.songId === song.id) ? <FaPause className="playPauseButton"/> : <FaPlay className="playPauseButton"/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsComponent;

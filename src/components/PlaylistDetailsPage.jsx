import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { app, db } from '../Firebase';
import { usePlayback } from '../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa6';
import Loader from '../Loader';

const PlaylistDetailsPage = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  const togglePlay = async (audioUrl, title, artistName, imgUrl, songId) => {
    if(!imgUrl) {
        const db = getFirestore(app);
        const songDocRef = doc(db, 'songs', songId);
        const songDoc = await getDoc(songDocRef);
        console.log(songDoc.data());
        const songData = songDoc.data();
  
        if (songDoc.exists() && songData.album_id) {
          const albumDocRef = doc(db, 'albums', songData.album_id);
          const albumDoc = await getDoc(albumDocRef);
          const albumData = albumDoc.data();
  
          const artistDocRef = doc(db, 'artists', songData.artist_id);
          const artistDoc = await getDoc(artistDocRef);
          const artistData = artistDoc.data();
  
          if (albumDoc.exists()) {
            imgUrl = albumData.coverImageUrl;
          }
          if(artistDoc.exists()) {
            artistName = artistData.name;
          }
        }
      }
    setCurrentSong({ title, artistName, imgUrl, songId });
    playPauseToggle(audioUrl, title, artistName, imgUrl, songId);
  };

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const db = getFirestore(app);
      const playlistDocRef = doc(db, 'playlists', playlistId);
      const playlistDoc = await getDoc(playlistDocRef);

      if (playlistDoc.exists()) {
        setPlaylist({ id: playlistDoc.id, ...playlistDoc.data() });
      } else {
        console.error('Playlist not found');
      }
    };

    const fetchAllSongs = async () => {
        const db = getFirestore(app);
        const songsCollection = collection(db, 'songs');
        const songsSnapshot = await getDocs(songsCollection);
        const songsData = songsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllSongs(songsData);
      };

    fetchPlaylistDetails();
    fetchAllSongs();
  }, [playlistId]);

  const handleAddToPlaylist = async () => {
    const selectedSongDetails = selectedSongs.map(songId => {
        const selectedSong = allSongs.find(song => song.id === songId);
        return {
          id: selectedSong.id,
          title: selectedSong.title,
          audioUrl: selectedSong.audioUrl,
        };
    });
    const playlistDocRef = doc(db, 'playlists', playlistId);

    await updateDoc(playlistDocRef, {
      songs: arrayUnion(...selectedSongDetails),
    });

    setSelectedSongs([]);
    const updatedPlaylistDoc = await getDoc(playlistDocRef);
    setPlaylist({ id: updatedPlaylistDoc.id, ...updatedPlaylistDoc.data() });
  };

  if (!playlist) {
    return <Loader />;
  }

  return (
    <div className='playlistDetailsContainer'>
      <div className='playlistDetailSongs'>
        <h1>{playlist.title} - {playlist.createdBy.username}</h1>
      <div className="addSongsToPlaylist">
        <h3>Add Songs To The Playlist</h3>
        <div className="songsList">
          <label>Select Songs:</label>
          <select
            multiple
            value={selectedSongs}
            onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedSongs(selectedIds);
            }}
          >
            {allSongs.map(song => (
              <option key={song.id} value={song.id}>{song.title} - {song.genre}</option>
            ))}
          </select>
        </div>
        <div className="buttonContainer">
          <button onClick={handleAddToPlaylist}>Add to Playlist</button>
        </div>
      </div>
      <h2>Songs</h2>
        {playlist.songs.map((song, index) => (
          <div key={index} className='playlistDetailSongsCard'>
            <h2>{song.title}</h2>
            <button onClick={() => togglePlay(song.audioUrl, song.title, song.artistName, song.imgUrl, song.id)}>
              {isPlaying && currentSong.songId === song.id ? <FaPause className="pauseBtn" /> : <FaPlay className="playBtn" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetailsPage;

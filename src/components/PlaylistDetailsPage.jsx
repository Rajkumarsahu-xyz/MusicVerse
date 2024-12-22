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
  const [loading, setLoading] = useState(true);
  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  const togglePlay = async (audioUrl, title, artist, imgUrl, songId, artistName, genre, tags, albumId, albumName) => {
    if (!imgUrl || !artistName) {
      const db = getFirestore(app);
      const songDocRef = doc(db, 'songs', songId);
      const songDoc = await getDoc(songDocRef);
      const songData = songDoc.data();
      artist = songData.artist_id;
      genre = songData.genre;
      tags = songData.tags;
      albumId = songData.album_id;

      if (songDoc.exists() && songData.album_id) {
        const albumDocRef = doc(db, 'albums', songData.album_id);
        const albumDoc = await getDoc(albumDocRef);
        const albumData = albumDoc.data();

        const artistDocRef = doc(db, 'artists', songData.artist_id);
        const artistDoc = await getDoc(artistDocRef);
        const artistData = artistDoc.data();

        if (albumDoc.exists()) {
          imgUrl = albumData.coverImageUrl;
          albumName = albumData.title
        }
        if (artistDoc.exists()) {
          artistName = artistData.name;
        }
      }
    }
    console.log(artist);
    setCurrentSong({ title, artist, imgUrl, songId, artistName, genre, tags, albumId, albumName });
    playPauseToggle(audioUrl, title, artist, imgUrl, songId, artistName, genre, tags, albumId, albumName);
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

    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [playlistId]);

  const handleAddToPlaylist = async () => {
    const selectedSongDetails = await Promise.all(
      selectedSongs.map(async songId => {
        const selectedSong = allSongs.find(song => song.id === songId);

        const artistDocRef = doc(db, 'artists', selectedSong.artist_id);
        const artistDoc = await getDoc(artistDocRef);
        const artistData = artistDoc.data();

        return {
          id: selectedSong.id,
          title: selectedSong.title,
          audioUrl: selectedSong.audioUrl,
          artistName: artistData.name, // Fetch and include artistName here
        };
      })
    );

    const playlistDocRef = doc(db, 'playlists', playlistId);

    await updateDoc(playlistDocRef, {
      songs: arrayUnion(...selectedSongDetails),
    });

    setSelectedSongs([]);
    const updatedPlaylistDoc = await getDoc(playlistDocRef);
    setPlaylist({ id: updatedPlaylistDoc.id, ...updatedPlaylistDoc.data() });
  };

  if (!playlist && loading) {
    return (
      <div className="playlistDetailsContainer">
        <Loader />
      </div>
    );
  }

  if (!playlist && !loading) {
    return (
      <div className='playlistDetailsContainer'>
        <div className='playlistNotAvailableContainer'>
          <h2>Sorry !</h2>
          <h3>The Playlist you're looking for is not Available.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className='playlistDetailsContainer'>
      <div className='playlistDetailSongs'>
        <h1>{playlist.title} &ensp; - &ensp; {playlist.createdBy.username}</h1>
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
            <button onClick={() => togglePlay(song.audioUrl, song.title, song.artist, song.imgUrl, song.id, song.artistName, song.genre, song.tags, song.albumid, song.albumtitle)}>
              {isPlaying && currentSong.songId === song.id ? <FaPause className="pauseBtn" /> : <FaPlay className="playBtn" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetailsPage;

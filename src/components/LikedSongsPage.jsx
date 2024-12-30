import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { usePlayback } from '../PlaybackContext';
import { auth } from '../Firebase';
import { FaPause, FaPlay } from 'react-icons/fa';
import Loader from '../Loader';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

const LikedSongsPage = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const fetchLikedSongs = async () => {
        const db = getFirestore();

        const likesRef = collection(db, 'likes');
        const q = query(likesRef, where('user_id', '==', user.uid), where('isLiked', '==', true));
        const querySnapshot = await getDocs(q);

        const likedSongIds = querySnapshot.docs.map(doc => doc.data().song_id);
        
        const songsRef = collection(db, 'songs');
        const songPromises = likedSongIds.map(songId => getDoc(doc(songsRef, songId)));

        const songSnapshots = await Promise.all(songPromises);
        const songsData = songSnapshots.map(songSnap => ({ id: songSnap.id, ...songSnap.data() }));

        const albumsRef = collection(db, 'albums');
        const albumIds = [...new Set(songsData.map(song => song.album_id))]; // Get unique album IDs
        const albumPromises = albumIds.map(albumId => getDoc(doc(albumsRef, albumId)));
        const albumSnapshots = await Promise.all(albumPromises);
        const albumDataMap = albumSnapshots.reduce((acc, albumSnap) => {
          if (albumSnap.exists()) {
            acc[albumSnap.id] = albumSnap.data();
          }
          return acc;
        }, {});

        const artistsRef = collection(db, 'artists');
        const artistIds = [...new Set(songsData.map(song => song.artist_id))]; // Get unique album IDs
        const artistPromises = artistIds.map(artistId => getDoc(doc(artistsRef, artistId)));
        const artistSnapshots = await Promise.all(artistPromises);
        const artistDataMap = artistSnapshots.reduce((acc, artistSnap) => {
          if (artistSnap.exists()) {
            acc[artistSnap.id] = artistSnap.data();
          }
          return acc;
        }, {});

        const newSongsData = songsData.map(song => ({ ...song, imgUrl: albumDataMap[song.album_id].coverImageUrl, album_title: albumDataMap[song.album_id].title, artistName: artistDataMap[song.artist_id].name, }));

        console.log(newSongsData);

        setLikedSongs(newSongsData);
        setLoading(false);
      };

      fetchLikedSongs();
    });

    return () => unsubscribe();
  }, []);

  const togglePlay = (audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName) => {
    setCurrentSong({ title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName });
    playPauseToggle(audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName);
  };

  if (!likedSongs && loading) {
    return (
      <div className="likedSongsContainer">
        <Loader />
      </div>
    );
  }

  if (!likedSongs && !loading) {
    return (
      <div className='likedSongsContainer'>
        <div className='likedSongsNotAvailableContainer'>
          <h2>Sorry !</h2>
          <h3>The Liked Songs you're looking for is not Available.</h3>
          <Link to="/" className="home-link">Go back to Home</Link>
        </div>
        <div className='pageNotFoundContainer'>
          <img src={"/assets/page_not_found_image6.png"} alt="Page Not Found" className='pageNotFoundImage' />
        </div>
      </div>
    );
  }

  return (
    <div className='likedSongsContainer'>
      <h1>Liked Songs</h1>
      <ul>
        {likedSongs.map(song => (
          <li key={song.id} className='likedSongsPageSongsCard'>
            <div>
              <h2>{song.title}</h2>
              {/* <p>{song.artistName}</p> */}
            </div>
            <button onClick={() => togglePlay(song.audioUrl, song.title, song.artist_id, song.imgUrl, song.id, song.artistName, song.genre, song.tags, song.album_id, song.album_title)}>
              {isPlaying && currentSong.songId === song.id ? <FaPause /> : <FaPlay />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedSongsPage;

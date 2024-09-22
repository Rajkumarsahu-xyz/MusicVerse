import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { usePlayback } from '../PlaybackContext';
import { auth } from '../Firebase'; // Make sure you have the auth import
import { FaPause, FaPlay } from 'react-icons/fa';
import Loader from '../Loader';

const LikedSongsPage = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('user_id', '==', user.uid), where('isLiked', '==', true));
      const querySnapshot = await getDocs(q);

      const likedSongIds = querySnapshot.docs.map(doc => doc.data().song_id);
      
      const songsRef = collection(db, 'songs');
      const songPromises = likedSongIds.map(songId => getDoc(doc(songsRef, songId)));

      const songSnapshots = await Promise.all(songPromises);
      const songsData = songSnapshots.map(songSnap => ({ id: songSnap.id, ...songSnap.data() }));

      setLikedSongs(songsData);
      setLoading(false);
    };

    fetchLikedSongs();
  }, []);

  const togglePlay = (audioUrl, title, artistName, imgUrl, songId) => {
    setCurrentSong({ title, artistName, imgUrl, songId });
    playPauseToggle(audioUrl, title, artistName, imgUrl, songId);
  };

  if (loading) {
    return <Loader />;
  }

  if (likedSongs.length === 0) {
    return <div>No liked songs found.</div>;
  }

  return (
    <div className='likedSongsContainer'>
      <h1>Liked Songs</h1>
      <ul>
        {likedSongs.map(song => (
          <li key={song.id} className='likedSongsPageSongsCard'>
            <div>
              <h2>{song.title}</h2>
              <p>{song.artistName}</p>
            </div>
            <button onClick={() => togglePlay(song.audioUrl, song.title, song.artistName, song.imgUrl, song.id)}>
              {isPlaying && currentSong.songId === song.id ? <FaPause /> : <FaPlay />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedSongsPage;

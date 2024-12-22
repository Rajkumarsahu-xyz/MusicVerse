import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayback } from '../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa';
import { db, storage, auth } from '../Firebase';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Loader from '../Loader';

const AlbumDetailsPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [songGenre, setSongGenre] = useState('');
  const [songTagName, setSongTagName] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  const handlePlayPause = (audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName) => {
    console.log(audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName);
    setCurrentSong({ title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName });
    playPauseToggle(audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      const albumDocRef = doc(db, 'albums', albumId);
      const albumDoc = await getDoc(albumDocRef);
      const albumData = albumDoc.data();

      if(albumData) {
        const artistsRef = collection(db, "artists");
        const artistDocRef = doc(artistsRef, albumData.artist_id);
        const artistDocSnapshot = await getDoc(artistDocRef);
  
        const artistData = artistDocSnapshot.data();
        console.log(artistData);
  
        if (albumDoc.exists()) {
          setAlbum({ id: albumDoc.id, artistName: artistData.name, ...albumDoc.data() });
        } else {
          console.error('Album not found');
        }
      }
    };

    fetchAlbumDetails();

    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [albumId]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
    }
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    const storageRef = ref(storage, `Songs/${file.name}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        console.error('Error uploading file:', error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((audioUrl) => {
          console.log('File available at:', audioUrl);
          setSongUrl(audioUrl);
        });
      }
    );
  };

  async function addSongsToAlbum({ albumId, songTitle, songGenre, songTagName, songUrl }) {
    const songsRef = collection(db, 'songs');
    const newSongRef = await addDoc(songsRef, {
      album_id: albumId,
      artist_id: album.artist_id, 
      audioUrl: songUrl,
      genre: songGenre,
      tags: songTagName,
      title: songTitle,
    });

    const albumRef = doc(db, 'albums', albumId);
    const albumDoc = await getDoc(albumRef);
    const existingSongs = albumDoc.data().songs || [];

    const updatedSongs = [...existingSongs, {
      id: newSongRef.id,
      audioUrl: songUrl,
      genre: songGenre,
      tags: songTagName,
      name: songTitle,
    }];

    await updateDoc(albumRef, {
      songs: updatedSongs,
    });

    // Update local state with new song
    setAlbum((prevAlbum) => ({
      ...prevAlbum,
      songs: updatedSongs,
    }));
  
    return newSongRef;  
  }

  const handleAddSong = async () => {
    if (!songTitle || !songUrl || !songGenre || !songTagName) {
      return;
    }
  
    await addSongsToAlbum({
      albumId: album.id,
      songTitle,
      songGenre,
      songTagName,
      songUrl,
    });
  
    setSongTitle('');
    setSongUrl('');
    setSongGenre('');
    setSongTagName('');
  };

  const handleArtistClick = () => {
    navigate(`/artist/${album.artist_id}`);
  };

  if (!album && loading) {
    return (
      <div className="albumDetailsContainer">
        <Loader />
      </div>
    );
  }
  
  if (!album && !loading) {
    return (
      <div className='albumDetailsContainer'>
        <Loader />
        <div className='albumNotAvailableContainer'>
          <h2>Sorry !</h2>
          <h3>The Album you're looking for is not Available.</h3>
        </div>
      </div>
    );
  }

  const isAlbumCreator = album.artist_id === currentUserId;

  return (
    <div className='albumDetailsContainer'>
      <h1>{album.title} &ensp; - &ensp; 
      <span className='artistName' onClick={handleArtistClick}>
          {album.artistName}
        </span>
      </h1>
      <img src={album.coverImageUrl} alt={album.title} />

      {isAlbumCreator && (
        <div className="addSongContainer">
          <h3>Add Songs To The Album</h3>
          <div className="inputContainer">
            <label>Song Title:</label>
            <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
            <label>Song Genre:</label>
            <input type="text" value={songGenre} onChange={(e) => setSongGenre(e.target.value)} />
            <label>Song Tag Name:</label>
            <input type="text" value={songTagName} onChange={(e) => setSongTagName(e.target.value)} />
            <label>Upload Song:</label>
            <input type="file" onChange={(e) => handleFileUpload(e)} />
          </div>
          <div className="buttonContainer">
            <button onClick={handleAddSong}>Add Song</button>
          </div>
        </div>
      )}

      <div className="songsListContainer">
        <h2>Songs</h2>
        <ul>
            {album.songs && album.songs.map((song, index) => (
              <li key={song.id} className='songCardsInAlbum'>
                <h3>{song.name}</h3>
                <button
                  onClick={() =>
                    handlePlayPause(song.audioUrl, song.name, album.artist_id, album.coverImageUrl, song.id, album.artistName, song.genre, song.tags, album.id, album.title)
                  }
                >
                  {(isPlaying && currentSong.songId === song.id) ? <FaPause /> : <FaPlay />}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AlbumDetailsPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { dataApi } from '../data';
import { usePlayback } from '../PlaybackContext';
import { FaPause, FaPlay } from 'react-icons/fa';
import { db, storage } from '../Firebase';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const AlbumDetailsPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [songGenre, setSongGenre] = useState('');
  const [songTagName, setSongTagName] = useState('');

  const { isPlaying, currentSong, setCurrentSong, playPauseToggle } = usePlayback();

  const handlePlayPause = (audioUrl, title, artist, imgUrl, songId) => {
    setCurrentSong({ title, artist, imgUrl, songId });
    playPauseToggle(audioUrl, title, artist, imgUrl, songId);
  };

  // const handleAddSong = async () => {
  //   await dataApi.addSongsToAlbum({ albumId: album.id, songTitle, songUrl });
  //   setSongTitle('');
  //   setSongUrl('');
  // };

  // useEffect(() => {
  //   const fetchAlbum = async () => {
  //     const fetchedAlbum = await dataApi.getAlbumById(albumId);
  //     setAlbum(fetchedAlbum);
  //   };
  //   fetchAlbum();
  //   // console.log(album);
  // }, [album, currentSong, albumId]);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      const albumDocRef = doc(db, 'albums', albumId);
      const albumDoc = await getDoc(albumDocRef);
      const albumData = albumDoc.data();

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
    };

    fetchAlbumDetails();
    
  }, [albumId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    // Create a storage reference
    const storageRef = ref(storage, `Songs/${file.name}`);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle progress (optional)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        // Handle errors (optional)
        console.error('Error uploading file:', error.message);
      },
      () => {
        // Handle successful upload
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
  
    // Add the song to the album's songs array
    const albumRef = doc(db, 'albums', albumId);
    const albumDoc = await getDoc(albumRef);
    const existingSongs = albumDoc.data().songs || [];

    // Append the new song details to the existing songs array
    const updatedSongs = [...existingSongs, {
      id: newSongRef.id,
      audioUrl: songUrl,
      genre: songGenre,
      tags: songTagName,
      name: songTitle,
    }];

    // Update the "songs" array in the album document
    await updateDoc(albumRef, {
      songs: updatedSongs,
    });
  
    return newSongRef;  
  }

  const updateArtistWithAlbum = async (artistId, artistName, albumId, artistGenre) => {
    const artistDocRef = doc(db, 'artists', artistId);
    console.log(artistDocRef);
  
    try {
      // Retrieve existing artist data
      const artistDoc = await getDoc(artistDocRef);
      console.log(artistDoc);
      const artist = artistDoc.data();

      console.log(artist);

      if(!artist) {
        await setDoc(artistDocRef, {
          name: artistName,
          Album: [albumId],
          genre: artistGenre,
        });
      }
  
      // Add album_id to the artist's data
      else {
        const updatedAlbums = [...(artist.Album || []), albumId];
        console.log(updatedAlbums);
        await setDoc(artistDocRef, {
          name: artistName,
          Album: updatedAlbums,
          genre: artistGenre,
          // Add any other fields you may have in the artist document
        });
      }

    } catch (error) {
      console.error('Error updating artist with album:', error.message);
    }
  };

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

    await updateArtistWithAlbum(albumId, album.artist_id, albumId, songGenre);
  
    setSongTitle('');
    setSongUrl('');
    setSongGenre('');
    setSongTagName('');
  };
  
  

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className='albumDetailsContainer'>
      <h1>{album.title}</h1>
      <img src={album.coverImageUrl} alt={album.title} />

      <div className="addSongContainer">
        <h3>Add Songs To The Album</h3>
        {/* <div className="inputContainer">
          <label>Song Title:</label>
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
          <label>Song Url:</label>
          <input type="text" value={songUrl} onChange={(e) => setSongUrl(e.target.value)} />
        </div> */}
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

      <div className="songsListContainer">
        <h2>Songs</h2>
        <ul>
            {album.songs && album.songs.map((song, index) => (
              <li key={song.id} className='songCardsInAlbum'>
                <h3>{song.name}</h3>
                <button
                  onClick={() =>
                    handlePlayPause(song.audioUrl, song.name, song.artist, album.coverImageUrl, song.id)
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

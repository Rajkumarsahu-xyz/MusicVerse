import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { addDoc, collection } from 'firebase/firestore';

const CreatePlaylistPage = () => {
  const [playlistTitle, setPlaylistTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

  const handleCreatePlaylist = async () => {
    const { uid, displayName } = auth.currentUser || {};
    const playlistsRef = collection(db, 'playlists');
    const newPlaylistDoc = await addDoc(playlistsRef, {
      title: playlistTitle,
      songs: [],
      createdBy: {
        userId: uid,
        username: displayName,
      },
    });

    const newPlaylistId = newPlaylistDoc.id;
    setPlaylistTitle('');
    navigate(`/playlist/${newPlaylistId}`);
  };

  return (
    <div className="createPlaylistContainer">
      <h1>Create New Playlist</h1>
      <div className="inputContainer">
        <label>Playlist Title:</label>
        <input type="text" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)} />
      </div>
      <div className="buttonContainer">
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
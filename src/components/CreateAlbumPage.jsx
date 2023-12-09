import React, { useState } from 'react';
import { dataApi, userAuthApi } from '../data';

const CreateAlbumPage = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [album, setAlbum] = useState([]);
  const artistId = userAuthApi.users[1].id;

  const handleAddSong = async () => {
    await dataApi.addSongsToAlbum({ albumId: album.id, songTitle, songUrl });
    setSongTitle('');
    setSongUrl('');
  };

  const handleCreateAlbum = async () => {
    setAlbum(await dataApi.createAlbum({ title: albumTitle, artistId, coverImageUrl }));
    setAlbumTitle('');
    setCoverImageUrl('');
  };

  return (
    <div className='createAlbumContainer'>
      <h1>Create New Album</h1>
      <div className="inputContainer">
        <label> Album Title : </label>
          <input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} />
        <label> Album Cover Image URL : </label>
          <input type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
      </div>
      <div className="buttonContainer">
        <button onClick={handleCreateAlbum}>Create Album</button>
      </div>

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
    </div>
  );
};

export default CreateAlbumPage;

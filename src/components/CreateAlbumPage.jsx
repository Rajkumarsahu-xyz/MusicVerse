import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataApi, userAuthApi } from '../data';

const CreateAlbumPage = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const artistId = userAuthApi.users[2].id;
  
  const navigate = useNavigate();

  const handleCreateAlbum = async () => {
    const album = await dataApi.createAlbum({ title: albumTitle, artistId, coverImageUrl });
    setAlbumTitle('');
    setCoverImageUrl('');

    navigate(`/album/${album.id}`);
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
    </div>
  );
};

export default CreateAlbumPage;

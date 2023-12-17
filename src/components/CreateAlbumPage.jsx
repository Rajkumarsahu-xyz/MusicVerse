import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';

const CreateAlbumPage = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const updateArtistWithAlbum = async (artistId, artistName, albumId) => {
    const artistDocRef = doc(db, 'artists', artistId);
    console.log(artistDocRef);
  
    try {
      const artistDoc = await getDoc(artistDocRef);
      console.log(artistDoc);
      const artist = artistDoc.data();

      console.log(artist);

      if(!artist) {
        await setDoc(artistDocRef, {
          name: artistName,
          Album: [albumId],
        });
      }

      else {
        const updatedAlbums = [...(artist.Album || []), albumId];
        console.log(updatedAlbums);
        await setDoc(artistDocRef, {
          name: artistName,
          Album: updatedAlbums,
        });
      }

    } catch (error) {
      console.error('Error updating artist with album:', error.message);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      const storageRef = ref(storage, `AlbumCovers/${coverImage.name}`);

      const uploadTask = uploadBytesResumable(storageRef, coverImage);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error('Error uploading cover image:', error.message);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setCoverImageUrl(downloadUrl);
          const albumsRef = collection(db, 'albums');

          const { uid, displayName } = auth.currentUser || {};
          const artistId = uid;

          const newAlbumRef = await addDoc(albumsRef, {
            artist_id: artistId,
            coverImageUrl: coverImageUrl,
            title: albumTitle,
            songs: [],
          });

          await updateArtistWithAlbum(artistId, displayName, newAlbumRef.id);

          navigate(`/album/${newAlbumRef.id}`);
        }
      );
    } catch (error) {
      console.error('Error creating album:', error.message);
    }
  };

  return (
    <div className='createAlbumContainer'>
      <h1>Create New Album</h1>
      <div className="inputContainer">
        <label> Album Title : </label>
        <input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} />
        <label> Album Cover Image : </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="buttonContainer">
        <button onClick={handleCreateAlbum}>Create Album</button>
      </div>
    </div>
  );
};

export default CreateAlbumPage;

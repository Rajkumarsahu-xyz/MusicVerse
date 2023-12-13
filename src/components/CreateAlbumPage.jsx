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






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { dataApi, userAuthApi } from '../data';
// import { db, storage } from '../Firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { addDoc, collection } from 'firebase/firestore';

// const CreateAlbumPage = () => {
//   const [albumTitle, setAlbumTitle] = useState('');
//   const [coverImage, setCoverImage] = useState(null);
//   const [coverImageUrl, setCoverImageUrl] = useState('');
//   const artistId = userAuthApi.users[2].id;
  
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     // Handle image selection
//     const file = e.target.files[0];
//     setCoverImage(file);
//   };

//   const handleCreateAlbum = async () => {
//     try {
//       // Create a storage reference for the cover image
//       const storageRef = ref(storage, `AlbumCovers/${coverImage.name}`);
      
//       // Upload cover image
//       const uploadTask = uploadBytesResumable(storageRef, coverImage);
  
//       uploadTask.on('state_changed', 
//         (snapshot) => {
//           // Handle progress (optional)
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log(`Upload progress: ${progress}%`);
//         },
//         (error) => {
//           // Handle errors (optional)
//           console.error('Error uploading cover image:', error.message);
//         },
//         async () => {
//           // Handle successful upload
//           const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
//           setCoverImageUrl(downloadUrl);
  
//           // Create a reference to the "albums" collection
//           const albumsRef = collection(db, 'albums');
  
//           // Add the new album to the "albums" collection with the uploaded cover image URL
//           const newAlbumRef = await addDoc(albumsRef, {
//             artist_id: artistId,
//             coverImageUrl: downloadUrl,
//             title: albumTitle,
//             songs: [],
//           });

//           navigate(`/album/${newAlbumRef.id}`);
//         }
//       );
//     } catch (error) {
//       console.error('Error creating album:', error.message);
//     }
//   };

//   return (
//     <div className='createAlbumContainer'>
//       <h1>Create New Album</h1>
//       <div className="inputContainer">
//         <label> Album Title : </label>
//         <input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} />
//         <label> Album Cover Image : </label>
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </div>
//       <div className="buttonContainer">
//         <button onClick={handleCreateAlbum}>Create Album</button>
//       </div>
//     </div>
//   );
// };

// export default CreateAlbumPage;

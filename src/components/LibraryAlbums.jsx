
import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app, auth } from '../Firebase';
import { useNavigate } from "react-router-dom";

function LibraryAlbums() {
  const [userAlbums, setUserAlbums] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate()

  function albumClickHandler(albumId) {
    navigate(`/album/${albumId}`);
  }

  useEffect(() => {
    const fetchUserAlbums = async () => {
      if (user) {
        const db = getFirestore(app);
        const albumsRef = collection(db, 'albums');
        const userAlbumsQuery = query(albumsRef, where('artist_id', '==', user.uid));
        const albumsSnapshot = await getDocs(userAlbumsQuery);

        const albumsData = albumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserAlbums(albumsData);
      }
    };

    fetchUserAlbums();
  }, [user]);

  return (
    (userAlbums.length > 0) ? (
      <div className="libraryPlaylistsContainer">
        {userAlbums.map((album, index) => (
          <p key={index} onClick={() => albumClickHandler(album.id)}>
            {album.title}
          </p>
        ))}
      </div>
      ) : (
      <p className="noAlbums">Create an Album of your choice.</p>
    )
  );
}

export default LibraryAlbums;

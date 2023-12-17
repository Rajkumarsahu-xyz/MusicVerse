import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';

const ArtistDetailsPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const navigate = useNavigate();

  function handleAlbumCardClick(albumId) {
    navigate(`/album/${albumId}`);
  }

  useEffect(() => {
    const fetchArtistDetails = async () => {
      const artistDocRef = doc(db, 'artists', artistId);
      const artistDoc = await getDoc(artistDocRef);

      if (artistDoc.exists()) {
        const artistData = artistDoc.data();

        const albumDetailsPromises = artistData.Album.map(async (albumId) => {
          const albumDocRef = doc(db, 'albums', albumId);
          const albumDoc = await getDoc(albumDocRef);

          if (albumDoc.exists()) {
            const albumData = albumDoc.data();
            return { id: albumDoc.id, ...albumData };
          } else {
            console.error('Album not found:', albumId);
            return null;
          }
        });

        const albumDetails = await Promise.all(albumDetailsPromises);

        setArtist({ id: artistDoc.id, ...artistData, Album: albumDetails });
      } else {
        console.error('Artist not found');
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="artistDetailsContainer">
      <h1>{artist.name}</h1>
      <img src={artist.Album[0].coverImageUrl} alt={artist.name} />

      <div className="albumsListContainer">
        <h2>Albums</h2>
        <div className="albumsLists">
          {artist.Album.map((album, index) => (
            <div key={index} className='albumCardsForArtist' onClick={() => handleAlbumCardClick(album.id)}>
              <img className='albumImg' src={album.coverImageUrl} alt={album.title} />
              <div>
                  <h2>{album.title}</h2>
                  <h4>Genre - {album.songs[0].genre}</h4>
                  <h4>Tags - {album.songs[0].tags}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailsPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dataApi } from '../data';
import { useNavigate } from 'react-router-dom';

const ArtistDetailsPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  function handleAlbumCardClick(albumId) {
    navigate(`/album/${albumId}`);
  }

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const fetchedArtist = await dataApi.getArtistById(artistId);
        setArtist(fetchedArtist);

        const artistAlbums = await dataApi.fetchAlbumsByArtistId(artistId);
        setAlbums(artistAlbums);
      } catch (error) {
        console.error('Error fetching artist details:', error.message);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="artistDetailsContainer">
      <h1>{artist.displayName}</h1>
      <img src={artist.coverImageUrl} alt={artist.name} />

      <div className="albumsListContainer">
        <h2>Albums</h2>
        <div className="albumsLists">
          {albums.map((album) => (
            <div key={album.id} className="albumCardsForArtist" onClick={() => handleAlbumCardClick(album.id)}>
              <img className="albumImg" src={album.coverImageUrl} alt={album.title} />
              <h3>{album.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailsPage;

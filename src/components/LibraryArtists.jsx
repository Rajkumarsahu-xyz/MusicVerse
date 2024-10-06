import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const LibraryArtists = () => {
  const [followedArtists, setFollowedArtists] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      if (user) {
        const db = getFirestore();
        const userFollowingDoc = doc(db, 'following', user.uid);
        const docSnap = await getDoc(userFollowingDoc);

        if (docSnap.exists()) {
          const followedArtistIds = docSnap.data().artist_ids || [];
          const followedArtistsData = await Promise.all(
            followedArtistIds.map(async (artistId) => {
              const artistDoc = await getDoc(doc(db, 'artists', artistId));
              return { id: artistId, ...artistDoc.data() };
            })
          );
          setFollowedArtists(followedArtistsData);
        }
      }
    };

    fetchFollowedArtists();
  }, [user]);

  const artistClickHandler = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
      (followedArtists.length > 0) ? (
        <div className="libraryArtistsContainer">
        {followedArtists.map((artist) => (
          <p key={artist.id} onClick={() => artistClickHandler(artist.id)}>
            {artist.name}
          </p>
        ))}
        </div>
      ) : (
        <p className="noArtists">You are not following any artists yet.</p>
      )
    
  );
};

export default LibraryArtists;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../Firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteField, setDoc, collection } from 'firebase/firestore';
// import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { TiPlus } from "react-icons/ti";
import { GiCheckMark } from "react-icons/gi";
import { toast } from 'react-toastify';
import Loader from '../Loader';


const ArtistDetailsPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showUnfollowPopup, setShowUnfollowPopup] = useState(false); // For unfollow
  const user = auth.currentUser; // null if not signed in
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
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
            }
            return null; // Handle not found
          });

          const albumDetails = await Promise.all(albumDetailsPromises);
          setArtist({ id: artistDoc.id, ...artistData, Album: albumDetails });

          // If user is logged in, check following status
          if (user) {
            const followingDocRef = doc(db, 'following', user.uid);
            const followingDoc = await getDoc(followingDocRef);
            if (followingDoc.exists() && followingDoc.data().artist_ids.includes(artistId)) {
              setIsFollowing(true);
            }
          }
        } else {
          console.error('Artist not found');
        }
      } catch (error) {
        console.error('Error fetching artist details:', error);
      }
    };

    fetchArtistDetails();

    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [artistId, user]);

  // Handle album click
  function handleAlbumCardClick(albumId) {
    navigate(`/album/${albumId}`);
  }

  // Follow button click
  const handleFollow = () => {
    if (!user) {
      console.log("User is not signed in");
      // navigate("/");
      toast.error('Sign in to Follow an artist.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if(user.uid === artist.id) {
      console.log("Artist is signedin and tries to follow himself");
      toast.error('You cannot Follow yourself.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setShowNotificationPopup(true); // Show notification pop-up
  };

  // Unfollow button click
  const handleUnfollow = () => {
    if(!user) {
      console.log("User is not signed in");
      // navigate("/");
      toast.error('Sign in to Unfollow an artist.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setShowUnfollowPopup(true); // Show unfollow confirmation pop-up
  };

  // Handle follow + notification preference
  const handleNotificationChoice = async (choice) => {
    if (user) {
      const followingRef = doc(db, 'following', user.uid); // User's doc in 'following'
      const followersRef = doc(db, 'followers', artistId); // Artist's doc in 'followers'

      // Check if the user's "following" document exists
      const userFollowingDoc = await getDoc(followingRef);

      if (userFollowingDoc.exists()) {
        // Document exists, so we update it
        await updateDoc(followingRef, {
          artist_ids: arrayUnion(artistId),
          [`notifications.${artistId}`]: choice
        });
      } else {
        // Document doesn't exist, so we create it first
        await setDoc(followingRef, {
          artist_ids: [artistId],
          notifications: { [artistId]: choice }
        });
      }

      // Check if the artist's "followers" document exists
      const artistFollowersDoc = await getDoc(followersRef);

      if (artistFollowersDoc.exists()) {
        // Document exists, update it
        await updateDoc(followersRef, {
          user_ids: arrayUnion(user.uid),
          [`notifications.${user.uid}`]: choice
        });
      } else {
        // Document doesn't exist, create it
        await setDoc(followersRef, {
          user_ids: [user.uid],
          notifications: { [user.uid]: choice }
        });
      }

      setIsFollowing(true);
      setShowNotificationPopup(false);
    }
  };


  // Handle unfollow confirmation
  const confirmUnfollow = async () => {
    if (user) {
      const followingRef = collection(db, 'following');
      const followersRef = collection(db, 'followers');

      // Update "following" collection to remove artist and its notification
      const userFollowingDoc = doc(followingRef, user.uid);
      await updateDoc(userFollowingDoc, {
        artist_ids: arrayRemove(artistId),
        [`notifications.${artistId}`]: deleteField() // Delete artist from notifications map
      });

      // Update "followers" collection to remove user
      const artistFollowersDoc = doc(followersRef, artistId);
      await updateDoc(artistFollowersDoc, {
        user_ids: arrayRemove(user.uid),
        [`notifications.${user.uid}`]: deleteField() // Delete user from notifications map
      });

      setIsFollowing(false);
      setShowUnfollowPopup(false); // Close the unfollow confirmation
    }
  };

  if (!artist && loading) {
    return (
      <div className="artistDetailsContainer">
        <Loader />
      </div>
    );
  }
  
  if (!artist && !loading) {
    return (
      <div className='artistDetailsContainer'>
        <Loader />
        <div className='artistNotAvailableContainer'>
          <h2>Sorry !</h2>
          <h3>The Artist you're looking for is not Available.</h3>
        </div>
        <div className='pageNotFoundContainer'>
          <img src={"/assets/page_not_found_image6.png"} alt="Page Not Found" className='pageNotFoundImage' />
        </div>
      </div>
    );
  }

  return (
    <div className="artistDetailsContainer">
      <div className="artistHeader">
        <h1>{artist.name}</h1>
        <button className="followButton" onClick={isFollowing ? handleUnfollow : handleFollow}>
          <span>
            {isFollowing ? (
              <>
                <GiCheckMark size={18} style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '16px', fontWeight: 'bold'}}>Following</span>
              </>
            ) : (
              <>
                <TiPlus size={18} style={{ marginRight: '7px' }} />
                <span style={{ fontSize: '17px', fontWeight: 'bold'}}>Follow</span>
              </>
            )}
          </span>
        </button>
      </div>
      <img src={artist.Album[0].coverImageUrl} alt={artist.name} />

      <div className="albumsListContainer">
        <h2>Albums</h2>
        <div className="albumsLists">
          {artist.Album.map((album, index) => (
            <div key={index} className="albumCardsForArtist" onClick={() => handleAlbumCardClick(album.id)}>
              <img className="albumImg" src={album.coverImageUrl} alt={album.title} />
              <div>
                <h2>{album.title}</h2>
                <h4>Genre - {album.songs[0].genre}</h4>
                <h4>Tags - {album.songs[0].tags}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="popup-background">
          <div className="popup-container">
            <p className="popup-header">Do you want notifications for new releases from this artist?</p>
            <button onClick={() => handleNotificationChoice(true)}>YES</button>
            <button onClick={() => handleNotificationChoice(false)}>NO</button>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Popup */}
      {showUnfollowPopup && (
        <div className="popup-background">
          <div className="popup-container">
            <p className="popup-header">Are you sure you want to unfollow {artist.name}?</p>
            <button onClick={confirmUnfollow}>Yes, Unfollow</button>
            <button className="cancel-button" onClick={() => setShowUnfollowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ArtistDetailsPage;

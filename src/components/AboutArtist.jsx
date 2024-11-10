import React, { useEffect, useState } from "react";
import { usePlayback } from '../PlaybackContext';
import { db, auth } from '../Firebase';
import { TiPlus } from "react-icons/ti";
import { GiCheckMark } from "react-icons/gi";
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, collection, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AboutArtist = () => {
    const { currentSong } = usePlayback();
    const [isFollowing, setIsFollowing] = useState(false);
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [showUnfollowPopup, setShowUnfollowPopup] = useState(false); // For unfollow
    const user = auth.currentUser; // null if not signed in

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowingDetails = async () => {
            if (!user || !currentSong?.artistId) return;

            try {
                if (user && currentSong) {
                    const followingDocRef = doc(db, 'following', user.uid);
                    const followingDoc = await getDoc(followingDocRef);
                    if (followingDoc.exists() && followingDoc.data().artist_ids.includes(currentSong.artistId)) {
                        setIsFollowing(true);
                    } else {
                        setIsFollowing(false); // Set to false if not following
                    }
                } else {
                    setIsFollowing(false);
                    console.error('User or current song not found');
                }
            }
            catch(error) {
                console.error('Error fetching user details or currentsong:', error);
            }
        };
        fetchFollowingDetails();
    }, [user, currentSong])

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

        console.log(user.uid, currentSong.artistId);
        if(user.uid === currentSong.artistId) {
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
            const followersRef = doc(db, 'followers', currentSong.artistId); // Artist's doc in 'followers'

            // Check if the user's "following" document exists
            const userFollowingDoc = await getDoc(followingRef);

            if (userFollowingDoc.exists()) {
                // Document exists, so we update it
                await updateDoc(followingRef, {
                artist_ids: arrayUnion(currentSong.artistId),
                [`notifications.${currentSong.artistId}`]: choice
                });
            } else {
                // Document doesn't exist, so we create it first
                await setDoc(followingRef, {
                artist_ids: [currentSong.artistId],
                notifications: { [currentSong.artistId]: choice }
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
                artist_ids: arrayRemove(currentSong.artistId),
                [`notifications.${currentSong.artistId}`]: deleteField() // Delete artist from notifications map
            });

            // Update "followers" collection to remove user
            const artistFollowersDoc = doc(followersRef, currentSong.artistId);
            await updateDoc(artistFollowersDoc, {
                user_ids: arrayRemove(user.uid),
                [`notifications.${user.uid}`]: deleteField() // Delete user from notifications map
            });

            setIsFollowing(false);
            setShowUnfollowPopup(false); // Close the unfollow confirmation
        }
    };

    const handleArtistClick = () => {
        navigate(`/artist/${currentSong.artistId}`);
    };

    if (!currentSong) return null;

    return (
        <div className="aboutArtistContainer">
            <h4>About the Artist</h4>
            <img src={currentSong.imgUrl} alt={currentSong.title} />
            <div className="aboutTheArtist">
                <h3 className='artistName' onClick={handleArtistClick}>
                    {currentSong.artistName}
                </h3>
                <div>
                    <button className="followButtonAboutArtist" onClick={isFollowing ? handleUnfollow : handleFollow}>
                        <span>
                            {isFollowing ? (
                            <>
                                <GiCheckMark size={18} style={{ marginRight: '8px' }} />
                                <span style={{ fontSize: '15px', fontWeight: 'bold'}}>Following</span>
                            </>
                            ) : (
                            <>
                                <TiPlus size={18} style={{ marginRight: '7px' }} />
                                <span style={{ fontSize: '16px', fontWeight: 'bold'}}>Follow</span>
                            </>
                            )}
                        </span>
                    </button>
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
                    <p className="popup-header">Are you sure you want to unfollow {currentSong.artistName}?</p>
                    <button onClick={confirmUnfollow}>Yes, Unfollow</button>
                    <button className="cancel-button" onClick={() => setShowUnfollowPopup(false)}>Cancel</button>
                </div>
                </div>
            )}
        </div>
    );
}

export default AboutArtist;
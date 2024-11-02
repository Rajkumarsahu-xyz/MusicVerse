import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { usePlayback } from './../PlaybackContext';
import Like from '../Like';
import { auth, db } from '../Firebase';
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Playbar() {
  const { isPlaying, currentAudioUrl, currentSong, playPauseToggle, currentTime, setCurrentTime } = usePlayback();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const user = auth.currentUser;
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {

    setIsLoading(true);

    const userId = user?.uid;
    const songId = currentSong?.songId;

    if (userId && songId) {
      const likesRef = collection(db, 'likes');

      getDocs(query(likesRef, where('user_id', '==', userId), where('song_id', '==', songId)))
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        })
        .catch((error) => {
          console.error('Error checking likes:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLiked(false);
      setIsLoading(false);
    }

    if (!audioRef.current) return;

    const updateProgress = () => {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressBarRef.current.style.width = `${percentage}%`;
      setCurrentTime(audioRef.current.currentTime);
    };
    
    const cleanupRef = { current: () => {} };

    audioRef.current.addEventListener('timeupdate', updateProgress);

    cleanupRef.current = () => {
      audioRef.current.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentSong, setCurrentTime, user?.uid]);


  const handleLikeClick = () => {
    const userId = user?.uid;
    const songId = currentSong?.songId;
  
    if (userId && songId) {
      const likesRef = collection(db, 'likes');

      getDocs(query(likesRef, where('user_id', '==', userId), where('song_id', '==', songId)))
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const likeDoc = querySnapshot.docs[0];
            deleteDoc(likeDoc.ref);
            setIsLiked(false);
          } else {
            addDoc(likesRef, { user_id: userId, song_id: songId, isLiked: true })
              .then(() => setIsLiked(true))
              .catch((error) => console.error('Error adding like:', error));
          }
        })
        .catch((error) => {
          console.error('Error checking likes:', error);
        });
    }

    else {
      console.log("User is not signed in");
      toast.error('Sign in to Like a song.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  

  const handleProgressBarClick = (e) => {
    if (!isPlaying) {
      return;
    }
    const progressBar = document.getElementById('progressBar');

    const newTime = ((e.nativeEvent.offsetX/progressBar.getBoundingClientRect().width)*duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlay = async() => {
      if(!isPlaying) {
        return;
      }
      console.log(currentSong.artistId);
      playPauseToggle(currentAudioUrl, currentSong.title, currentSong.artistId, currentSong.imgUrl, currentSong.songId, currentSong.artistName, currentTime);
  };

  const handleTimeUpdate = () => {
    setDuration(audioRef.current.duration);
  };

  const handleArtistClick = () => {
    console.log(currentSong.artistId);
    navigate(`/artist/${currentSong.artistId}`);
  };

  return (
    <div className='playbarContainer'>
      <div className='songDetails'>
        {currentSong && 
          <div>
            <img src={currentSong.imgUrl} alt='Album Cover' className='currentPlayingSongImage'/>
            <div className='songNameNArtist'>
              <h3>{currentSong.title}</h3>
              <p className='artistName' onClick={handleArtistClick}>
                {currentSong.artistName}
              </p>
            </div>
          </div>
        }
        {!isLoading && isPlaying && <Like isLiked={isLiked} onClick={handleLikeClick} />}
      </div>

      <div className='audioPlayer'>
        <div className='audioControllers'>
          <div className='audioButton' onClick={togglePlay}>
            {isPlaying ? <FaPause className='playbarPlay' /> : <FaPlay className='playbarPause' />}
          </div>
        </div>

        <div className="progress-container" >
          <span className="current-time">{formatTime(currentTime)}</span>
          {<audio ref={audioRef} id='audio-element' src={currentAudioUrl} autoPlay={isPlaying} onTimeUpdate={handleTimeUpdate} ></audio>}
          <div className="progressBar" id="progressBar" onClick={handleProgressBarClick}>
            <div id='progress' ref={progressBarRef}></div>
          </div>
          <span className="duration">{(duration) ? formatTime(duration) : formatTime(0)}</span>
        </div>
      </div>
    </div>
  );
}

export default Playbar;


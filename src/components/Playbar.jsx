import React, { useEffect, useRef, useState } from 'react';
// import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
// import { HiOutlineQueueList } from 'react-icons/hi2';
import { usePlayback } from './../PlaybackContext';

function Playbar() {
  const { isPlaying, currentAudioUrl, currentSong, playPauseToggle, currentTime, setCurrentTime } = usePlayback();
  // const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {

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
  }, [currentSong, setCurrentTime]);
  
  

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
      playPauseToggle(currentAudioUrl, currentSong.title, currentSong.artistId, currentSong.imgUrl, currentSong.songId, currentTime);
  };

  const handleTimeUpdate = () => {
    setDuration(audioRef.current.duration);
  };


  return (
    <div className='playbarContainer'>
      <div className='songDetails'>
        {currentSong && (
          <div>
            <img src={currentSong.imgUrl} alt='Album Cover' className='currentPlayingSongImage'/>
            <div>
              <h3>{currentSong.title}</h3>
              <p>{currentSong.artistId}</p>
            </div>
          </div>
        )}
      </div>

      <div className='audioPlayer'>
        <div className='audioControllers'>
          {/* <MdSkipPrevious className='prevSong' /> */}
          <div onClick={togglePlay}>
            {isPlaying ? <FaPause className='playbarPlay' /> : <FaPlay className='playbarPause' />}
          </div>
          {/* <MdSkipNext className='nextSong' /> */}
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

      <div className='queueBtnDiv'>
        {/* <HiOutlineQueueList className='queueBtn' /> */}
      </div>
    </div>
  );
}

export default Playbar;


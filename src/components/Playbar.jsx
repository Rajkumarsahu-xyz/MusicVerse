import React, { useEffect, useRef, useState } from 'react';
import { dataApi } from '../data';
import { FaPlay, FaPause } from 'react-icons/fa';

function Playbar() {
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    const fetchData = async () => {
      const songsData = await dataApi.fetchSongs();
      setPlayingSong(songsData[0]);
    };

    fetchData();
  }, []);

  return (
    <div className="playbarContainer">
      <div className="playbarContent">
        <div className="songInfo">
          {/* <h4>{playingSong?.title}</h4> */}
          <audio
            ref={audioRef}
            src={playingSong?.url}
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onEnded={() => {
              setPlayingSong(null);
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        </div>
        <div className="playControls">
          <div className="playPauseButton" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </div>
          <div className="progressBar">
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playbar;

import React, { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const playPauseToggle = (audioUrl, title, artistId, imgUrl, songId, currentTime) => {
    if (isPlaying && songId === currentSong?.songId) {
      // localStorage.setItem('currentPlayback', JSON.stringify({ currentSong, currentTime:currentTimeforstoring, currentAudioUrl }));
      
      // console.log(currentTimeforstoring);
      setIsPlaying(false);
      setCurrentAudioUrl('');
      setCurrentSong(null);
      setCurrentTime(0);
      // console.log(currentTime);
      
    } 
    else {
      // const storedPlayback = JSON.parse(localStorage.getItem('currentPlayback'));
      setIsPlaying(true);
      setCurrentAudioUrl(audioUrl);
      setCurrentSong({ title, artistId, imgUrl, songId });
      // console.log(currentTimeforstoring);
      
      setCurrentTime(currentTime || 0);
      // setCurrentAudioUrl(storedPlayback?.currentAudioUrl || '');
    }
  };

  return (
    <PlaybackContext.Provider value={{ isPlaying, currentAudioUrl, currentSong, setCurrentSong, playPauseToggle, currentTime, setCurrentTime }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

import React, { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const playPauseToggle = (audioUrl, title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName, currentTime) => {
    if (isPlaying && songId === currentSong?.songId) {
      setIsPlaying(false);
      setCurrentAudioUrl('');
      setCurrentSong(null);
      setCurrentTime(0);
    } 
    else {
      setIsPlaying(true);
      setCurrentAudioUrl(audioUrl);
      setCurrentSong({ title, artistId, imgUrl, songId, artistName, genre, tags, albumId, albumName });
      setCurrentTime(currentTime || 0);
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

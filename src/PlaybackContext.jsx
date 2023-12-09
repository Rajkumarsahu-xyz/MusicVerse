import React, { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [playingSong, setPlayingSong] = useState(null);

  const playSong = (songId) => {
    setPlayingSong(songId);
  };

  const pauseSong = () => {
    setPlayingSong(null);
  };

  return (
    <PlaybackContext.Provider value={{ playingSong, playSong, pauseSong }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  return useContext(PlaybackContext);
};

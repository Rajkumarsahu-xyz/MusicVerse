
import React, { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();


// export const PlaybackProvider = ({ children }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentAudioUrl, setCurrentAudioUrl] = useState('');
//   const [currentSong, setCurrentSong] = useState(null);
//   const [currentTime, setCurrentTime] = useState(0);

//   const [previousAudioUrl, setPreviousAudioUrl] = useState('');
//   const [previousSong, setPreviousSong] = useState(null);
//   const [previousTime, setPreviousTime] = useState(0);

//   const playPauseToggle = (audioUrl, title, artist, imgUrl, songId, startTime = 0) => {
//     console.log('Toggle:', audioUrl, title, artist, imgUrl, songId, startTime);
//     if (isPlaying && songId === currentSong?.songId) {
//       setIsPlaying(false);

//       setPreviousAudioUrl(currentAudioUrl);
//       setPreviousSong(currentSong);
//       setPreviousTime(currentTime);

//       setCurrentAudioUrl('');
//       setCurrentSong(null);
//     } else {
//       setIsPlaying(true);
//       console.log(audioUrl);
//       console.log(previousAudioUrl);
//       console.log(previousSong);
//       if (previousAudioUrl && previousSong) {
//         // If resuming from pause, use previous playback details
//         console.log("raj");
//         setCurrentAudioUrl(previousAudioUrl);
//         setCurrentSong(previousSong);
//         setCurrentTime(previousTime);
//       }
//       else {
//         setCurrentAudioUrl(audioUrl);
//         setCurrentSong({ title, artist, imgUrl, songId });
//         setCurrentTime(startTime);
//       }
//     }
//   };

//   return (
//     <PlaybackContext.Provider value={{ isPlaying, currentAudioUrl, setCurrentAudioUrl, currentSong, setCurrentSong, playPauseToggle, currentTime, previousAudioUrl, previousSong, previousTime }}>
//       {children}
//     </PlaybackContext.Provider>
//   );
// };


export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [currentSong, setCurrentSong] = useState(null);

  const playPauseToggle = (audioUrl, title, artistId, imgUrl, songId) => {
    if (isPlaying && songId === currentSong.songId) {
      setIsPlaying(false);
      setCurrentAudioUrl('');
      setCurrentSong(null);
    } else {
      setIsPlaying(true);
      setCurrentAudioUrl(audioUrl);
      setCurrentSong({ title, artistId, imgUrl, songId });
    }
  };

  return (
    <PlaybackContext.Provider value={{ isPlaying, currentAudioUrl, currentSong, setCurrentSong, playPauseToggle }}>
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




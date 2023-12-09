import React, { useEffect, useRef, useState } from 'react';
import { dataApi } from '../data';
import { FaPlay, FaPause } from 'react-icons/fa';

function SongsComponent() {
    const [songs, setSongs] = useState([]);
    const [playingSong, setPlayingSong] = useState(null);
    const audioRef = useRef({});

    const handlePlayPause = (songId) => {
        console.log(songId, playingSong)
        const audio = audioRef.current[songId];

        if (playingSong === songId) {
          if (audio.paused) {
            audio.play();
          } else {
            audio.pause();
            setPlayingSong(null);
          }
        } else {
          if (playingSong !== null) {
            audioRef.current[playingSong].pause();
          }
          audio.play();
          setPlayingSong(songId);
        }
    };

    useEffect(() => {
        let songsData;
        const fetchData = async () => {
              songsData = await dataApi.fetchSongs();
            //   console.log(songsData);
              const filteredSongs = songsData.slice(0, 4);
              setSongs(filteredSongs);
        };

        fetchData();
    }, [])

    return (
        <div className='songsContainer'>
            <h2>Songs</h2>

            <div className='songsItems'>
                {
                    songs.map((song) => (
                        <div key={song.id} className='songCard'>
                            <h4>{song.title}</h4>
                            <div>
                                {playingSong === song.id ? (
                                    <FaPause className='playPauseButton' onClick={() => handlePlayPause(song.id)} />
                                ) : (
                                    <FaPlay className='playPauseButton' onClick={() => handlePlayPause(song.id)} />
                                )}
                            </div>
                            <audio  controls={false} autoPlay={playingSong === song.id} ref={(audio) => (audioRef.current[song.id] = audio)} onEnded={() => setPlayingSong(null)}>
                                <source src={song.url} type='audio/mp3'/>
                            </audio>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default SongsComponent;

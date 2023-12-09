import React, { useState, useEffect } from 'react';
import { dataApi, userAuthApi } from '../data';

const CreatePlaylistPage = () => {
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [songs, setSongs] = useState([]);
  const userId = userAuthApi.users[1].id;

  useEffect(() => {
    const fetchData = async () => {
      const playlistsData = await dataApi.fetchPlaylists();
      setPlaylist(playlistsData);

      const songsData = await dataApi.fetchSongs();
      setSongs(songsData);
    };

    fetchData();
  }, []);

  const handleCreatePlaylist = async () => {
    setPlaylist(await dataApi.createPlaylist({ title: playlistTitle, userId }));
    // setPlaylists([...playlists, newPlaylist]);
    setPlaylistTitle('');
  };

  const handleAddToPlaylist = async () => {
    console.log(selectedSongs[0].id);
    const selectedSongIds = selectedSongs.map(song => song.id);
    console.log(selectedSongIds);
    await dataApi.addSongsToPlaylist({ playlistId: playlist.id, songIds: selectedSongIds });
    setSelectedSongs([]);
  };

  return (
    <div className="createPlaylistContainer">
      <h1>Create New Playlist</h1>
      <div className="inputContainer">
        <label>Playlist Title:</label>
        <input type="text" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)} />
      </div>
      <div className="buttonContainer">
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
      </div>

      <div className="addSongContainer">
        <h3>Add Songs To The Playlist</h3>
        <div className="inputContainer">
          <label>Select Songs:</label>
          <select
            multiple
            value={selectedSongs.map(song => song.id)}
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
            //   console.log(songs);
              const selectedSongs = songs.filter(song => selectedIds.includes(song.id));
              setSelectedSongs(selectedSongs);
            }}
          >
            {songs.map(song => (
              <option key={song.id} value={song.id}>{song.title}</option>
            ))}
          </select>
        </div>
        <div className="buttonContainer">
          <button onClick={handleAddToPlaylist}>Add to Playlist</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
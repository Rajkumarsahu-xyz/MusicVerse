import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BiLibrary } from "react-icons/bi";
import LibraryPlaylists from "./LibraryPlaylists";
import LibraryAlbums from "./LibraryAlbums";
import {Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './../Firebase';
import Loader from "../Loader";
import { toast } from "react-toastify";

const auth = getAuth(app);

function YourLibrary() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function PlaylistsClicked() {
    navigate('/playlists');
  }
  function AlbumsClicked() {
    navigate('/albums');
  }

  const handleOptionClick = (option) => {
    setShowDropdown(false);
    if (option === "album") {
        onAuthStateChanged(auth, (user) => {
            if(!user) {
                console.log("User is not signed in");
                navigate("/");
                toast.error('You must be signed in to create an album.', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
            }
            else {
                console.log("User is signed in");
                navigate("/createAlbum");
            }
        })
    } 
    else if (option === "playlist") {
        onAuthStateChanged(auth, (user) => {
            if(!user) {
                console.log("User is not signed in");
                navigate("/");
                toast.error('You must be signed in to create a playlist.', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
            }
            else {
                console.log("User is signed in");
                navigate("/createPlaylist");
            }
        })
    }
  };

  return (
    <div className="yourLibrary">
      <div className="libraryHeading">
        <BiLibrary className="libraryIcon" />
        <h2>Your Library</h2>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <IoMdAdd className="create-Btn" />
        </div>
        {showDropdown && (
          <div className="dropdown-content">
            <ul>
              <li onClick={() => handleOptionClick("album")}>Create Album</li>
              <li onClick={() => handleOptionClick("playlist")}>
                Create Playlist
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="libraryOptions">
          <h3 className={`libraryOptionsTab ${location.pathname === "/playlists" ? "active" : ""}`} onClick={PlaylistsClicked}>Playlists</h3>
          <h3 className={`libraryOptionsTab ${location.pathname === "/albums" ? "active" : ""}`} onClick={AlbumsClicked}>Albums</h3>
      </div>

        {user ? (
          <Routes>
            <Route path={"/"} element={<Loader><LibraryPlaylists /></Loader>} />
            <Route path={"/playlists"} element={<Loader><LibraryPlaylists /></Loader>} />
            <Route path={"/albums"} element={<Loader><LibraryAlbums /></Loader>} />
            <Route path={"/createAlbum"} element={<Loader><LibraryPlaylists /></Loader>} />
            <Route path={"/createAlbum"} element={<Loader><LibraryAlbums /></Loader>} />
            <Route path={"/createPlaylist"} element={<Loader><LibraryPlaylists /></Loader>} />
            <Route path={"/createPlaylist"} element={<Loader><LibraryAlbums /></Loader>} />
            <Route path="/album/:albumId" element={<Loader><LibraryPlaylists/></Loader>} />
            <Route path="/album/:albumId" element={<Loader><LibraryAlbums/></Loader>} />
            <Route path="/playlist/:playlistId" element={<Loader><LibraryPlaylists/></Loader>} />
            <Route path="/playlist/:playlistId" element={<Loader><LibraryAlbums/></Loader>} />
            <Route path="/artist/:artistId" element={<Loader><LibraryPlaylists/></Loader>} />
            <Route path="/artist/:artistId" element={<Loader><LibraryAlbums/></Loader>} />
          </Routes>

          ) : (
            <p>Please sign in to view your library.</p>
        )}
    </div>
  );
}

export default YourLibrary;

import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { VscLibrary } from "react-icons/vsc";
import LibraryPlaylists from "./LibraryPlaylists";
import LibraryAlbums from "./LibraryAlbums";
import LibraryArtists from "./LibraryArtists"; // Import LibraryArtists
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './../Firebase';
import Loader from "../Loader";
import { toast } from "react-toastify";
import { Tooltip } from 'react-tooltip';

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
  function ArtistsClicked() {
    navigate('/artists'); // Navigate to artists
  }

  const handleOptionClick = (option) => {
    setShowDropdown(false);
    if (option === "album") {
        onAuthStateChanged(auth, (user) => {
            if(!user) {
                console.log("User is not signed in");
                navigate("/");
                toast.error('Sign in to create an album.', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
            } else {
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
                toast.error('Sign in to create a playlist.', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
            } else {
                console.log("User is signed in");
                navigate("/createPlaylist");
            }
        })
    }
  };

  return (
    <div className="yourLibrary">
      <div className="libraryHeading">
        <VscLibrary className="libraryIcon" />
        <h2>Your Library</h2>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <IoMdAdd className="create-Btn" data-tooltip-id="my-tooltip" data-tooltip-content="Create Album / Playlist" data-tooltip-place="top"/>
          <Tooltip id="my-tooltip" />
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
          <h3 className={`libraryOptionsTab ${location.pathname === "/artists" ? "active" : ""}`} onClick={ArtistsClicked}>Artists</h3> {/* New Artists Tab */}
      </div>

      {user ? (
        <Routes>
          <Route path={"/"} element={<Loader><LibraryPlaylists /></Loader>} />
          <Route path={"/playlists"} element={<Loader><LibraryPlaylists /></Loader>} />
          <Route path={"/albums"} element={<Loader><LibraryAlbums /></Loader>} />
          <Route path={"/artists"} element={<Loader><LibraryArtists /></Loader>} />
          <Route path='/liked-songs' element={<Loader><LibraryPlaylists /></Loader>}/>
          <Route path={"/createAlbum"} element={<Loader><LibraryAlbums /></Loader>} />
          <Route path={"/createPlaylist"} element={<Loader><LibraryPlaylists /></Loader>} />
          <Route path="/album/:albumId" element={<Loader><LibraryAlbums/></Loader>} />
          <Route path="/playlist/:playlistId" element={<Loader><LibraryPlaylists/></Loader>} />
          <Route path="/artist/:artistId" element={<Loader><LibraryArtists/></Loader>} />
          <Route path="*" element={<Loader><LibraryPlaylists/></Loader>} />
        </Routes>
      ) : (
        <p>Please sign in to view your library.</p>
      )}
    </div>
  );
}

export default YourLibrary;

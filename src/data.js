function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  class UserAuthApi {
    constructor() {
      this.users = {
        1: {
          id: 1,
          displayName: "User 1",
          coverImageUrl:
            "https://images.unsplash.com/photo-1536594527669-2f555de54e95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGd1aXRhcnxlbnwwfDB8MHx8fDA%3D",
        },
        2: {
          id: 2,
          displayName: "User 2",
          coverImageUrl:
            "https://images.unsplash.com/photo-1536594527669-2f555de54e95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGd1aXRhcnxlbnwwfDB8MHx8fDA%3D",
        },
        3: {
          id: 3,
          displayName: "User 3",
          coverImageUrl:
            "https://images.unsplash.com/photo-1536594527669-2f555de54e95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGd1aXRhcnxlbnwwfDB8MHx8fDA%3D",
        },
      };
    }
  
    async signIn({ id }) {
      await delay(1000);
      localStorage.setItem("auth:signedInUserId", id);
      return this.users[id];
    }
  
    async getSignedInUser() {
      await delay(100);
      const signedInUserId = localStorage.getItem("auth:signedInUserId");
      if (!signedInUserId) {
        return null;
      }
      return this.users[signedInUserId];
    }
  
    async signOut() {
      await delay(100);
      localStorage.removeItem("auth:signedInUserId");
    }
  }
  
  export const userAuthApi = new UserAuthApi();
  
  function generateUuid() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  
  class DataApi {
    constructor() {
      if (!localStorage.getItem("data:artists")) {
        this.initializeData();
      }
    }
    initializeData() {
      const initialArtists = [];
      const initialAlbums = [];
      const initialSongs = [];
      for (let i = 1; i <= 3; i++) {
        const artist = userAuthApi.users[i];
        initialArtists.push(artist);
        for (let i = 1; i <= 10; i++) {
          const album = {
            id: generateUuid(),
            title: `Album ${i} by ${artist.displayName}`,
            artistId: artist.id,
            coverImageUrl:
              "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWxidW0lMjBhcnR8ZW58MHwwfDB8fHww",
          };
          initialAlbums.push(album);
          for (let i = 1; i <= 10; i++) {
            const song = {
              id: generateUuid(),
              title: `Song ${i} from ${album.title}`,
              albumId: album.id,
              duration: 372,
              url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            };
            initialSongs.push(song);
          }
        }
      }
      localStorage.setItem("data:artists", JSON.stringify(initialArtists));
      localStorage.setItem("data:albums", JSON.stringify(initialAlbums));
      localStorage.setItem("data:songs", JSON.stringify(initialSongs));
    }
  
    async fetchAlbumsByArtistId({ artistId }) {
      await delay(500);
      const albums = JSON.parse(localStorage.getItem("data:albums"));
      return albums.filter((album) => album.artistId === artistId);
    }
  
    
    async fetchSongs() {
      await delay(500);
      const songs = JSON.parse(localStorage.getItem("data:songs")) || [];
      return songs;
    }
    
    async fetchArtists() {
      await delay(500);
      const artists = JSON.parse(localStorage.getItem("data:artists")) || [];
      return artists;
    }

    async fetchAlbums() {
      await delay(500);
      const albums = JSON.parse(localStorage.getItem("data:albums")) || [];
      return albums;
    }

    async fetchPlaylists() {
      await delay(500);
      const playlists = JSON.parse(localStorage.getItem("data:playlists")) || [];
      return playlists;
    }
    
    async createAlbum({ title, artistId, coverImageUrl }) {
      await delay(500);
      const albums = JSON.parse(localStorage.getItem("data:albums"));
      // console.log(title, artistId, coverImageUrl);
      const album = {
        id: generateUuid(),
        title: title,
        artistId: artistId,
        coverImageUrl: coverImageUrl,
      };
      albums.push(album);
      localStorage.setItem("data:albums", JSON.stringify(albums));
      return album;
    }

    async addSongsToAlbum({ albumId, songTitle, songUrl }) {
      await delay(500);
      const songs = JSON.parse(localStorage.getItem("data:songs")) || [];
      
      const newSong = {
        id: generateUuid(),
        title: songTitle,
        albumId: albumId,
        duration: 372,
        url: songUrl,
      };

      songs.push(newSong);
      localStorage.setItem("data:songs", JSON.stringify(songs));
      return newSong;
    }

    async createPlaylist({ title, userId }) {
      await delay(500);
      const playlists = JSON.parse(localStorage.getItem("data:playlists")) || [];
      
      const newPlaylist = {
        id: generateUuid(),
        title: title,
        userId: userId,
        songIds: [],
      };

      playlists.push(newPlaylist);
      localStorage.setItem("data:playlists", JSON.stringify(playlists));
      return newPlaylist;
    }


    async addSongsToPlaylist({ playlistId, songIds }) {
      await delay(500);
      const playlists = JSON.parse(localStorage.getItem("data:playlists")) || [];
      console.log(playlists);
      const playlistIndex = playlists.findIndex((playlist) => playlist.id === playlistId);
      console.log(playlistIndex);

      playlists[playlistIndex].songIds = [...playlists[playlistIndex].songIds, ...songIds];
      
      localStorage.setItem("data:playlists", JSON.stringify(playlists));
      return playlists[playlistIndex];
    }

  }
  
  export const dataApi = new DataApi();
  
  // for debugging purposes
  window.dataApi = dataApi;
  window.userAuthApi = userAuthApi;
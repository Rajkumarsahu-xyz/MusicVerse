
import React, { useEffect, useState } from 'react';
// import { dataApi } from '../data';
import { useNavigate } from 'react-router-dom';
import { collection, getDoc, getDocs, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '../Firebase';

function ArtistsComponent() {
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();

    function handleArtistCardClick(artistId) {
        navigate(`/artist/${artistId}`);
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const artistsData = await dataApi.fetchArtists();
    //         // console.log(artistsData);
    //         const filteredArtists = artistsData.slice(0, 4);
    //         setArtists(filteredArtists);
    //     };

    //     fetchData();
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            const artistsCollection = collection(db, 'artists');
            const artistsSnapshot = await getDocs(artistsCollection);

            const artistsData = await Promise.all(
                artistsSnapshot.docs.map(async (doc) => {
                    const artist = { id: doc.id, ...doc.data() };

                    // Assuming there's a field like 'Album' in the artist document
                    if (artist.Album) {
                    const firstAlbumId = artist.Album[0];

                    // Fetch the album details based on the first album ID
                    // const albumDoc = await getDoc(doc(db, 'albums', firstAlbumId));
                    const albumDoc = await getDoc(firestoreDoc(db, 'albums', firstAlbumId));
                    const albumData = albumDoc.data();

                    // Get the cover image URL from the album data
                    artist.coverImageUrl = albumData ? albumData.coverImageUrl : null;
                    }

                    return artist;
                })
            );
            
          setArtists(artistsData.slice(0,4));
        };
    
        fetchData();
      }, []);

    return (
        <div className='artistsContainer'>
            <h2>Artists</h2>

            <div className='artistsItems'>
                {
                    artists.map((artist) => (
                        <div key={artist.id} className='artistCard' onClick={()  => handleArtistCardClick(artist.id)}>
                            <img className='artistImg' src={artist.coverImageUrl} alt="" />
                            <h4>{artist.name}</h4>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ArtistsComponent;
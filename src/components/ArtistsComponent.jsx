
import React, { useEffect, useState } from 'react';
import { dataApi } from '../data';
import { useNavigate } from 'react-router-dom';

function ArtistsComponent() {
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();

    function handleArtistCardClick(artistId) {
        navigate(`/artist/${artistId}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            const artistsData = await dataApi.fetchArtists();
            // console.log(artistsData);
            const filteredArtists = artistsData.slice(0, 4);
            setArtists(filteredArtists);
        };

        fetchData();
    }, [])

    return (
        <div className='artistsContainer'>
            <h2>Artists</h2>

            <div className='artistsItems'>
                {
                    artists.map((artist) => (
                        <div key={artist.id} className='artistCard' onClick={()  => handleArtistCardClick(artist.id)}>
                            <img className='artistImg' src={artist.coverImageUrl} alt="" />
                            <h4>{artist.displayName}</h4>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ArtistsComponent;
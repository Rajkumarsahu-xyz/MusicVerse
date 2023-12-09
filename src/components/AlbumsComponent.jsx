import React, { useEffect, useState } from 'react';
import { dataApi } from '../data';

function AlbumsComponent() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const albumsData = await dataApi.fetchAlbums();
            // console.log(albumsData);
            const filteredAlbums = albumsData.slice(0, 4);
            setAlbums(filteredAlbums);
        };

        fetchData();
    }, [])

    return (
        <div className='albumsContainer'>
            <h2>Albums</h2>

            <div className='albumsItems'>
                {
                    albums.map((artist) => (
                        <div key={artist.id} className='albumCard'>
                            <img className='albumImg' src={artist.coverImageUrl} alt="" />
                            <h4>{artist.title}</h4>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default AlbumsComponent;
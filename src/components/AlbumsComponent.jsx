import React, { useEffect, useState } from 'react';
import { dataApi } from '../data';
import { useNavigate } from 'react-router-dom';

function AlbumsComponent() {
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();

    function handleAlbumCardClick(albumId) {
        navigate(`/album/${albumId}`);
    }

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
                    albums.map((album) => (
                        <div key={album.id} className='albumCard' onClick={() => handleAlbumCardClick(album.id)}>
                            <img className='albumImg' src={album.coverImageUrl} alt="" />
                            <h4>{album.title}</h4>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default AlbumsComponent;
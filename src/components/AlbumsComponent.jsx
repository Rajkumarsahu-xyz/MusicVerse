import React, { useEffect, useState } from 'react';
// import { dataApi } from '../data';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

function AlbumsComponent() {
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();

    function handleAlbumCardClick(albumId) {
        navigate(`/album/${albumId}`);
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const albumsData = await dataApi.fetchAlbums();
    //         // console.log(albumsData);
    //         const filteredAlbums = albumsData.slice(0, 4);
    //         setAlbums(filteredAlbums);
    //     };

    //     fetchData();
    // }, [])

    useEffect(() => {
        const fetchAlbums = async () => {
          const albumsCollection = collection(db, 'albums');
          const albumsSnapshot = await getDocs(albumsCollection);
    
          // console.log(albumsSnapshot.docs.map(doc => doc.data()));
    
          const albumsData = albumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const limitedAlbums = albumsData.slice(0, 4);
    
          console.log(limitedAlbums);
          setAlbums(limitedAlbums);
        };
    
        fetchAlbums();
      }, []);

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
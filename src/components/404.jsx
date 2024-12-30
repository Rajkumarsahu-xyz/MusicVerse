import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="pnf_404_container">
      <img src='/assets/404 Error Page not Found with people connecting a plug-pana.png' alt='404_img' className='pnf_404_image'/>
      <Link to="/" className="home-link">Go back to Home</Link>
    </div>
  );
};

export default NotFound;

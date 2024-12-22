import React, { useState, useEffect } from 'react';

const Loader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <span className='loader'></span>
          <img src={"/loader_image.png"} alt="Static Icon" className="loader-image" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Loader;

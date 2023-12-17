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
        <span className='loader'></span>
      ) : (
        children
      )}
    </div>
  );
};

export default Loader;

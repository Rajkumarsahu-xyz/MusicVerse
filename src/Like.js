import React from 'react';
import { FaHeart } from "react-icons/fa";

const Like = ({ isLiked, onClick }) => {
  return (
    <div onClick={onClick} style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }}>
      <FaHeart className='likeBtn' />
    </div>
  );
};

export default Like;
import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import SignInOut from '../SignInOut';
import { auth } from '../Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function TopHeader() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate('/');
      }
    
      const goBack = () => {
        navigate(-1);
      };
    
      const goForward = () => {
        navigate(1);
      };

    return (
        <div className='topHeaderContainer'>
            <div>
                <MdArrowBackIosNew className="arrowheads" onClick={goBack}/>
                <MdArrowForwardIos className="arrowheads" onClick={goForward}/>
            </div>
            <div className='logo'>
                <FaSpotify className='spotifyLogo' onClick={handleLogoClick}/>
                <h1 onClick={handleLogoClick}>Spotify</h1>
            </div>
            <SignInOut/>
            <div className='loginMsg'>
                {user && <h1>Welcome, {user.displayName || 'User'}!</h1>}
            </div>
        </div>
    );
}

export default TopHeader;
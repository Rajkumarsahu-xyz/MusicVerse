import React from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import SignInOut from '../SignInOut';
import { Tooltip } from 'react-tooltip';

function TopHeader() {
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
                <MdArrowBackIosNew className="arrowheads" onClick={goBack} data-tooltip-id="my-tooltip" data-tooltip-content="Go Back" data-tooltip-place="bottom"/>
                <MdArrowForwardIos className="arrowheads" onClick={goForward} data-tooltip-id="my-tooltip" data-tooltip-content="Go Forward" data-tooltip-place="bottom"/>
                <Tooltip id="my-tooltip" />
            </div>
            <div className='logo'>
                <img src={"/assets/musicverse_logo.png"} alt="MusicVerse Logo" className='mainLogo' onClick={handleLogoClick}/> 
            </div>
            <SignInOut/>
        </div>
    );
}

export default TopHeader;
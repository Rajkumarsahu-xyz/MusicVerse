import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import YourLibrary from "./YourLibrary";
import { useNavigate } from "react-router-dom";

function LeftSideContainer() {
    const navigate = useNavigate();
    function clickHandler() {
        navigate('/');
    }
    return (
        <div className="leftSideContainer">
            <div onClick={clickHandler} className="home-btn">
                <GoHomeFill className="home-icon"/>
                <h2>Home</h2>
            </div>

            <div className="search-btn">
                <IoSearchSharp className="search-icon"/>
                <h2>Search</h2>
            </div>

            <YourLibrary/>
                
        </div>
    );
}

export default LeftSideContainer;
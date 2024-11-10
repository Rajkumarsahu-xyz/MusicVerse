import React from "react";
import AboutAlbum from "./AboutAlbum";
import AboutArtist from "./AboutArtist";

const RightSideContainer = () => {
    return (
        <div className="rightSideContainer">
            <AboutAlbum />
            <AboutArtist />
        </div>
    );
}

export default RightSideContainer;
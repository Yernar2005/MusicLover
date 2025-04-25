import React from 'react';

import PopularContent  from "../../components/main/PopularContent.tsx";
import MediaLibrary from "../../components/main/MediaLibrary.tsx";
import "../styles/home.scss"
import Header from "../../components/main/Header.tsx";

const Home:React.FC = () => {

    return (
      <div className="home-container">
        <Header/>
        <div className="home-container-content">
            <MediaLibrary/>
            <PopularContent/>
        </div>
      </div>
    );
};

export default Home;
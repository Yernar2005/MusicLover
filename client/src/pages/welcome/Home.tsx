import React from 'react';
import PopularContent from '../../components/main/PopularContent.tsx';

import '../styles/home.scss';
import Header from '../../components/main/Header.tsx';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <Header />
            <div className="home-container-content">
                <PopularContent />
            </div>
        </div>
    );
};

export default Home;

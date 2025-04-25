import React, {useState} from 'react';
import {Home} from "lucide-react"


import "./style/header.scss"
import {useNavigate} from "react-router-dom";

const Header: React.FC = () => {
    const [search, setSearch] = useState<string>("")
    const navigate = useNavigate()

    const handleStartPage = () => {
        navigate("/main")
    }
    const onRegister = () => {
        navigate("/auth/registration")

    }

    const onLogin = () => {
        navigate("/auth/login")
    }

    return (
        <div className="header-container">
            <div className="header-left">
                <button className="header-button" onClick={handleStartPage} type="button">
                    <Home size={24}/>
                </button>

                <input
                    type="text"
                    className="header-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Что хочешь включить?"
                />
            </div>

            <div className="header-right">
                <div className="btn">
                    <div className="btn_item">
                        <span onClick={onRegister}>Регистрация</span>
                    </div>
                </div>

                <div className="btn">
                    <div className="btn_item">
                        <span onClick={onLogin}>Войти</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Header;
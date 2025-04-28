import React, {useContext, useState} from 'react';
import {Home} from "lucide-react"


import "./style/header.scss"
import {useNavigate} from "react-router-dom";
import {Context} from "../../main.tsx";

const Header: React.FC = () => {
    const [search, setSearch] = useState<string>("")
    const navigate = useNavigate()

    const {store} = useContext(Context)

    const handleStartPage = () => {
        navigate("/main")
    }
    const onRegister = () => {
        navigate("/auth/registration")
    }
    const onLogin = () => {
        navigate("/auth/login")
    }
    const onLogout = async () => {
        await store.logout();
        navigate("/main")
    }
    // const onCreatePost = () =>{
    //     navigate("/music/post")
    // }


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

                {/*<div className="btn" onClick={onCreatePost}>*/}
                {/*    <div className="btn_item">*/}
                {/*        /!*<LogOut size={18} className="mr-1"/>*!/*/}
                {/*        <span>Загрузить музыку</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>


            <div className="header-right">
                {store.isAuthenticated ? (
                <div className="btn btn_center" onClick={onLogout}>
                    <div className="btn_item">
                        {/*<LogOut size={18} className="mr-1"/>*/}
                        <span>Выйти</span>
                    </div>
                </div>






                ) : (
                      <>
                    <div className="btn">
                        <div className="btn_item" onClick={onRegister}>
                            <span>Регистрация</span>
                        </div>
                    </div>
                    <div className="btn">
                        <div className="btn_item" onClick={onLogin}>
                            <span>Войти</span>
                        </div>
                    </div>
                </>)
                }
            </div>

            {/*<div className="header-right">*/}
            {/*    <div className="btn">*/}
            {/*        <div className="btn_item">*/}
            {/*            <span onClick={onRegister}>Регистрация</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="btn">*/}
            {/*        <div className="btn_item">*/}
            {/*            <span onClick={onLogin}>Войти</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
};

export default Header;
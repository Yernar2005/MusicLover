import React, { useContext } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main.tsx';
import './style/header.scss';

const Header: React.FC = () => {
    const { store } = useContext(Context);
    const navigate  = useNavigate();

    const handleStartPage = () => navigate('/main');
    const onRegister    = () => navigate('/auth/registration');
    const onLogin       = () => navigate('/auth/login');
    const onLogout      = async () => {
        await store.logout();
        navigate('/main');
    };
    const onCreatePost  = () => navigate('/music/upload');

    const role = (store.user).role;
    const canPost = store.isAuthenticated && ['musician','admin'].includes(role);

    return (
        <div className="header-container">
            <div className="header-left">
                <button className="header-button" onClick={handleStartPage} type="button">
                    <Home size={24} />
                </button>

                {canPost && (
                    <div className="btn" onClick={onCreatePost}>
                        <div className="btn_item">
                            <span>Загрузить музыку</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="header-right">
                {store.isAuthenticated ? (
                    <div className="btn btn_center" onClick={onLogout}>
                        <div className="btn_item">
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
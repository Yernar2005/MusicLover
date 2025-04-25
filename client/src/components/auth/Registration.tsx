import React, {useContext, useState} from 'react';


import './registration.scss'
import {useNavigate} from "react-router-dom";
import {Context} from "../../main.tsx";

const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate()

    const {store} = useContext(Context)

    const handleSubmit = () => {
        try{
            store.registration(email, password)

            if(store.isAuthenticated){
                navigate('/main')
            }
        }
        catch (e) {
            console.log("Ошибка во время вхождение: " , e)
        }

    }

    const handleChangePage = () => {
        navigate('/auth/login')

    }
    return (
        <div className="registration-container">
            <div className="registration-card">
                <h1 className="registration-title">Зарегистрируйтесь и погрузитесь в музыку</h1>

                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="email">Электронная почта</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите электронную почту"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Пароль"
                                required
                            />

                        </div>
                    </div>
                    <button type="submit" className="registration-button">
                        Регистрироваться
                    </button>

                </form>

                <div className="login-prompt">
                    <span>Есть аккаунт?</span>
                    <button className="login-link" onClick={handleChangePage}>
                        Войти в MusicLover
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Registration;
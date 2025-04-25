"use client"

import React, {useContext} from "react"
import {useState} from "react"


import './loginForm.scss'
import {EyeOff, Eye} from "lucide-react"
import {useNavigate} from "react-router-dom";
import {Context} from "../../main.tsx";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const {store} = useContext(Context)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try{
            await store.login(email, password)

            if(store.isAuthenticated){
                navigate('/main')
            }
        }
        catch (e) {
            console.log("Ошибка во время регистрации: " ,e)
        }
    }


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const navigate = useNavigate()
    const handleChangePage = () => {
        navigate('/auth/registration')
    }

    return (

        <div className="login-container">
            <div className="login-card">
                {/*<SpotifyLogo/>*/}
                <h1 className="login-title">Войти в MusicLover</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Электронная почта или имя пользователя</label>
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
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Пароль"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Войти
                    </button>
                </form>

                <div className="forgot-password">
                    <a href="#">Забыли пароль?</a>
                </div>

                <div className="registration-prompt">
                    <span>Нет аккаунта?</span>
                    <button className="registration-link" onClick={handleChangePage}>
                        Регистрация в MusicLover
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;
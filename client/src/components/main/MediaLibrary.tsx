"use client"

import {Plus} from "lucide-react"
import "./style/mediaLibrary.scss"

const MediaLibrary = () => {
    return (
        <div className="media-library">
            <header className="header">
                <h1 className="title">Моя медиатека</h1>
                <button className="add-button">
                    <Plus/>
                </button>
            </header>

            <main className="content">
                <div className="card">
                    <h2 className="card-title">Создай свой первый плейлист</h2>
                    <p className="card-description">Это совсем не сложно! Мы поможем.</p>
                    <div className="card-container">
                        <button className="primary-button">Создать плейлист</button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-title">Подпишись на интересные подкасты</h2>
                    <p className="card-description">Ты будешь узнавать о новых выпусках.</p>
                    <div className="card-container">
                        <button className="secondary-button">Обзор</button>
                    </div>
                </div>
            </main>


        </div>
    )
}

export default MediaLibrary;

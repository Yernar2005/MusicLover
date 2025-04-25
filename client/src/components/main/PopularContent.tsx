"use client"

import {useState} from "react"
import {Play} from "lucide-react"

import "./style/popularContent.scss"

interface Track {
    id: number
    title: string
    artist: string
    explicit: boolean
    coverImage: string
    isPlaying?: boolean
}

const PopularContent = () => {
    const [tracks, setTracks] = useState<Track[]>([
        {
            id: 1,
            title: "нужна",
            artist: "M'Dee",
            explicit: false,
            coverImage: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 2,
            title: "Fake ID",
            artist: "kizaru, Icegergert",
            explicit: true,
            coverImage: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 3,
            title: "Дай",
            artist: "Artur, RICK",
            explicit: false,
            coverImage: "/placeholder.svg?height=300&width=300",
            isPlaying: true,
        },
        {
            id: 4,
            title: "My Bubble Gum",
            artist: "Rasheeda",
            explicit: true,
            coverImage: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 5,
            title: "Camar - Самая",
            artist: "Dark Sensei",
            explicit: false,
            coverImage: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 6,
            title: "Dreamers - Embody Remix",
            artist: "TGC, Embody",
            explicit: false,
            coverImage: "/placeholder.svg?height=300&width=300",
        },
    ])

    const togglePlay = (id: number) => {
        setTracks(
            tracks.map(track => ({
                ...track,
                isPlaying: track.id === id ? !track.isPlaying : false,
            })),
        );
    };

    return (
        <div className="popular-tracks">
            <div className="popular-tracks__header">
                <h2 className="popular-tracks__title">Популярные треки</h2>
                <button className="popular-tracks__show-all">Показать все</button>
            </div>
            <div className="popular-tracks__grid">
                {tracks.map(track => (
                    <div key={track.id} className="track-card">
                        <div className="track-card__cover" onClick={() => togglePlay(track.id)}>
                            <img
                                src={track.coverImage}
                                alt={`${track.title} cover`}
                                className="track-card__image"
                            />
                            {track.isPlaying && (
                                <div className="track-card__play-button">
                                    <Play size={36} />
                                </div>
                            )}
                        </div>
                        <div className="track-card__info">
                            <h3 className="track-card__title">{track.title}</h3>
                            <div className="track-card__artist-row">
                                {track.explicit && <span className="track-card__explicit">E</span>}
                                <p className="track-card__artist">{track.artist}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularContent;

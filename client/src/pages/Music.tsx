import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import $api from "../http/index.ts";
import "./styles/musicPage.scss";

interface MusicFull {
    _id: string;
    Title: string;
    Artist: string;
    Date: string;
    Genre: string[];
    Lyrics?: string;
    Annotation?: string;
    AdditionalInformation?: string;
    coverUrl: string;
    MusicType: string;
    audioBase64: string;
}

const MusicPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [track, setTrack]     = useState<MusicFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    console.log(track)


    useEffect(() => {
        if (!id) return;
        setLoading(true);
        $api
            .get<MusicFull>(`/api/music/${id}/full`)
            .then(({ data }) => setTrack(data))
            .catch(() => setError("Не удалось загрузить трек"))
            .finally(() => setLoading(false));

    }, [id]);

    if (loading) return <p className="music-page__status">Загрузка...</p>;
    if (error)   return <p className="music-page__status error">{error}</p>;
    if (!track)  return <p className="music-page__status">Трек не найден</p>;

    const audioSrc = `data:${track.MusicType};base64,${track.audioBase64}`;

    return (
        <div className="music-page">
            <div className="music-page__cover">
                <img
                    src={track.coverUrl}
                    alt={`${track.Title} by ${track.Artist}`}
                    className="music-page__cover-image"
                />
            </div>

            <div className="music-page__details">
                <h1 className="music-page__title">{track.Title}</h1>
                <h2 className="music-page__artist">{track.Artist}</h2>

                <audio
                    controls
                    src={audioSrc}
                    className="music-page__audio"
                />

                <div className="music-page__section">
                    <h3 className="music-page__section-title">Annotation</h3>
                    <p>{track.Annotation || "—"}</p>
                </div>

                <div className="music-page__section">
                    <h3 className="music-page__section-title">Release Date</h3>
                    <p>{new Date(track.Date).toLocaleDateString()}</p>
                </div>

                <div className="music-page__section">
                    <h3 className="music-page__section-title">Genre</h3>
                    <p>{track.Genre.length ? track.Genre.join(", ") : "—"}</p>
                </div>

                <div className="music-page__section">
                    <h3 className="music-page__section-title">Additional Information</h3>
                    <p>{track.AdditionalInformation || "—"}</p>
                </div>

                {track.Lyrics && (
                    <div className="music-page__section">
                        <h3 className="music-page__section-title">Lyrics</h3>
                        <div className="music-page__lyrics">
                            <pre>{track.Lyrics}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicPage;
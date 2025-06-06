"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Search } from "lucide-react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import $api from "../../http/index.ts";

import "./style/popularContent.scss";

interface TrackSummary {
    _id: string;
    Title: string;
    Artist: string;
    coverUrl: string;
}

interface Paged {
    items: TrackSummary[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export default function PopularContent() {
    const [tracks, setTracks] = useState<TrackSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const load = useCallback(async (search = "") => {
        const q = search.trim();
        // если ввод меньше 2 символов и не пустая строка — сбрасываем список
        if (q && q.length < 2) {
            setTracks([]);
            return;
        }
        setLoading(true);
        try {
            const { data } = await $api.get<Paged | TrackSummary[]>("/api/music", {
                params: { search: q },
            });
            setTracks(Array.isArray(data) ? data : data.items);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const debouncedSearch = useMemo(() => debounce(load, 1000), [load]);
    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const togglePlay = useCallback(
        (id: string, e: React.MouseEvent) => {
            e.stopPropagation();
            setPlayingId((cur) => (cur === id ? null : id));
        },
        []
    );

    const openTrack = (id: string) => {
        navigate(`/track/${id}`);
    };

    return (
        <div className="popular-tracks">
            <div className="popular-tracks__header">
                <h2 className="popular-tracks__title">Популярные треки</h2>
                <div className="search-box">
                    <Search size={24} className="search-icon" />
                    <input
                        value={query}
                        onChange={handleSearch}
                        placeholder="Поиск по названию или артисту…"
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="popular-tracks__grid">
                    <div className="track-card-skeleton" />
                    <div className="track-card-skeleton" />
                    <div className="track-card-skeleton" />
                    <div className="track-card-skeleton" />
                </div>
            ) : (
                <div className="popular-tracks__grid">
                    {tracks.map((t) => (
                        <div
                            key={t._id}
                            className="track-card"
                            onClick={() => openTrack(t._id)}
                        >
                            <div
                                className="track-card__cover"
                                onClick={(e) => togglePlay(t._id, e)}
                            >
                                <img
                                    src={t.coverUrl}
                                    alt={t.Title}
                                    className="track-card__image"
                                    loading="lazy"
                                />
                                {playingId === t._id && (
                                    <div className="track-card__play-button">
                                        <Play size={36} />
                                    </div>
                                )}
                            </div>
                            <div className="track-card__info">
                                <h3 className="track-card__title">{t.Title}</h3>
                                <p className="track-card__artist">{t.Artist}</p>
                            </div>
                        </div>
                    ))}
                    {tracks.length === 0 && (
                        <p className="mt-4 text-gray-500">Ничего не найдено</p>
                    )}
                </div>
            )}
        </div>
    );
}
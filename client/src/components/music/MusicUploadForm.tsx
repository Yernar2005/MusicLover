import {
    useState,
    useRef,
    ChangeEvent,
    FormEvent,
    useContext,
} from "react";
import { X, Upload, Music as MusicIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import $api from "../../http/index.ts";

import "./style/musicUploadForm.scss";
import {Context} from "../../main.tsx";

interface FormDataState {
    music: File | null;
    cover: File | null;
    title: string;
    artist: string;
    date: string;
    genre: string[];
    lyrics: string;
    annotation: string;
    additionalInformation: string;
}

const MusicUploadForm = observer(() => {
    const { store } = useContext(Context);
    const navigate  = useNavigate();







    // useEffect(() => {
    //     if (!store.isAuthenticated) navigate("/main");
    // }, [store.isAuthenticated]);


    /* --- redirect, если не музыкант и не админ --- */
    if (!["musician", "admin"].includes((store.user).role || "user"))
        return <p className="text-red-600 p-6">У вас нет прав на загрузку треков.</p>;


    const [formData, setFormData] = useState<FormDataState>({
        music: null,
        cover: null,
        title: "",
        artist: "",
        date: "",
        genre: [],
        lyrics: "",
        annotation: "",
        additionalInformation: "",
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [genreInput, setGenreInput]     = useState("");
    const [errors, setErrors]             = useState<Record<string, string>>({});
    const [submitting, setSubmitting]     = useState(false);

    const musicInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleMusicUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 16 * 1024 * 1024)
            return setErrors(prev => ({ ...prev, music: "Файл ≤ 16 МБ" }));

        const okTypes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a"];
        if (!okTypes.includes(file.type))
            return setErrors(prev => ({ ...prev, music: "mp3 / m4a / wav" }));

        setFormData(prev => ({ ...prev, music: file }));
        setErrors(prev => ({ ...prev, music: "" }));
    };

    const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024)
            return setErrors(prev => ({ ...prev, cover: "Картинка ≤ 2 МБ" }));

        const okTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!okTypes.includes(file.type))
            return setErrors(prev => ({ ...prev, cover: "jpeg / png / webp" }));

        setFormData(prev => ({ ...prev, cover: file }));
        setCoverPreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, cover: "" }));
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, date: e.target.value }));
        setErrors(prev => ({ ...prev, date: "" }));
    };

    const handleAddGenre = () => {
        if (genreInput.trim())
            setFormData(prev => ({
                ...prev,
                genre: [...prev.genre, genreInput.trim()],
            }));
        setGenreInput("");
    };
    const handleRemoveGenre = (i: number) =>
        setFormData(prev => ({ ...prev, genre: prev.genre.filter((_, idx) => idx !== i) }));

    const removeCover = () => {
        setFormData(prev => ({ ...prev, cover: null }));
        setCoverPreview(null);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        coverInputRef.current && (coverInputRef.current.value = "");
    };
    const removeMusic = () => {
        setFormData(prev => ({ ...prev, music: null }));
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        musicInputRef.current && (musicInputRef.current.value = "");
    };

    /* ---------- валидация ------ */
    const validateForm = () => {
        const err: Record<string, string> = {};
        if (!formData.music) err.music = "Обязательное поле";
        if (!formData.cover) err.cover = "Обязательное поле";
        if (!formData.title) err.title = "Обязательное поле";
        if (!formData.artist) err.artist = "Обязательное поле";
        if (!formData.date) err.date = "Обязательное поле";
        setErrors(err);
        return !Object.keys(err).length;
    };

    /* ---------- submit ---------- */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const fd = new FormData();
        fd.append("Music", formData.music!);
        fd.append("Cover", formData.cover!);
        fd.append("Title", formData.title);
        fd.append("Artist", formData.artist);
        fd.append("Date", formData.date);
        fd.append("Genre", JSON.stringify(formData.genre));
        fd.append("Lyrics", formData.lyrics);
        fd.append("Annotation", formData.annotation);
        fd.append("AdditionalInformation", formData.additionalInformation);

        try {
            setSubmitting(true);
            await $api.post("/api/music/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Трек загружен!");
            navigate("/main");
        } catch (err) {
            if (err.response?.status === 403)
                alert("Нет прав (нужна роль musician/admin)");
            else alert("Ошибка загрузки: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- JSX ---------- */
    return (
        <div className="container">
            <h1 className="form-title">Загрузка музыкального трека</h1>

            <form onSubmit={handleSubmit} className="form">
                {/* ----- music file ----- */}
                <div className="form-group">
                    <label className="label">
                        Music <span className="hint">(mp3/m4a/wav ≤ 16&nbsp;МБ)</span>
                    </label>
                    <div className="file-upload">
                        <input
                            type="file"
                            accept=".mp3,.m4a,.wav"
                            ref={musicInputRef}
                            className="file-input"
                            onChange={handleMusicUpload}
                        />
                        <button type="button" className="upload-button" onClick={() => musicInputRef.current?.click()}>
                            <Upload size={16} className="icon" /> Выбрать
                        </button>
                        {formData.music && (
                            <div className="file-preview">
                                <MusicIcon size={16} className="icon" />
                                <span>{formData.music.name}</span>
                                <button type="button" className="remove-button" onClick={removeMusic}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    {errors.music && <p className="error-message">{errors.music}</p>}
                </div>

                {/* ----- cover file ----- */}
                <div className="form-group">
                    <label className="label">
                        Cover <span className="required">*</span>{" "}
                        <span className="hint">(jpeg/png/webp ≤ 2&nbsp;МБ)</span>
                    </label>
                    <div className="file-upload">
                        <input
                            type="file"
                            accept=".jpeg,.jpg,.png,.webp"
                            ref={coverInputRef}
                            className="file-input"
                            onChange={handleCoverUpload}
                        />
                        {!coverPreview ? (
                            <button type="button" className="upload-button" onClick={() => coverInputRef.current?.click()}>
                                <Upload size={16} className="icon" /> Выбрать
                            </button>
                        ) : (
                            <div className="cover-preview">
                                <img src={coverPreview} alt="preview" className="cover-image" />
                                <button type="button" className="remove-button" onClick={removeCover}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    {errors.cover && <p className="error-message">{errors.cover}</p>}
                </div>

                {/* ----- Title / Artist / Date ----- */}
                {["title", "artist"].map(f => (
                    <div key={f} className="form-group">
                        <label className="label">
                            {f.charAt(0).toUpperCase() + f.slice(1)} <span className="required">*</span>
                        </label>
                        <input
                            name={f}
                            value={(formData)[f]}
                            onChange={handleTextChange}
                            className="input"
                        />
                        {errors[f] && <p className="error-message">{errors[f]}</p>}
                    </div>
                ))}

                <div className="form-group">
                    <label className="label">
                        Date <span className="required">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        className="input"
                    />
                    {errors.date && <p className="error-message">{errors.date}</p>}
                </div>

                {/* ----- Genre ----- */}
                <div className="form-group">
                    <label className="label">Genre (до 5)</label>
                    <div className="genre-input-container">
                        <input
                            value={genreInput}
                            onChange={e => setGenreInput(e.target.value)}
                            className="input genre-input"
                            placeholder="Добавить жанр"
                        />
                        <button type="button" className="add-button" onClick={handleAddGenre}>
                            +
                        </button>
                    </div>
                    {formData.genre.length > 0 && (
                        <div className="genre-tags">
                            {formData.genre.map((g, i) => (
                                <div key={i} className="genre-tag">
                                    {g}
                                    <button type="button" onClick={() => handleRemoveGenre(i)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ----- Lyrics / Annotation / Additional ----- */}
                {[
                    ["lyrics", 5],
                    ["annotation", 3],
                    ["additionalInformation", 3],
                ].map(([name, rows]) => (
                    <div key={name} className="form-group">
                        <label className="label">{name}</label>
                        <textarea
                            name={name}
                            rows={rows as number}
                            value={(formData)[name]}
                            onChange={handleTextChange}
                            className="textarea"
                        />
                    </div>
                ))}

                {/* ----- submit ----- */}
                <button type="submit" className="submit-button" disabled={submitting}>
                    {submitting ? "Отправка…" : "Отправить"}
                </button>
            </form>
        </div>
    );
});

export default MusicUploadForm;

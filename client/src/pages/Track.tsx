import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import MusicStore from '../store/musicStore.ts';

const musicStore = new MusicStore();

const Track = () => {
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        if (id) musicStore.loadOne(id);
    }, [id]);

    const t = musicStore.current;
    if (musicStore.loading || !t) return <p>Loading…</p>;

    return (
        <div className="p-6 space-y-4">
            <img alt="sad" src={t.coverUrl} className="w-64 rounded"/>
            <h1 className="text-2xl font-bold">{t.Title}</h1>
            <p className="text-lg">{t.Artist}</p>

            {/*<audio controls src={musicStore.audioSrc(t._id)} className="w-full"/>*/}

            {t.Lyrics && <>
                <h2 className="mt-6 font-semibold">Lyrics</h2>
                <pre className="whitespace-pre-wrap">{t.Lyrics}</pre>
            </>}
        </div>
    );
}



export default observer(Track);
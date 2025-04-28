const {createMusic, getMusic} = require('../service/music-service');
const svc = require('../service/music-service');
const Music = require('../models/music-model');

const uploadMusic = async (req, res) => {
    console.log('req.files:', req.files?.["Music"]);
    console.log('req.files:', req.files?.["Cover"]);

    try {

        const musicFile = req.files?.['Music'];
        const coverFile = req.files?.['Cover'];
        if (!musicFile || !coverFile) {
            return res.status(400).json({error: 'Нужно прислать и music, и cover'});
        }

        const musicDoc = await createMusic(
            req.body,
            musicFile[0].buffer,
            musicFile[0].mimetype,
            coverFile[0].buffer,
            coverFile[0].mimetype,
            req.user.id
        );

        const {Music, Cover, ...light} = musicDoc.toObject();
        res.status(201).json(light);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const fetchMusic = async (req, res) => {
    try {
        const id = req.params.id.trim()
        const doc = await getMusic(id);
        if (!doc) {
            return res.status(404).json({error: 'Not found'});
        }
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


const getAll = async (_, res) => {
    res.json(await svc.getAllLean())
}
const getById = async (req, res) => {
    const doc = await svc.getByIdLean(req.params.id);
    if (!doc) {
        return res.status(404).json({error: 'Not found in getById: '});
    }
    res.json(doc);
}

const getCover = async (req, res) => {
    const doc = await svc.getDocRaw(req.params.id);
    if (!doc) {
        return res.status(404).json({error: 'Not found in getCover: '});
    }
    res.type(doc.CoverType || 'image/jpeg').send(doc.Cover);
}


const streamMusic = async (req, res) => {
    const doc = await svc.getDocRaw(req.params.id);
    if (!doc) {
        return res.status(404).json({error: 'Not found in streamMusic: '});
    }

    const mime = doc.MusicType || 'application/octet-stream';
    const range = req.headers.range;
    const audioRow = doc.Music;
    const audio = Buffer.isBuffer(audioRow) ? audioRow : Buffer.from(audioRow);
    const total = audio.length;


    if (range) {
        const bytesPrefix = 'bytes=';
        if (!range.startsWith(bytesPrefix)) {
            return res.status(416).end()
        }

        let [start, end] = range.substring(bytesPrefix.length).split('-').map(Number);
        if (isNaN(end)) {
            end = total - 1;
        }
        const chunk = audio.slice(start, end + 1);


        res.status(206).set({
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunk.length,
            'Content-Type': mime,
        })
            .end(chunk);
    } else {
        res.set({
            'Content-Length': total,
            'Content-Type': mime
        }).end(audio);
    }
}


const deleteMusic = async (req, res, next) => {
    try {
        const doc = await Music.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({error: 'Not found'});
        }

        const isOwner = doc.uploaderId?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({error: 'Not authorized'});
        }

        await doc.deleteOne();
        res.sendStatus(204);
    } catch (e) {
        next(e)
    }
}
module.exports = {
    uploadMusic,
    fetchMusic,
    getAll,
    getById,
    getCover,
    streamMusic,
    deleteMusic
}
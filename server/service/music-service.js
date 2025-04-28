const Music = require('../models/music-model');

const createMusic = async (
    body,
    musicBuf,
    musicType,
    coverBuf,
    coverType,
    uploaderId
) => {
    let {
        Title,
        Artist,
        Date: DateStr,
        Lyrics,
        Annotation,
        Genre,
        AdditionalInformation
    } = body;

    if (typeof Genre === 'string') {
        try {
            Genre = JSON.parse(Genre);
        } catch {
            Genre = [Genre];
        }
    }
    if (!Array.isArray(Genre)) {
        Genre = [Genre];
    }

    const parsedDate = DateStr ? new Date(DateStr) : new Date();

    const doc = new Music({
        Title,
        Artist,
        Date: parsedDate,
        Lyrics,
        Annotation,
        Genre,
        AdditionalInformation,
        Music: musicBuf,
        MusicType: musicType,
        Cover: coverBuf,
        CoverType: coverType,
        uploaderId
    });

    return await doc.save();
};

const getMusic = async (id) => {
    return await Music.findById(id).lean({ virtuals: true }).exec();
};

const getAllLean = async () => {
    return await Music.find().select('-Music -Cover').lean().exec();
};

const getByIdLean = async (id) => {
    return await Music.findById(id).select('-Music -Cover').lean().exec();
};

const getDocRaw = async (id) => {
    return await Music.findById(id).exec();
};

module.exports = {
    createMusic,
    getMusic,
    getAllLean,
    getByIdLean,
    getDocRaw
};
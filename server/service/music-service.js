const Music = require('../models/music-model')


const createMusic = async (body, musicBuf, musicType, coverBuf, coverType, uploaderId) => {
    let {Title, Artist, Date, Lyrics, Annotation, Genre, AdditionalInformation} = body;
    if (typeof Genre === 'string') {
        try {
            Genre = JSON.parse(Genre);
        } catch (e) {
            Genre = [Genre];
        }

        const doc = new Music({
            Title,
            Artist,
            Date,
            Lyrics,
            Annotation,
            Genre,
            AdditionalInformation,
            Music: musicBuf,
            MusicType: musicType,
            Cover: coverBuf,
            CoverType: coverType,
            uploaderId
        }).save();

        return doc;

    }
}

const getMusic = async (id) => {
     await Music.findById(id);
}

const getAllLean = async () => {
    await Music.find().select('-Music').lean().exec();
}

const getByIdLean = async (id) => {
    await Music.findById(id).select("-Music").lean().exec();
}

const getDocRaw = async (id) => Music.findById(id).exec();

module.exports = {
    createMusic,
    getMusic,
    getAllLean,
    getByIdLean,
    getDocRaw
}
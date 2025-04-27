const multer = require('multer');

const MAX_AUDIO_SIZE = 1024 * 1024 * 16; // 16 MB
const MAX_COVER_SIZE = 1024 * 1024 * 3; // 3 MB

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {fileSize: MAX_AUDIO_SIZE},
    fileFilter: (req, file, cb) => {
        const {fieldname, mimetype, size} = file

        const audioOk = fieldname === 'Music' && ['audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav'].includes(mimetype) && size <= MAX_AUDIO_SIZE;
        const coverOk = fieldname === 'Cover' && ['image/jpeg', 'image/png', 'image/webp'].includes(mimetype) && size <= MAX_COVER_SIZE;

        if(audioOk || coverOk) {
            return cb(null, true)
        }    else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', fieldname));

    }

});

module.exports = {upload};

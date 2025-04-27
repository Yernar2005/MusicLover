const mongoose = require('mongoose');
const {model} = require("mongoose");

const musicSchema = new mongoose.Schema({
    Title: {type: String},
    Artist: {type: String},
    Date: { type: Date },
    Music: { type: Buffer },
    MusicType: {type: String},
    Cover: { type: Buffer },
    CoverType: {type: String},
    Lyrics: {type: String},
    Annotation: {type: String},
    Genre: {type: [String]},
    AdditionalInformation: {type: String},
});

musicSchema.virtual('coverUrl').get(function () {
    return `/api/music/${this._id}/cover`;
});

module.exports = model('Music', musicSchema);

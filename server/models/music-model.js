const mongoose = require('mongoose');
const {model} = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');


const musicSchema = new mongoose.Schema({
    Title: {type: String},
    Artist: {type: String},
    Date: {type: Date},
    Music: {type: Buffer},
    MusicType: {type: String},
    Cover: {type: Buffer},
    CoverType: {type: String},
    uploaderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    Lyrics: {type: String},
    Annotation: {type: String},
    Genre: {type: [String]},
    AdditionalInformation: {type: String},
});

musicSchema.virtual('coverUrl').get(function () {
    return `/api/music/${this._id}/Cover`;
});
musicSchema.plugin(mongooseLeanVirtuals);   // ← добавляем

musicSchema.index({ Genre: 1 });                     // ✔ фильтр по жанру
musicSchema.index({ Title: 'text', Artist: 'text' }); // ✔ текстовый поиск

module.exports = model('Music', musicSchema);

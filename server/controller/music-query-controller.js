const {queryMusic, getSummaryList} = require('../service/music-query.js');
const Music = require("../models/music-model");

exports.listMusic = async (req, res, next) => {

    try {
        const genre = req.query.genre
            ? Array.isArray(req.query.genre)
                ? req.query.genre
                : req.query.genre.split(',')
            : [];


        const result = await queryMusic({
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            genre,
            sort: req.query.sort,
            order: req.query.order

        });

        res.json(result);
    } catch (e) {
        next(e)
    }
}


exports.listSummary = async (_req, res, next) => {
    try {
        const items = await Music.find()
            .select('_id Title Artist')      // базовые поля
            .sort({ Date: -1 })
            .lean({ virtuals: true });       // ← правильно: virtualS

        res.json(items);                   // теперь [{ _id, Title, Artist, coverUrl }]
    } catch (e) { next(e); }
};
const Music = require("../models/music-model");


exports.queryMusic = async ({
                                page = 1,
                                limit = 10,
                                search = '',
                                genre = [],
                                sort = 'Date',
                                order = 'desc'
                            }) => {

    const filter = {};
    if (genre.length) {
        filter.genre = {$in: genre};
    }
    if (search) {
        filter.$text = {$search: search};
    }

    page = Math.max(+page, 1);
    limit = Math.max(+limit, 1);


    const sortDir = order === 'desc' ? -1 : 1;
    const sortBy = {[sort]: sortDir};


    const cursor = Music.find(filter)
        .select("-Music -Cover")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit);


    const [items, totalItems] = await Promise.all([
        cursor.lean({ virtuals: true }).exec(),
        Music.countDocuments(filter).exec()
    ])


    return {
        items,
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
    }
}


exports.getSummaryList = async () =>
    Music.find()
        .select('_id Title Artist')
        .sort({ Date: -1 })
        .lean({ virtual: true });
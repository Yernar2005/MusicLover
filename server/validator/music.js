const {body, validationResult} = require('express-validator');

const MusicRules = [
    body('Title').trim().notEmpty().withMessage('Title is required')
        .isLength({min: 2, max: 20}).withMessage('Title must be between 2 and 20 characters'),

    body("Artist").trim().notEmpty().withMessage('Artist required')
        .isLength({min: 2, max: 30}).withMessage('Artist must be between 2 and 30 characters'),

    body("Date").notEmpty().withMessage('Date required')
        .isISO8601().withMessage('Date must be a valid date like: YYYY-MM-DD')
        .toDate().custom((d) => d <= new Date()).withMessage('Date must be in the future'),

    body('Genre')
        .optional()
        .custom(v => {
            const arr = typeof v === 'string' ? JSON.parse(v) : v;
            if (!Array.isArray(arr) || arr.length > 5) throw new Error();
            return true;
        }).withMessage('Genre — массив ≤ 5 элементов'),

    body('Lyrics').optional().isLength({max: 5000}),
    body('Annotation').optional().isLength({max: 500}),
    body('AdditionalInformation').optional().isLength({max: 500})
]

const CheckMusicValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    res.status(422).json({errors: errors.array()});
}


module.exports = {MusicRules, CheckMusicValidation}
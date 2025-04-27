const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});




const {uploadMusic, fetchMusic} = require("../controller/music-controller");
const ctrl = require("../controller/music-controller");
const { MusicRules, CheckMusicValidation} = require("../validator/music");


router.post('/upload', upload.fields([
    {name: 'Music', maxCount: 1},
    {name: 'Cover', maxCount: 1}]), MusicRules, CheckMusicValidation, uploadMusic)




// router.get('/:id', fetchMusic) // Возвращает все параметры
router.get('/:id/cover', ctrl.getCover); // Только обложку
router.get('/:id/audio', ctrl.streamMusic); // Только аудио
router.get('/:id',        ctrl.getById); //  // Все параметры кроме аудио и обложки
router.get('/',           ctrl.getAll);// Возвращает все треки, кроме аудио и обложки
module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});


const {MusicRules, CheckMusicValidation} = require("../validator/music");
const {uploadMusic, fetchMusic} = require("../controller/music-controller");


const ctrl = require("../controller/music-controller");
const ctrlQry = require("../controller/music-query-controller");

const auth = require("../middlewares/auth-middleware");
const requireRole = require("../middlewares/role-middleware");

router.post('/upload', auth, requireRole("musician", "admin"), upload.fields([
    {name: 'Music', maxCount: 1},
    {name: 'Cover', maxCount: 1}]), MusicRules, CheckMusicValidation, uploadMusic)


router.delete('/:id', auth, requireRole("musician", "admin"), ctrl.deleteMusic);

/* ----- публичные GET-энд-поинты ----- */
router.get('/:id/audio',  ctrl.streamMusic);
router.get('/:id/cover',  ctrl.getCover);
router.get('/:id',        ctrl.getById);      // документ без бинарей
// router.get('/',           ctrlQry.listSummary); // для главной страницы
router.get('/', ctrlQry.listMusic);
module.exports = router;

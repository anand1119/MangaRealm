const express = require('express');
const router = express.Router();
const mangas = require('../controllers/mangas');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateManga } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Manga = require('../models/manga');

router.route('/')
    .get(catchAsync(mangas.index))
    .post(isLoggedIn, upload.array('image'), validateManga, catchAsync(mangas.createManga));

router.get('/new', isLoggedIn, mangas.renderNewForm);

router.route('/:id')
    .get(catchAsync(mangas.showManga))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateManga, catchAsync(mangas.updateManga))
    .delete(isLoggedIn, isAuthor, catchAsync(mangas.deleteManga));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(mangas.renderEditForm));

module.exports = router;
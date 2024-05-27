const express = require('express')
const multer = require('multer');
const router = express.Router();
const postController = require('../controllers/posts.js')
const utils = require('../utils.js');
const upload = multer({ storage: utils.storage });


router.get('/', postController.index)
    .post('/create', upload.single('image'), postController.create)
    .get('/:slug', postController.show)
    .get('/:slug/download', postController.download)




module.exports = router;
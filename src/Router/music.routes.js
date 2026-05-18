const express = require("express")
const musicController = require("../Controller/music.Controller")
const authMiddleware = require("../Middleware/auth.middleware.js")
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload", authMiddleware.authArtist ,upload.single("music") ,musicController.createMusic)
router.post("/album", authMiddleware.authArtist ,musicController.createAlbum)

router.get("/", musicController.getAllMusic)
module.exports = router
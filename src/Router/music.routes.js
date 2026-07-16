const express = require("express")
const musicController = require("../Controller/music.Controller")
const authMiddleware = require("../Middleware/auth.middleware.js")
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload", authMiddleware.authArtist ,upload.single("music") ,musicController.createMusic);
router.post("/album", authMiddleware.authArtist ,musicController.createAlbum);
router.get("/", authMiddleware.authUser, musicController.getAllMusic);
router.get("/getalbum",authMiddleware.authUser, musicController.getAllAlbum);
router.get("/getalbum/:albumId", authMiddleware.authUser, musicController.getAlbumById)
router.put("/updatealbum/:albumId", authMiddleware.authArtist, musicController.updateAlbum)
router.delete("/deletemusic/:musicId", authMiddleware.authArtist, musicController.deleteMusic)
router.get("/search", authMiddleware.authUser, musicController.searchEverything);

module.exports = router
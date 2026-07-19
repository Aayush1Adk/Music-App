const express = require("express")
const musicController = require("../Controller/music.Controller")
const authMiddleware = require("../Middleware/auth.middleware.js")
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload", authMiddleware.authArtist ,upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 }
]),musicController.createMusic);
router.post("/album", authMiddleware.authArtist,upload.single("cover"),musicController.createAlbum);
router.get("/", authMiddleware.authUser, musicController.getAllMusic);
router.get("/search", authMiddleware.authUser, musicController.searchEverything);
router.post("/:musicId/like", authMiddleware.authUser, musicController.likeMusic); 
router.delete("/:musicId/like", authMiddleware.authUser, musicController.unLikeMusic);
router.get("/getalbum",authMiddleware.authUser, musicController.getAllAlbum);
router.get("/getmusic/:musicId", authMiddleware.authUser, musicController.getMusicById)
router.get("/getalbum/:albumId", authMiddleware.authUser, musicController.getAlbumById)
router.put("/updatealbum/:albumId", authMiddleware.authArtist, musicController.updateAlbum)
router.delete("/deletemusic/:musicId", authMiddleware.authArtist, musicController.deleteMusic)


module.exports = router
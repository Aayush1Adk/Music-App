const musicModel = require("../Models/music.model.js");
const {UploadMusic, UploadImage} = require("../Services/storage.service.js")
const albumModel = require("../Models/albums.model.js");
const userModel = require("../Models/user.model.js");

const createMusic = async (req, res) => {
    try {
    const { title, genres } = req.body;

    if (!req.files || !req.files['audio'] || !req.files['cover']) {
            return res.status(400).json({ message: "Both music and cover files are required." });
        }

        const audioFile = req.files['audio'][0];
        const coverFile = req.files['cover'][0];

    const [audioResult, coverResult] = await Promise.all([
            UploadMusic(audioFile.buffer, audioFile.mimetype),
            UploadImage(coverFile.buffer, coverFile.mimetype)
        ]);

    const music = await musicModel.create({
        uri: audioResult.secure_url,
        coverUri: coverResult.secure_url,
        title,
        genres: genres ? JSON.parse(genres) : [],
        artist: req.user.id,
    });

    res.status(201).json({ message: "Music Created Successfully", music });
    }  catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error" });
    }
};

const createAlbum = async(req, res)=>{

    try{
        
        const {title , musics} = req.body;
        const coverFile = req.file;
        

        if (!coverFile) {
            return res.status(400).json({ message: "Album cover image is required" });
        }

        if (!title) return res.status(400).json({ message: "Album title is required" });

        const coverResult = await UploadImage(    coverFile.buffer, coverFile.mimetype);

const album = await albumModel.create({
            title,
            coverUri: coverResult.secure_url,
            artist: req.user.id,
            musics: musics ? JSON.parse(musics) : []
            });

        res.status(201).json({message:"Created Successfully", album})
    }

    catch(err){
        console.log(err);
        return res.status(401).json({message: "Fully Unauthorized "});
    }

}


const getAllMusic = async(req, res) => {

    try{    

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [musics, totalMusics] = await Promise.all([
            musicModel.find().sort({ createdAt: -1, title: 1 }).skip(skip).limit(limit).populate("artist","username"),
            musicModel.countDocuments()
        ])

        const totalPages = Math.ceil(totalMusics / limit);

    res.status(200).json({
        message: "Music fetched Successfully",
        musics,
        pagination: {
                totalItems: totalMusics,
                currentPage: page,
                itemsPerPage: limit,
                totalPages
            }
    })
}
catch(err){
    console.log(err)
    res.status(400).json({message:"error"})
}

}

const getAllAlbum = async(req, res) => {
    try{
        const albums = await albumModel.find().limit(10).select("-musics").
        populate("artist","username email")

        res.status(200).json({
            message:"Album fetched Successfully",
            albums : albums,
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({message:"error at albums"})
    }
}

const getAlbumById = async(req, res) => {

    const albumId = req.params.albumId

    try{
        const album = await albumModel.findById(albumId).populate("artist","username email").populate("musics")

        return res.status(200).json({
            message:"Album fetched Successfully",
            album : album,
        })
    }

    catch(err){
        res.status(400).json({message:"error at get album by id"})
    }
}

const deleteMusic = async (req, res) => {

    const musicId = req.params.musicId;

    try {

        const music = await musicModel.findById(musicId);

        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        if (music.artist.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await music.deleteOne();

        res.status(200).json({
            message: "Music deleted successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Error deleting music"
        });
    }
}


const updateAlbum = async(req, res) => {

    const albumId = req.params.albumId
    const {title} = req.body
    const music = await musicModel.findById(musicId);

            if (music.artist.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

    try{
        const album = await albumModel.findByIdAndUpdate(albumId, {title}, {new: true})

        res.status(200).json({
            message:"Album updated Successfully",
            album : album,
        })
    }

    catch(err){
        res.status(400).json({message:"error at update album"})
    }
}


const searchEverything = async(req, res) => {
    try{
const searchTerm = req.query.q

if (!searchTerm) {
    return res.status(400).json({
        message: "Search term required"
    });
}

const userResults = await userModel.find({
    username: {
        $regex: searchTerm,
        $options: "i"
    },
    role: "artist"
});

const artistIDs = userResults.map(user => user._id);

const musicResults = await musicModel.find({
    $or: [
        {title: {$regex: searchTerm, $options: "i"}},
        {artist: {$in: artistIDs}}
    ]
}).populate("artist","username")

const albumResults = await albumModel.find({
    $or: [
        {title: {$regex: searchTerm, $options: "i"}},
        {artist: {$in: artistIDs}}
    ]
}).populate("artist","username").select("-musics")



res.status(200).json({
    message: "Search results",
    musics: musicResults,
    albums: albumResults,
    users: userResults
})
    }

catch(err){
    console.log(err)
    res.status(500).json({message:"error at search"})

}
}


module.exports = {createMusic, createAlbum, getAllMusic, getAllAlbum, getAlbumById, deleteMusic, updateAlbum, searchEverything};
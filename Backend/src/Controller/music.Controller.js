const musicModel = require("../Models/music.model.js");
const {UploadMusic, UploadImage} = require("../Services/storage.service.js")
const albumModel = require("../Models/albums.model.js");
const userModel = require("../Models/user.model.js");
const likeModel = require("../Models/like.model.js");
const playModel = require("../Models/play.model.js")

const createMusic = async (req, res) => {
    try {
    const { title, genres } = req.body;

    if (!req.files || !req.files['musicFile'] || !req.files['coverUri']) {
            return res.status(400).json({ message: "Both music and cover files are required." });
        }

        const audioFile = req.files['musicFile'][0];
        const coverFile = req.files['coverUri'][0];

    const [audioResult, coverResult] = await Promise.all([
            UploadMusic(audioFile.buffer, audioFile.mimetype),
            UploadImage(coverFile.buffer, coverFile.mimetype)
        ]);

    const music = await musicModel.create({
        musicFile: audioResult.secure_url,
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

const likeMusic = async (req, res) =>{

    const userId = req.user.id
    const musicId = req.params.musicId;

    try{
        const music = await musicModel.findById(musicId);

        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        const existingLike = await likeModel.findOne({
        user: userId,
        music: musicId
    });

    if (existingLike) {
        return res.status(409).json({
        message: "Already liked"
        });
    }

    const likeMusic = await likeModel.create({
        user: userId,
        music: musicId
        });

    await musicModel.findByIdAndUpdate(musicId, { $inc: { likesCount: 1 } });

    res.status(201).json({
    message: "Music liked successfully", likeMusic });    
    }

    catch(err){
        console.log(err);
        res.status(400).json({
            message: "Error liking music"
                        });
                    }
}

const unLikeMusic = async (req, res)=>{

try{
        const musicId =  req.params.musicId;

    const deletedLike = await likeModel.findOneAndDelete({
        user: req.user.id,
        music: musicId
    });

    if (deletedLike) {
            await musicModel.findByIdAndUpdate(musicId, { $inc: { likesCount: -1 } });
        }

    res.status(200).json({ message: "Unliked a song"})
}
catch(err){
    res.status(400).json({
        message: "error disliking music"
    })
}

}


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

        const sortBy = req.query.sortBy || 'latest';

        const allowedSorts = [
            "latest",
            "oldest",
            "popular",
            "least",
            "title_asc",
            "title_desc"
        ];

    if (!allowedSorts.includes(sortBy)) {
        return res.status(400).json({
            message: "Invalid sort option"
        });
    }

        let sortOption = { createdAt: -1 };

        if (sortBy === 'oldest') {
            sortOption = { createdAt: 1 };
        }
        else if (sortBy === 'popular') {
            sortOption = { likesCount: -1, title: 1 };
        }
        else if (sortBy === 'least') {
            sortOption = { likesCount: 1, title: 1 };
        }
        else if (sortBy === "title_asc") {
            sortOption = { title: 1 };
        }
        else if (sortBy === "title_desc") {
            sortOption = { title: -1 };
        }

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

const getMusicById = async(req, res) => {
    const musicId = req.params.musicId

    try{
        const music = await musicModel.findById(musicId).populate("artist","username email")
        res.status(200).json({
            message:"Music fetched Successfully",
            music : music,
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({message:"error at get music by id"})
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
    const album = await albumModel.findById(albumId);

    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        });
    }

    if (album.artist.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }

    try{
        const Updatealbum = await albumModel.findByIdAndUpdate(albumId, {title}, {new: true})

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

const playcount = async(req, res) =>{
    const musicId = req.params.musicId;
    const userId = req.user.id;

    try{
        const music = await musicModel.findById(musicId)

        if(!music){
            return res.status(404).json({message: " music doesn't exist"})
        }

        const existingPlay = await playModel.findOne({
            user: userId,
            music: musicId
        })

        if(existingPlay === null){
            await playModel.create({
                user: userId,
                music: musicId
            })
            await musicModel.findByIdAndUpdate(
                musicId, { $inc:{playCount: 1}}
            );
            return res.status(200).json({
                message:"play counted"
            });
        }
        const now = new Date();
        const lastPlayed = existingPlay.updatedAt;
        const diff = now.getTime() - lastPlayed.getTime();

        const THIRTY_MINUTES = 30 * 60 * 1000;

        if(diff >= THIRTY_MINUTES){
            existingPlay.updatedAt = new Date();
            await existingPlay.save();

            await musicModel.findByIdAndUpdate(
                musicId,
                { $inc: { playCount: 1 } }
            );

            return res.status(200).json({
                message: "Play counted"
            });
        }

            return res.status(200).json({
            message: "Play already counted recently"
        });
        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error playing music"
        });
    }
}


module.exports = {createMusic, createAlbum, getAllMusic, getMusicById, getAllAlbum, getAlbumById, 
    deleteMusic, updateAlbum, searchEverything, likeMusic, unLikeMusic, playcount};
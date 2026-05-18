const musicModel = require("../Models/music.model.js");
const jwt = require("jsonwebtoken");
const {UploadMusic} = require("../Services/storage.service.js")
const albumModel = require("../Models/albums.model.js");

const createMusic = async(req, res)=>{
    
    try{
   
    const {title} = req.body;
    const uri = req.file.path;
    
    const audio = await UploadMusic(req.file.buffer, req.file.mimetype)// use of 

    const music = await musicModel.create({
        uri: audio.secure_url,
        title,
        artist: req.user.id, 
    })

    res.status(201).json({message:"Music Created Successfully", music});

     }
    catch(err){
        res.status(400).json({message:"Error"})
    }

}

const createAlbum = async(req, res)=>{

    try{
        
        const {title , musics} = req.body;

        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics
        })

        res.status(201).json({message:"Created Successfully",
            album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics 
            }

        })
    }


    catch(err){
        console.log(err);
        return res.status(401).json({message: "Fully Unauthorized "});
    }

}

const getAllMusic = async(req, res) => {

    try{    
    const musics = await musicModel.find()

    res.status(200).json({
        message: "Music fetched Successfully",
        musics : musics,
    })
}
catch(err){
    console.log(err)
    res.status(400).json({message:"error"})
}

}

module.exports = {createMusic, createAlbum, getAllMusic} 
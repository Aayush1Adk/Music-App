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
    const musics = await musicModel.find().limit(15).populate("artist","username")

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

const deleteMusic = async(req, res) => {

    const musicId = req.params.musicId
    try{
        const music = await musicModel.findByIdAndDelete(musicId)
        res.status(200).json({
            message:"Music deleted Successfully",
            music : music,
        })
    }
    catch(err){
        res.status(400).json({message:"error at delete music"})
    }
}


const updateAlbum = async(req, res) => {

    const albumId = req.params.albumId
    const {title} = req.body

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



module.exports = {createMusic, createAlbum, getAllMusic, getAllAlbum, getAlbumById, deleteMusic, updateAlbum} 
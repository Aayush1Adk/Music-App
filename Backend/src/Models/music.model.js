const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    musicFile:{
        type: String,
        required: true
    },

    coverUri:{
        type: String,
        required: true
    },

    title:{
        type: String,
        required: true
    },
    genres: [String],
    
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    playCount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
);

const musicModel = mongoose.model('Music', musicSchema);

module.exports = musicModel; 
const mongoose = require('mongoose')

const playSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    music:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Music",
        required: true
    }
},
    {
        timestamps: true
    }
)
playSchema.index(
    { user: 1, music: 1 },
    { unique: true }
);

const playModel = mongoose.model("Play", playSchema);

module.exports = playModel;
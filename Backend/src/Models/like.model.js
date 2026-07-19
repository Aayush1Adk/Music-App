const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    music:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
        required: true
    }
},
{
    timestamps: true
}
)

likeSchema.index(
    { user: 1, music: 1 },
    { unique: true }
);

const likeModel = mongoose.model('Like', likeSchema);

module.exports = likeModel;
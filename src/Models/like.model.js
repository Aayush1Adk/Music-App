const moongoose = require('mongoose');

const likeSchema = new moongoose.Schema({
    user:{
        type: moongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    music:{
        type: moongoose.Schema.Types.ObjectId,
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

const likeModel = moongoose.model('Like', likeSchema);

module.exports = likeModel;
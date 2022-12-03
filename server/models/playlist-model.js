const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        isPublished: { type: Boolean },
        comments: { type: [{
            author: String,
            text: String
        }]},
        listens: { type: Number },
        likes: { type: Number },
        dislikes: { type: Number },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)

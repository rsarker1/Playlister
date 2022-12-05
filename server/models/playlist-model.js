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
        isPublished: { type: Boolean, required: true },
        publishedDate: {type: String, required: true},
        comments: { type: [{
            author: String,
            text: String
        }], required: true},
        listens: { type: Number, required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)

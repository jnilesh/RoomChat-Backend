const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatSchema = new Schema({
    message: String,
    author: {
        name: String,
        uid : String
    },
    room : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rooms'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chats',chatSchema)
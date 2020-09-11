const mongoose = require('mongoose');

const roomschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        name: {
            type: String,
            required: true,
        },
        uid : {
            type: String,
            required: true,
        }
    }

},{
    timestamps: true
})


module.exports = mongoose.model('Rooms',roomschema)
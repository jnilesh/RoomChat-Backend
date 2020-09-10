const mongoose = require('mongoose');

const roomschema = new mongoose.Schema({
    name:{
        type: String
    },
    description: {
        type: String
    },
    creator: {
        type: String
    }

},{
    timestamps: true
})


module.exports = mongoose.model('Rooms',roomschema)
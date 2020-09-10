const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const roomchatSchema = new Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
    author: String 
})

var Messages = mongoose.model('Message', roomchatSchema);
// export default mongoose.model('messageContents',roomchatSchema)
module.exports = Messages;
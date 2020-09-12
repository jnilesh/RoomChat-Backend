var createError = require('http-errors');
const mongoose = require('mongoose')
var express = require('express');
const Messages = require('./models/dbMessages.js');
const Pusher = require('pusher');
const cors = require('cors');
const roomRouter = require('./routes/roomRouter');
const messageRouter = require('./routes/messageRouter');
const chatRouter = require('./routes/chatRouter.js');

const connection_url = 'mongodb+srv://admin:qgEzDmBZU7L7ZWYi@cluster0.heuz1.mongodb.net/roomchatdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


const app = express()
const port = process.env.PORT || 9000;


app.use(express.json())

app.use(cors())

// app.use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// } )



app.get('/',(req,res)=>res.status(200).send('hello world'))


app.use('/rooms',roomRouter);
// app.use('/messages',messageRouter);
app.use('/chats',chatRouter);

// app.use(function(req, res, next) {
//     next(createError(404));
// });
  
// // error handler
// app.use(function(err, req, res, next) {
// // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.listen(port,() => console.log(`listening on localhost:${port}`));

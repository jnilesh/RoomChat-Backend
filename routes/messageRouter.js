const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Messages = require('../models/dbMessages.js');
const Pusher = require('pusher');

const messageRouter = express.Router();

messageRouter.use(bodyParser.json());


const pusher = new Pusher({
    appId: '1069706',
    key: '2dc823cb13284cd07f68',
    secret: 'aee7cf57ebe848b042c0',
    cluster: 'ap2',
    encrypted: true
  });
  
  const db = mongoose.connection;
  
//   db.once('open',()=>{
//       console.log("DB is working");
  
//       const msgCollection = db.collection('messagecontents')
//       const changeStream = msgCollection.watch()
  
//       changeStream.on('change',(change)=> {
//           console.log(change);
  
//           if(change.operationType === 'insert'){
//               const messageDetails = change.fullDocument;
//               pusher.trigger('messages','inserted',
//               {
//                   name: messageDetails.name,
//                   message: messageDetails.message,
//                   timestamp: messageDetails.timestamp,
//                   received: messageDetails.received,
//                   author: messageDetails.author,
//                   id:messageDetails._id
//               }
//               )
//           }else {
//               console.log('Error triggered Pusher');
//           }
  
//       })
  
//   })



messageRouter.route('/sync')
.get( (req,res,next) => {
    Messages.find()
    // .populate('comments.author')
    .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})

messageRouter.route('/new')
.post( (req,res,next) => {
    Messages.create(req.body)
    .then((data) => {
        console.log('data Created ', data.name);
        pusher.trigger('messages','inserted',
              {
                  name: data.name,
                  message: data.message,
                  timestamp: data.timestamp,
                  received: data.received,
                  author: data.author,
                  id:data._id
              }
              )
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = messageRouter;
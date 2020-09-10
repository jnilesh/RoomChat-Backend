const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Chats = require('../models/chats')
const chatRouter = express.Router();
const Pusher = require('pusher');

chatRouter.use(bodyParser.json());

const pusher = new Pusher({
    appId: '1069706',
    key: '2dc823cb13284cd07f68',
    secret: 'aee7cf57ebe848b042c0',
    cluster: 'ap2',
    encrypted: true
  });


chatRouter.route('/:roomId')
.get( (req,res,next) => {
    Chats.find({ "room": req.params.roomId })
    // .populate('comments.author')
    .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    req.body.room = req.params.roomId;
    Chats.create(req.body)
    .then((room) => {
        console.log('message Created ', room);
        pusher.trigger(`token-${room.room}`,'inserted',
              {
                  name: room.name,
                  message: room.message,
                  timestamp: room.timestamp,
                  received: room.received,
                  author: room.author,
                  id:room._id
              }
              )
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch((err) => next(err));
})

chatRouter.route('/')
.post( (req, res, next) => {
    Chats.create(req.body)
    .then((room) => {
        console.log('message Created ', room);
        pusher.trigger( room.room ,'inserted',
              {
                  name: room.name,
                  message: room.message,
                  timestamp: room.timestamp,
                  received: room.received,
                  author: room.author,
                  id:room._id
              }
              )
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = chatRouter;
// export default express.Router(roomRouter);
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Rooms = require('../models/room')

const roomRouter = express.Router();

roomRouter.use(bodyParser.json());

const Pusher = require('pusher');
const pusher = new Pusher({
    appId: '1069706',
    key: '2dc823cb13284cd07f68',
    secret: 'aee7cf57ebe848b042c0',
    cluster: 'ap2',
    encrypted: true
  });

roomRouter.route('/')
.get( (req,res,next) => {
    Rooms.find(req.query)
    // .populate('comments.author')
    .then((data) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    Rooms.create(req.body)
    .then((room) => {
        console.log('Room Created ', room);
        pusher.trigger( `rooms` ,'created',
              {
                name: room.name,
                description: room.description,
                updatedAt: room.createdAt,
                creator: room.creator,
                _id:room._id
              }
              )
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = roomRouter;
// export default express.Router(roomRouter);
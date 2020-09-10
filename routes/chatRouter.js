const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Chats = require('../models/chats')

const chatRouter = express.Router();

chatRouter.use(bodyParser.json());

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

chatRouter.route('/')
.post( (req, res, next) => {
    Chats.create(req.body)
    .then((room) => {
        console.log('Room Created ', room);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = chatRouter;
// export default express.Router(roomRouter);
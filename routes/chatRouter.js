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
        if(!data){
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);            
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    if (req.body != null) {
        req.body.room = req.params.roomId;
        Chats.create(req.body)
        .then((data) => {
            pusher.trigger(`token-${data.room}`,'inserted',
                {
                    name: data.name,
                    message: data.message,
                    updatedAt: data.updatedAt,
                    author: data.author,
                    _id:data._id
                }
                )
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Message not found in request body');
        err.status = 404;
        return next(err);
    }
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /chats/roomId');
})
.delete( (req, res, next) => {
    Chats.deleteMany({"room": req.params.roomId})
    .then((resp) => {
        if(!resp){
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);            
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

chatRouter.route('/message/:messageId')
.get( (req,res,next) => {
    console.log(req.params.messageId);
    Chats.findById(req.params.messageId )
    .then((data) => {
        if(!data){
            err = new Error('message ' + req.params.messageId + ' not found');
            err.status = 404;
            return next(err);            
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( (req, res, next) => {
    Chats.findByIdAndDelete(req.params.messageId)
    .then((resp) => {
        if(!resp){
            err = new Error('Message ' + req.params.messageId + ' not found');
            err.status = 404;
            return next(err);            
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


module.exports = chatRouter;
// export default express.Router(roomRouter);
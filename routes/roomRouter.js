const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Rooms = require('../models/room')
const Chats = require('../models/chats')

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
        if(!data){
            err = new Error('Rooms not found');
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
    }
    else {
        err = new Error('Room not found in request body');
        err.status = 404;
        return next(err);
    }
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /rooms/');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /rooms/');
});

roomRouter.route('/:roomId')
.get( (req,res,next) => {
    Rooms.findById(req.params.roomId)
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
    res.statusCode = 403;
    res.end('Post operation not supported on /rooms/' + req.params.roomId);
})
.put( (req, res, next) => {
    if(req.body.name && req.body.description){
        Rooms.findByIdAndUpdate(req.params.roomId, { $set: { name: req.body.name, description: req.body.description }})
        .then((resp) => {
            if(!resp){
                err = new Error('Room ' + req.params.roomId + ' not found');
                err.status = 404;
                return next(err);            
            }
            Rooms.findById(req.params.roomId)
            .then((data) => {
                pusher.trigger( `rooms` ,'edited',
                {
                    name: data.name,
                    _id:data._id,
                    description: data.description
                }
                )
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err)); 
            
        }, (err) => next(err))
        .catch((err) => next(err)); 
    }
    else if(req.body.description){
        Rooms.findByIdAndUpdate(req.params.roomId, { $set: { description: req.body.description }})
        .then((resp) => {
            if(!resp){
                err = new Error('Room ' + req.params.roomId + ' not found');
                err.status = 404;
                return next(err);            
            }
            Rooms.findById(req.params.roomId)
            .then((data) => {
                pusher.trigger( `rooms` ,'edited',
                {
                    name: data.name,
                    _id:data._id,
                    description: data.description
                }
                )
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err)); 
        }, (err) => next(err))
        .catch((err) => next(err)); 
    }else if (req.body.name){
        Rooms.findByIdAndUpdate(req.params.roomId, { $set: { name: req.body.name }})
        .then((resp) => {
            if(!resp){
                err = new Error('Room ' + req.params.roomId + ' not found');
                err.status = 404;
                return next(err);            
            }
            Rooms.findById(req.params.roomId)
            .then((data) => {
                pusher.trigger( `rooms` ,'edited',
                {
                    name: data.name,
                    _id:data._id,
                    description: data.description
                }
                )
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
            }, (err) => next(err))
            .catch((err) => next(err)); 
        }, (err) => next(err))
        .catch((err) => next(err)); 

    }else {
        err = new Error('Request body not found');
        err.status = 404;
        return next(err); 
    }
})
.delete( (req, res, next) => {
    Rooms.findByIdAndDelete(req.params.roomId)
    .then((data) =>{
        if(!data){
            err = new Error('Room ' + req.params.roomId + ' not found');
            err.status = 404;
            return next(err);            
        }
        pusher.trigger( `rooms` ,'deleted',
                {
                    name: data.name,
                    _id:data._id
                }
                )
        Chats.deleteMany({"room": req.params.roomId})
        .then((resp) => {
            if(!resp){
                err = new Error('Room ' + req.params.roomId + ' not found');
                err.status = 404;
                return next(err);            
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            const retVar = {
                "room":"deleted",
                "roomId" : data._id,
                "messages_deleted": resp.deletedCount
            }
            res.json(retVar);
        }, (err) => next(err))
        .catch((err) => next(err));  
    }, (err) => next(err))
    .catch((err) => next(err)); 

       
});

module.exports = roomRouter;
// export default express.Router(roomRouter);
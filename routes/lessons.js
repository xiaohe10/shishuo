/**
 * Created by t-hexiao on 2016/8/24.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Lesson = require('../models/lesson')
var Question = require('../models/question')
var Comment = require('../models/comment')

router.post('/create', function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    lessonlevel = req.body.lessonlevel;
    lessonsubject = req.body.lessonsubject;
    User.findOne({ _id: userID,token:token }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        // Question.find({lessonLevel:lessonlevel}).count();
        // console.log(count);
        Question.findOne({},function(err,question){
            lesson = new Lesson();
            lesson.user = user;
            lesson.question = question;
            lesson.save(function(err){
                if (err)  {
                    res.json({status:'error','errcode':2});return;
                }
                else res.json({status:'success','lessons':{'lessonID':lesson.id,'question':{'questionID':lesson.question._id,'questionContent':lesson.question.content}}});
            })
        });

    });
});

router.post('/startlive',function(req,res){
    userID = req.body.userID;
    token = req.body.token;
    liveRoomID = req.body.liveRoomID;
    lessonID = req.body.lessonID;
    liveMeta = req.body.liveMeta;
    User.findOne({ _id: userID,token:token },function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.update({_id:lessonID},{liveRoomID:liveRoomID,lessonID:lessonID,liveMeta:liveMeta,videoType:"live"},function(err,numberAffected, rawResponse) {
            if (err) {
                res.json({status: 'error', 'errcode': 2});
                return;
            }else res.json({status:'success','lessons':{'lessonID':lessonID}});
        });
    });
})
router.post('/uploadvideo', function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    lessonID = req.body.lessonID;
    videoID = req.body.videoID;
    User.findOne({ _id: userID,token:token },function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.update({_id:lessonID},{videoID:videoID,videoType:"record"},function(err,numberAffected, rawResponse) {
            if (err) {
                res.json({status: 'error', 'errcode': 2});
                return;
            }else res.json({status:'success','lessons':{'lessonID':lessonID}});
        });
    });
});
router.post('/list', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
    type = req.body.type;
    pagestart = req.body.pagestart;
    if(!pagestart) pagestart = 0;
    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.find().limit(pagestart*10,10).sort({updated:-1}).populate('user').exec(function(err,lessons){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var lessons_serialize = [];
                lessons.forEach(function(lesson){
                    lessons_serialize.push({lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,
                                            thumbnails:lesson.thumbnails,commentnums:"0",likenums:"0",
                                            teacher:{teacherID:lesson.user._id,avatar:lesson.user.avatar,nickname:lesson.user.nickname}})
                });
				//console.log(lessons_serialize);
                res.json({status:'success','lessons':lessons_serialize});
            }
        })
    });
});


router.post('/details', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID
    pagestart = req.body.pagestart;
    if(!pagestart) pagestart = 0;
    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.findOne({_id:lessonID}).populate('user').populate('comments','_id type content replyto replytoName').exec(function(err,lesson){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            if(!lesson){
                res.json({status:'error','errcode':2});
                return;
            }
            else {
                res.json({status:'success',lesson:{lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,
                    thumbnails:lesson.thumbnails,commentnums:"0",likenums:"0",comments:lesson.comments,
                    videoType:lesson.videoType,liveRoomID:lesson.liveRoomID,liveMeta:lesson.liveMeta,videoID:lesson.videoID,
                    teacher:{teacherID:lesson.user._id,avatar:lesson.user.avatar,nickname:lesson.user.nickname}}});
            }
        });
    });
});

router.post('/like',function(req,res){
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID;
    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.update({_id:lessonID},{$push:{likeusers:userID}},function(err,numberAffected, rawResponse) {
            if (err) {
                res.json({status: 'error', 'errcode': 2});
                return;
            }else res.json({status:'success','lesson':{'lessonID':lessonID}});
        });
    });
})
router.post('/comments/create',function(req,res){
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID;

    content = req.body.content;
    type = req.body.type;

    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        comment = new Comment();
        comment.content = content;
        comment.type = type;
        if(!!(req.body.replyto)) {
            comment.replyto = req.body.replyto;
        }
        if(!!(req.body.replytoName)) {
            comment.replytoName = req.body.replytoName;
        }
        comment.user = user;

        comment.save(function(err) {
            if (err) {
                res.json({status: 'error', 'errcode': 3});
                return;
            }
            Lesson.update({_id:lessonID},{$push:{comments:comment._id}},function(err,numberAffected, rawResponse) {
                if (err) {
                    res.json({status: 'error', 'errcode': 4});
                    return;
                }else 
                {
                    Comment.findOne({_id:comment._id}).populate('user').exec(function(err,comment){
                    if (err)  {
                            res.json({status:'error','errcode':2});return;
                    }
                    if(!comment){
                        res.json({status:'error','errcode':2});
                        return;
                    }
                    else {
                        res.json({status:'success','commentID':comment._id,'commentfrom':comment.user.nickname,'commentUserAvatar':comment.user.avatar,'updated':comment.updated,'lessonID':lessonID});
                    }
                    });
                }
            });
        });

    });
})

module.exports = router;

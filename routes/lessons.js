/**
 * Created by t-hexiao on 2016/8/24.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Lesson = require('../models/lesson')

router.post('/create', function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    User.findOne({ _id: userID,token:token }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        lesson = new Lesson();
        lesson.user = user;
        lesson.save(function(err){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else res.json({status:'success','lessons':{'lessonID':lesson.id}});
        })
    });
});

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
        Lesson.update({_id:lessonID},{videoID:videoID},function(err,numberAffected, rawResponse) {
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
        Lesson.find().limit(pagestart*10,10).sort({update:-1}).exec(function(err,lessons){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var lessons_serialize = [];
                lessons.forEach(function(lesson){
                    lessons_serialize.push({'lessonID':lesson.id,'videoID':lesson.videoID,'price':lesson.price,updated:lesson.updated,thumbnails:lesson.thumbnails,
                                            'teacher':{'userID':lesson.user}})
                });
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
        Lesson.findOne({_id:lessonID},function(err,lesson){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            if(!lesson){
                res.json({status:'error','errcode':2});
                return;
            }
            else {
                res.json({status:'success','lessons':{'lessonID':lesson.id,'videoID':lesson.videoID,'price':lesson.price,updated:lesson.updated,thumbnails:lesson.thumbnails,'teacher':{'userID':lesson.user}}});
            }
        })
    });
});


module.exports = router;

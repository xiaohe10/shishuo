/**
 * Created by t-hexiao on 2016/8/24.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Lesson = require('../models/lesson')
var Question = require('../models/question')
var Comment = require('../models/comment')
var Bill = require('../models/bill')
var sizeOf = require('image-size');
var path = require('path');

var ccLive = require('./cclivesdk')
upload = require('./utils/upload').upload;

//抽题
router.post('/choose', function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    lessonType1 = req.body.lessonType1;
    lessonType2 = req.body.lessonType2;
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
        query = {}
        if(!!lessonType1) query["lessonType1"]= lessonType1
        if(!!lessonType2) query["lessonType2"]= lessonType2
        if(!!lessonlevel) query["lessonLevel"]= lessonlevel
        if(!!lessonsubject) query["lessonSubject"]= lessonsubject
        query = {}
        Question.find(query,function(err,question){
            if(err || question.length == 0){
                console.log(err);
                res.json({status:'error','errcode':3});return;
            }
            //question = question[0];
            all = question.length;
            index = Math.floor(Math.random()*all);

            question = question[index];
            res.json({status:'success','question':{'questionID':question._id,'questionContent':question.content,'thumbnails': question.thumbnails,'preparationtime': question.preparationtime,'answertime':question.answertime}});

        });

    });
});

router.post('/createlive',function(req,res){
    userID = req.body.userID;
    token = req.body.token;
    description = req.body.description;
    price = req.body.price;

    startdate = req.body.startdate;
    enddate = req.body.enddate;
    classstarttime = req.body.classstarttime;
    classendtime = req.body.classendtime;

    enrolldeadline = req.body.enrolldeadline;

    classhours = req.body.classhours;
    studentslimit = req.body.studentslimit;

    questionID = req.body.questionID;
    if(!price){
        price = 0;
    }
    User.findOne({ _id: userID,token:token },function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        teacherpass = "shishuo";
        studentpass = "shishuo";
        roomname = description;
        roomdesc = "userID:"+user.telephone;
        ccLive.createLiveRoom(teacherpass,studentpass,roomname,roomdesc,function(roominfo){
			console.log(roominfo);
            roominfo = JSON.parse(roominfo);
            if(roominfo.result!="OK"){
                res.json({status:'error','errcode':3});
                return;
            }
            roomid = roominfo.room.id;

            lesson = new Lesson();
            lesson.videoType = "live";
            lesson.user = user;
            lesson.liveRoomID = roomid;
            lesson.teacherCCpassword = teacherpass;
            lesson.studentCCpassword = studentpass;
            lesson.description = description;

            lesson.startdate = startdate;
            lesson.enddate = enddate;
            lesson.classstarttime = classstarttime;
            lesson.classendtime = classendtime;

            lesson.enrolldeadline = enrolldeadline;
            lesson.classhours = classhours;
            lesson.studentslimit = studentslimit;



            if(!!questionID){
                lesson.question = questionID;
            }
            lesson.price = price;
            //console.log(lesson);
            lesson.save(function(err,lesson){

                if(err){
                    console.log(err);
                    res.json({status:'error','errcode':4});
                    return;
                }else{
                    res.json({status:'success',lessonid:lesson._id,liveroomid:roomid,teacherpass:teacherpass});
                    return;
                }
            })
        })
    });
})
router.post('/uploadvideo', upload.single('thumbnails'), function(req, res) {
// console.log(res);
    userID = req.body.userID;
    token = req.body.token;
    questionID = req.body.questionID;
    videoID = req.body.videoID;
    thumbnails = req.file.filename;
    // console.log(userID);
    // console.log(token);


    price = req.body.price;
    if(!price){
        price = 0;
    }
    User.findOne({ _id: userID,token:token },function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        lesson = new Lesson();
        lesson.videoType = "record";
        lesson.videoID = videoID;
        lesson.thumbnails = thumbnails;
        lesson.price = price;
        lesson.user = user;
        if(!!questionID){
            lesson.question = questionID;
        }
        lesson.save(function(err,lesson){
            if (err) {
                res.json({status: 'error', 'errcode': 3});
                return;
            }else res.json({status:'success'});
        })

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
                    if(lesson.thumbnails=='/images/lesson_thumbnails/sample.jpg'){
                        lesson.thumbnails = 'sample.jpg'
                    }
                    var photo = path.join(__dirname,'../public/images/lesson_thumbnails/')+lesson.thumbnails;
                    var dimensions = sizeOf(photo);

                    lessons_serialize.push({lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,videoType:lesson.videoType,
                                            thumbnails:lesson.thumbnails,thumbnailswidth:dimensions.width,thumbnailsheight:dimensions.height,commentnums:"0",likenums:"0",
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

    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.findOne({_id:lessonID}).populate('user').populate('comments','_id user username type content replyto replytoName').exec(function(err,lesson){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            if(!lesson){
                res.json({status:'error','errcode':2});
                return;
            }else{
                Bill.findOne({lesson:lessonID,student:userID},function(err,bill){
                    var paystate = "unpaid"; // 0
                    if(!err && bill && bill.status==true) {
                        paystate = "paid";
                    }
                    if(lesson.price == 0){
                        paystate = "paid";
                    }
                    if(lesson.user._id == userID){
                        paystate = "owner";
                    }

                    liveInfo = {
                        liveRoomID: lesson.liveRoomID,
                        startdate: lesson.startdate,
                        enddate: lesson.enddate,
                        classstarttime: lesson.classstarttime,
                        classendtime: lesson.classendtime,

                        enrolldeadline: lesson.enrolldeadline,

                        classhours: lesson.classhours,
                        studentslimit: lesson.studentslimit
                    }
                    recordvideoID = ""
                    livePassword = ""
                    if(paystate == "paid" || paystate == "owner"){
                        recordvideoID = lesson.videoID
                        livePassword = {
                            teacherCCpassword: lesson.teacherCCpassword,
                            studentCCpassword: lesson.studentCCpassword
                        }

                    }

                        res.json({status:'success',lesson:{lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,
                            thumbnails:lesson.thumbnails,commentnums:"0",likenums:"0",comments:lesson.comments,
                            videoType:lesson.videoType,
                            teacher:{teacherID:lesson.user._id,avatar:lesson.user.avatar,nickname:lesson.user.nickname
                            },paystate:paystate,videoID:recordvideoID ,liveInfo:liveInfo,livePassword:livePassword}});
                })
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
        comment.username = user.nickname;

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

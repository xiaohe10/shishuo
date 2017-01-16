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
//****************
var ccRecord = require('./ccrecordsdk')
var uuid = require('node-uuid');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var questions = JSON.parse(fs.readFileSync('tiku-order.json', 'utf8'));
var text_questions = JSON.parse(fs.readFileSync('text-tiku.json', 'utf8'));



//*****************
router.post('/abc', function(req, res) {
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
        ccRecord.getRecordVideos("","","","16","json",function(videosinfo){
            console.log(videosinfo);
            videosinfo = JSON.parse(videosinfo);
            console.log(videosinfo.videos.video.length);
            // console.log(data.videos);
            videosinfo.videos.video.forEach(function(video){
                console.log(video.id);
                Lesson.findOne({videoID:video.id},function(err,lesson1){
                    if(err){console.log("ERR");return;}
                    if(!lesson1){
                        console.log("lesson not found , create");
                        lesson = new Lesson();
                        lesson.videoID = video.id;
                        lesson.description = video.desp;
                        lesson.thumbnails = video.image.replace("0.jpg","1.jpg");
                        lesson.user = user;

                        lesson.save(function(err,lesson){
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                console.log("create success");
                            }
                        })
                    }
                    if(lesson1){
                        console.log("lesson exists");
                    }
                });
            });
            res.json({status:'success'});
        });
    });
});
//*****************




//抽题
router.post('/choose', function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    lessonType1 = req.body.lessonType1; //0 代表教师资格证面试/ 1 代表是 教师招聘
    lessonType2 = req.body.lessonType2; //0：说课，1：片段教学，2：试教，3：结构化面试 4：答辩
    lessonlevel = req.body.lessonLevel; // 3:'高中',2:'初中',1:'小学',0:'幼儿园'
    lessonsubject = req.body.lessonSubject; //0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治",9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合"

    User.findOne({ _id: userID,token:token }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }

        questionlist = {}


        lessonlevel_map = {3:'高中',2:'初中',1:'小学',0:'幼儿园'}
        lessonsubject_map = {0:"语文",1:"数学",2:"英语",3:"物理",4:"化学",5:"生物",6:"历史",7:"地理",8:"政治",9:"体育",10:"美术",11:"信息技术",12:"音乐",13:"其他",14:"综合"}
        if(lessonlevel == undefined){
            lessonlevel = 2;
        }
        if(lessonsubject == undefined){
            lessonsubject = 1;
        }
        lessonlevel= lessonlevel_map[lessonlevel] //年级
        lessonsubject= lessonsubject_map[lessonsubject] //学科
        var aval_ques = null;

        console.log('lessonType1',lessonType1,'lessonType2',lessonType2,'lessonlevel:',lessonlevel,',lessonsubject:',lessonsubject);
        if(lessonType1 == 0){
            if(lessonType2 == 3){
                //结构化文本题库
                if(lessonlevel != '幼儿园'){
                    lessonlevel = '中小学';
                }
                aval_ques = text_questions['结构化']
                aval_ques = aval_ques[lessonlevel]
                range = aval_ques.length;
                rand_index =  Math.floor(Math.random() * (range));
                selected_que = aval_ques[rand_index];
                thumbnails = selected_que.thumbnails;
                new_thumb = [];
                for (t in thumbnails){
                    new_t = '/compressed/'+thumbnails[t]+'.jpg'
                    new_thumb.push(new_t);
                }
                selected_que.thumbnails = new_thumb;
                res.json({status:'success','question':{'questionID':0,'questionContent':selected_que,'thumbnails': [],'preparationtime': 30,'answertime':30}});
                return;
            }else{
                //图片题库
                //体育用文字题库
                if(lessonsubject == '体育'){
                    aval_ques = text_questions['体育']
                    aval_ques = aval_ques[lessonlevel]
                    range = aval_ques.length;
                    rand_index =  Math.floor(Math.random() * (range));
                    selected_que = aval_ques[rand_index];
                    thumbnails = selected_que.thumbnails;
                    new_thumb = [];
                    for (t in thumbnails){
                        new_t = '/compressed/'+thumbnails[t]+'.jpg'
                        new_thumb.push(new_t);
                    }
                    selected_que.thumbnails = new_thumb;
                    res.json({status:'success','question':{'questionID':0,'questionContent':selected_que,'thumbnails': [],'preparationtime': 30,'answertime':30}});
                    return;
                }
                if((!!lessonlevel) && (!!lessonsubject)){
                    aval_ques = questions;
                    aval_ques = aval_ques[lessonlevel]
                    if(!!aval_ques){
                        aval_ques = aval_ques[lessonsubject];
                        if(!!aval_ques){
                            range = aval_ques.length;
                            rand_index =  Math.floor(Math.random() * (range));

                            selected_que = aval_ques[rand_index];
                            // console.log(selected_que)

                            thumbnails = selected_que.thumbnails;
                            new_thumb = [];
                            for (t in thumbnails){
                                new_t = '/compressed/'+thumbnails[t]+'.jpg'
                                new_thumb.push(new_t);
                            }
                            selected_que.thumbnails = new_thumb;
                            res.json({status:'success','question':selected_que});
                            return;
                        }
                    }
                }
            }
        }else{
            //教师招聘


            if(lessonType2 == 3){
                //结构化面试
                if(lessonlevel != '幼儿园'){
                    lessonlevel = '中小学';
                }
                aval_ques = text_questions['结构化']
                aval_ques = aval_ques[lessonlevel]
                range = aval_ques.length;
                rand_index =  Math.floor(Math.random() * (range));
                selected_que = aval_ques[rand_index];
                thumbnails = selected_que.thumbnails;
                new_thumb = [];
                for (t in thumbnails){
                    new_t = '/compressed/'+thumbnails[t]+'.jpg'
                    new_thumb.push(new_t);
                }
                selected_que.thumbnails = new_thumb;
                res.json({status:'success','question':{'questionID':0,'questionContent':selected_que,'thumbnails': [],'preparationtime': 30,'answertime':30}});
                return;
            }else if(lessonType2 == 4){
                //答辩
                if(lessonlevel != '幼儿园'){
                    lessonlevel = '中小学';
                }
                aval_ques = text_questions['答辩']
                aval_ques = aval_ques[lessonlevel]
                range = aval_ques.length;
                rand_index =  Math.floor(Math.random() * (range));
                selected_que = aval_ques[rand_index];
                thumbnails = selected_que.thumbnails;
                new_thumb = [];
                for (t in thumbnails){
                    new_t = '/compressed/'+thumbnails[t]+'.jpg'
                    new_thumb.push(new_t);
                }
                selected_que.thumbnails = new_thumb;
                res.json({status:'success','question':{'questionID':0,'questionContent':selected_que,'thumbnails': [],'preparationtime': 30,'answertime':30}});
                return;

            }else{

                //其他用图片题库
                //体育用文字题库
                if(lessonsubject == '体育'){
                    aval_ques = text_questions['体育']
                    aval_ques = aval_ques[lessonlevel]
                    range = aval_ques.length;
                    rand_index =  Math.floor(Math.random() * (range));
                    selected_que = aval_ques[rand_index];
                    thumbnails = selected_que.thumbnails;
                    new_thumb = [];
                    for (t in thumbnails){
                        new_t = '/compressed/'+thumbnails[t]+'.jpg'
                        new_thumb.push(new_t);
                    }
                    selected_que.thumbnails = new_thumb;
                    res.json({status:'success','question':{'questionID':0,'questionContent':selected_que,'thumbnails': [],'preparationtime': 30,'answertime':30}});
                    return;
                }
                if((!!lessonlevel) && (!!lessonsubject)){
                    aval_ques = questions;
                    aval_ques = aval_ques[lessonlevel]
                    if(!!aval_ques){
                        aval_ques = aval_ques[lessonsubject];
                        if(!!aval_ques){
                            range = aval_ques.length;
                            rand_index =  Math.floor(Math.random() * (range));

                            selected_que = aval_ques[rand_index];
                            // console.log(selected_que)

                            thumbnails = selected_que.thumbnails;
                            new_thumb = [];
                            for (t in thumbnails){
                                new_t = '/compressed/'+thumbnails[t]+'.jpg'
                                new_thumb.push(new_t);
                            }
                            selected_que.thumbnails = new_thumb;
                            res.json({status:'success','question':selected_que});
                            return;
                        }
                    }
                }
            }
        }
        if(!aval_ques){
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
        }

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
    console.log(req.file);
	console.log("--------");
	console.log(req.body);
    // console.log(req);
    // console.log(req.files);
    // console.log(req.body);
    userID = req.body.userID;
    token = req.body.token;
    questionID = req.body.questionID;
    videoID = req.body.videoID;
    thumbnails = req.file.filename;
    description = req.body.description;


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
        if(!!description){
            lesson.description = description;
        }
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

    if(!!type && type!=0 && type != 1 && type != 2 && type != 3){
        res.json({status:'error','errcode':0});return;
    }
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
                    // console.log(lesson.id);
                    if(type == 0){
                        if(lesson.videoType != "record" || lesson.user.type != "teacher" || lesson.price != 0){
                            return;
                        }
                    }else if(type == 1){
                        if(lesson.videoType != "record" || lesson.user.type != "student" || lesson.price != 0){
                            return;
                        }
                    }else if(type == 2){
                        if(lesson.videoType != "record" || lesson.user.type != "teacher"){
                            return;
                        }
                    }else if(type == 3){
                        if(lesson.videoType != "live" || lesson.user.type != "teacher"){
                            return;
                        }
                    }

                   if(lesson.thumbnails=='/images/lesson_thumbnails/sample.jpg'){
                       lesson.thumbnails = 'sample.jpg'
                    }
                    if(lesson.thumbnails.length < 60){
                        lesson.thumbnails = '/images/lesson_thumbnails/'+lesson.thumbnails;
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

                    livePassword = ""
                    if(lesson.videoType == "live" && lesson.price == 0){
                        livePassword = {
                            teacherCCpassword: lesson.teacherCCpassword,
                            studentCCpassword: lesson.studentCCpassword
                        }

                    }

                    lessons_serialize.push({lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,videoType:lesson.videoType,
                                            thumbnails:lesson.thumbnails,commentnums:lesson.comments.length,likenums:lesson.likeusers.length,purchased:lesson.purchased,
                                            liveInfo:liveInfo,livePassword:livePassword,teacher:{teacherID:lesson.user._id,avatar:lesson.user.avatar,nickname:lesson.user.nickname,teacherType:lesson.user.type}})
                });
                // console.log(lessons_serialize.length);
                res.json({status:'success','lessons':lessons_serialize});
            }
        })
    });
});

router.post('/details', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID
    console.log(req.body); 
    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Lesson.findOne({_id:lessonID}).populate('user').populate({path:'comments',select:'_id user username type content replyto replytoName',populate:{path:'user',select:'avatar nickname'}}).exec(function(err,lesson){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            if(!lesson){
                res.json({status:'error','errcode':2});
                return;
            }else{
                Bill.findOne({lesson:lessonID,student:userID},function(err,bill){
                    var paystate = "unpaid"; // 0
                    //console.log(bill._id);
					//console.log(bill.status);
					if(err){
						//console.log("err");
					}
					if(!bill){
						//console.log("no bill");
					}
					if(bill){
						console.log(bill._id);
						console.log(bill.status);
					}
					if(!err && bill && bill.status==true) {
					  console.log(bill._id);
					}
					if(!err && bill && bill.status==true) {
						paystate = "paid";
						console.log(bill._id);
						console.log(bill.status);
						console.log("paid------"+paystate);
					}
                    if(!err && bill && bill.status==true) {
                        paystate = "paid";
                        console.log(paystate);
                        console.log(bill._id);
                        console.log(bill.status);
                    }
                    if(lesson.price == 0){
                        paystate = "paid";
                    }
                    if(lesson.user._id == userID){
                        paystate = "owner";
                    }
					console.log("zhong-----"+paystate);
                    console.log(paystate);
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

                    console.log("final-----"+paystate);    
			
                        res.json({status:'success',lesson:{lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,
                            thumbnails:lesson.thumbnails,commentnums:lesson.comments.length,likenums:lesson.likeusers.length,comments:lesson.comments,
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
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var User = require('../models/user')
var Lesson = require('../models/lesson')
var Bill = require('../models/bill')

router.post('/register', function(req, res) {
  var user = new User({telephone:req.body.telephone,password:req.body.password});
  if(req.body.type == 'teacher'){
    user.type = 'teacher';
  }
  if(req.body.sex == 'female'){
    user.sex = 'female';
  }
  if(!!req.body.level){
    user.level = req.body.level;
  }
  if(!!req.body.subject){
    user.type = req.body.subject;
  }
  user.save(function(err){
    if (err)  res.json({status:'error','errcode':1});
    else {
      res.json({status:'success',user:{'userID':user.id}});
      console.log(user);
    }
  })
  ;
});
router.post('/login',function(req,res){

  var telephone = req.body.telephone;
  var password = req.body.password;
  console.log(telephone);
  console.log(password);
  console.log(req.body);
  // fetch user and test password verification
  User.findOne({ telephone: telephone }, function(err, user) {
    if (err) {
      res.json({status:'error','errcode':2});return;
    }
    if(!user){
      res.json({status:'error','errcode':1});
      return;
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err){
        res.json({status:'error','errcode':2});return;
      }
      if(isMatch){
        const crypto = require('crypto');
        token = crypto.randomBytes(64).toString('hex');
        user.token = token;
        user.save(function(err){
          if (err)  res.json({status:'error','errcode':0});
          else res.json({status:'success','user':{'userID':user.id,"token":user.token,"avatar":user.avatar,"nickname":user.nickname,"description":user.description,"type":user.type}});
        })
      }else{
        res.json({status:'error','errcode':2});
      }
    });

  });
});

//修改密码
router.post('/changepassword',function(req,res){
  telephone = req.body.telephone;
  password = req.body.password;
  userID = req.body.userID;
  newpassword = req.body.newpassword;
  re_newpassword = req.body.re_newpassword;
  if(telephone == "anonymous") {
    res.json({status:'error','errcode':1});return;
  }
  // fetch user and test password verification
  User.findOne({ telephone: telephone }, function(err, user) {
    if (err) {
      res.json({status:'error','errcode':2});return;
    }
    if(!user){
      res.json({status:'error','errcode':1});
      return;
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err){
        res.json({status:'error','errcode':2});return;
      }
      if(isMatch){

        if(newpassword == re_newpassword){
          // generate a salt
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err){
              res.json({status: 'error', 'errcode': 2});
              return;
            }
            // hash the password using our new salt
            bcrypt.hash(newpassword, salt, function(err, hash) {
              if (err){
                res.json({status: 'error', 'errcode': 2});
                return;
              }
              User.update({_id:userID},{telephone:telephone,password:hash},function(err,numberAffected, rawResponse) {
                if (err) {
                  res.json({status: 'error', 'errcode': 2});
                  return;
                }else res.json({status:'success',user:{'userID':userID}});
              });
            });
          });
        }else{
          res.json({status:'error','errcode':2});
        }
      }});

  });
});

router.post('/logout', function (req, res){
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
    const crypto = require('crypto');
    token = crypto.randomBytes(64).toString('hex');
    user.token = token;
    user.save(function(err){
      if (err)  res.json({status:'error','errcode':0});
      else res.json({status:'success','user':{'userID':user.id,"token":user.token}});
    })
  });
});

//修改用户头像
router.post('/changeavatar',multipartMiddleware,function (req, res){
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
    var filestr = uuid.v1();
    console.log("Received file:\n" + JSON.stringify(req.files));
    var fileext = req.files.file.name.split('.');
    var fileExt = fileext[fileext.length-1];
    var filename = filestr+"."+fileExt;
    var location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
    var readStream = fs.createReadStream(req.files.file.path)
    var writeStream = fs.createWriteStream(location);
    var newavatar = "/images/avatars/"+filename;
    readStream.pipe(writeStream);
    readStream.on('end',function(err){
        if(err){
          res.json({status:'error','errcode':2});
        } else {
          fs.unlinkSync(req.files.file.path);
          User.update({_id:userID},{avatar:newavatar},function(err,numberAffected, rawResponse) {
          if (err) {
              res.json({status:'error','errcode': 2});
              return;
            }else {
              res.json({status:'success',user:{'userID':userID,'userAvatar':newavatar}});}
          });
        }
    })
  });
});

//个人信息获取接口
router.post('/getinfo', function (req, res){
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
    else{
      res.json({status:'success',user:{'userID':userID,'userAvatar':user.avatar,'nickname':user.nickname,'description':user.description,'type':user.type,
                                        'level':user.level,'subject':user.subject,'school':user.school,'style':user.style,'sex':user.sex,'education':user.education}});
    }
  });
});

//用户修改个人信息接口
router.post('/changeinfo',function (req, res){
  userID = req.body.userID;
  token = req.body.token;
  description = req.body.description;
  username = req.body.username;
  school = req.body.school;
  subject = req.body.subject;
  level = req.body.level;
  sex = req.body.sex;
  style = req.body.style;
    education = req.body.education;
  User.findOne({ _id: userID,token:token }, function(err, user) {
    if (err) {
      res.json({status:'error','errcode':2});return;
    }
    if(!user){
      res.json({status:'error','errcode':1});
      return;
    }
    User.update({_id:userID},{description:description,nickname:username,school:school,subject:subject,level:level,sex:sex,style:style,education:education},function(err,numberAffected, rawResponse) {
    if (err) {
        res.json({status:'error','errcode': 2});
        return;
      }else {
        res.json({status:'success',user:{'userID':userID}});}
    });
  });
});


//我的视频获取接口
router.post('/myvideo', function (req, res){
  userID = req.body.userID;
  token = req.body.token;
  pagestart = req.body.pagestart;

  if(!pagestart) pagestart = 0;
  User.findOne({ _id: userID,token:token }, function(err, person) {
      if (err) {
          res.json({status:'error','errcode':2});return;
      }
      if(!person){
          res.json({status:'error','errcode':1});
          return;
      }
      Lesson.find({user:person}).limit(pagestart*10,10).sort({updated:-1}).populate('user').exec(function(err,lessons){
          if (err)  {
              res.json({status:'error','errcode':2});return;
          }
          else {
              var lessons_serialize = [];
              lessons.forEach(function(lesson){
                      if(lesson.thumbnails=='/images/lesson_thumbnails/sample.jpg'){
                         lesson.thumbnails = 'sample.jpg'
                      }
                      lesson.thumbnails = '/images/lesson_thumbnails/'+lesson.thumbnails;
                      lessons_serialize.push({lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,videoType:lesson.videoType,videoID:lesson.videoID,
                        thumbnails:lesson.thumbnails,commentnums:lesson.comments.length,likenums:lesson.likeusers.length})
            });
            res.json({status:'success','lessons':lessons_serialize});
        }
      })
  });
});

//我要上课，我要听课接口
router.post('/mylessons', function (req, res){
  userID = req.body.userID;
  token = req.body.token;
  type = req.body.type;
  pagestart = req.body.pagestart;

  if(!pagestart) pagestart = 0;

  User.findOne({ _id: userID,token:token }, function(err, person) {
      if (err) {
          res.json({status:'error','errcode':2});return;
      }
      if(!person){
          res.json({status:'error','errcode':1});
          return;
      }
      if(type == 'student'){
          Bill.find({student:person._id}).limit(pagestart*10,10).sort({updated:-1}).populate('lesson').exec(function(err,bills){
              if (err)  {
                  res.json({status:'error','errcode':2});return;
              }
              else {
                  var lessons_serialize = [];
                  bills.forEach(function(bill){
                          livePassword = ""
                          if(bill.status == true){
                              livePassword = {
                                  teacherCCpassword: bill.lesson.teacherCCpassword,
                                  studentCCpassword: bill.lesson.studentCCpassword
                              }
                          }
                          lessons_serialize.push({lessonID:bill.lesson.id,price:bill.lesson.price,updated:bill.lesson.updated,description:bill.lesson.description,
                            videoType:bill.lesson.videoType,videoID:bill.lesson.videoID,thumbnails:bill.lesson.thumbnails,billID:bill.id,status:bill.status,liveroom:bill.lesson.liveRoomID,livePassword:livePassword})
                });
                res.json({status:'success','lessons':lessons_serialize});
            }
          })
      }
      else{
          Lesson.find({user:person}).limit(pagestart*10,10).sort({updated:-1}).populate('lesson').exec(function(err,lessons){
              if (err)  {
                  res.json({status:'error','errcode':2});return;
              }
              else {
                  var lessons_serialize = [];
                  lessons.forEach(function(lesson){
                          livePassword = {
                              teacherCCpassword: lesson.teacherCCpassword,
                              studentCCpassword: lesson.studentCCpassword
                          }
                          lessons_serialize.push({lessonID:lesson.id,price:lesson.price,updated:lesson.updated,description:lesson.description,
                            videoType:lesson.videoType,videoID:lesson.videoID,thumbnails:lesson.thumbnails,liveroom:lesson.liveRoomID,livePassword:livePassword})
                });
                res.json({status:'success','lessons':lessons_serialize});
            }
          })
      }
  });
});

module.exports = router;

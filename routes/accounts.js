var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var randomstring = require("randomstring");
var path = require('path');
var uuid = require('node-uuid');
var User = require('../models/user')
var Lesson = require('../models/lesson')
var Bill = require('../models/bill')
var Invitecode = require('../models/invitecode')

router.post('/verify',function(req, res) {
    var userid = req.body.userid;
    var token = req.body.token;
    var avatar = req.body.avatar;
    var username = req.body.username;
    var sex = req.body.sex;

    User.findOne({openid:userid},function(err,person){
        if(!person){
          var tele = randomstring.generate({
                length:11,
                charset:'numberic'
            });
          console.log(tele);
          var avatar_file = '/images/avatars/' + userid + ".jpeg";
          var location = path.join(__dirname,'../public')+avatar_file;
          request(avatar).pipe(fs.createWriteStream(location)).on('close', function(){ return; });
          const crypto = require('crypto');
          usertoken = crypto.randomBytes(64).toString('hex');
          var user = new User({
            telephone:tele,
            password:randomstring.generate(6),
            nickname:username,
            avatar:avatar_file,
            token:usertoken,
            openid:userid,
            sex:sex
          });
          user.save(function(err){
              if (err)  res.json({status:'error','errcode':1});
              else {
                res.json({status:'success',user:{'userID':user.id,"token":user.token,"avatar":user.avatar,"nickname":user.nickname,"description":user.description,"type":user.type}});
                console.log(user);
              }
          });
        }
        if(!!person){
          const crypto = require('crypto');
          token = crypto.randomBytes(64).toString('hex');
          person.token = token;
          person.save(function(err){
            if (err)  res.json({status:'error','errcode':0});
            else{
              res.json({status:'success',user:{'userID':person.id,"token":person.token,"avatar":person.avatar,"nickname":person.nickname,"description":person.description,"type":person.type}});
              console.log(person);
            }
          });
        }
    });
});

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
    user.subject = req.body.subject;
  }
  User.findOne({telephone:req.body.telephone},function(err,person){
    if (err) {
      res.json({status:'error','errcode':1});return;
    }
    if(person){
      res.json({status:'error','errcode':3});return;
    }
    if(!person){
      if(user.type == 'teacher' || !!req.body.invitecode){
        Invitecode.findOne({code:req.body.invitecode},function(err,invitecode){
          if(err) {
            res.json({status:'error','errcode':1});return;
          }
          if(!invitecode){
            res.json({status:'error','errcode':2});return;
          }
          user.save(function(err){
            if (err)  res.json({status:'error','errcode':1});
            else {
              res.json({status:'success',user:{'userID':user.id}});
              console.log(user);
            }
          });
        });
      }else{
        user.save(function(err){
          if (err)  res.json({status:'error','errcode':1});
          else {
            res.json({status:'success',user:{'userID':user.id}});
            console.log(user);
          }
        });
      }
    }
  });

});

router.post('/forgetpwd', function(req, res) {
  var telephone = req.body.telephone;
  var newpassword = req.body.newpassword;

  User.findOne({telephone:telephone},function(err,user){
    if (err) {
      res.json({status:'error','errcode':1});return;
    }
    if(!user){
      res.json({status:'error','errcode':2});return;
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err){
        res.json({status: 'error', 'errcode': 1});
        return;
      }
      // hash the password using our new salt
      bcrypt.hash(newpassword, salt, function(err, hash) {
        if (err){
          res.json({status: 'error', 'errcode': 1});
          return;
        }
        User.update({telephone:telephone},{password:hash},function(err,numberAffected, rawResponse) {
          if (err) {
            res.json({status: 'error', 'errcode': 1});
            return;
          }else res.json({status:'success'});
        });
      });
    });
  });
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
  // telephone = req.body.telephone;
  password = req.body.password;
  userID = req.body.userID;
  newpassword = req.body.newpassword;
  re_newpassword = req.body.re_newpassword;
  token = req.body.token;
  if(userID == "57c46e700d21db303f349c55") {
    res.json({status:'error','errcode':0});return;
  }
  // fetch user and test password verification
  User.findOne({ _id:userID,token:token}, function(err, user) {
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
              User.update({_id:userID},{password:hash},function(err,numberAffected, rawResponse) {
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
              res.json({status:'success',user:{'userID':userID,'avatar':newavatar}});}
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
      res.json({status:'success',user:{'userID':userID,'avatar':user.avatar,'nickname':user.nickname,'description':user.description,'type':user.type,
                                        'level':user.level,'subject':user.subject,'school':user.school,'style':user.style,'sex':user.sex,'education':user.education}});
    }
  });
});

//用户修改个人信息接口
router.post('/changeinfo',multipartMiddleware,function (req, res){
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
    if(!!req.files && !!req.files.avatar){
      var filestr = uuid.v1();
      console.log("Received file:\n" + JSON.stringify(req.files));
      var fileext = req.files.avatar.name.split('.');
      var fileExt = fileext[fileext.length-1];
      var filename = filestr+"."+fileExt;
      var location = path.join(__dirname,'../public')+"/images/avatars/"+filename;
      var readStream = fs.createReadStream(req.files.avatar.path)
      var writeStream = fs.createWriteStream(location);
      var newavatar = "/images/avatars/"+filename;
      readStream.pipe(writeStream);
      readStream.on('end',function(err){
          if(err){
            res.json({status:'error','errcode':2});
          } else {
            fs.unlinkSync(req.files.avatar.path);
            User.update({_id:userID},{avatar:newavatar,description:description,nickname:username,school:school,subject:subject,level:level,sex:sex,style:style,education:education},function(err,numberAffected, rawResponse) {
            if (err) {
                res.json({status:'error','errcode': 2});
                return;
              }else {
                res.json({status:'success',user:{'userID':userID,'avatar':newavatar}});}
            });
          }
      })
    }
    else{
      User.update({_id:userID},{description:description,nickname:username,school:school,subject:subject,level:level,sex:sex,style:style,education:education},function(err,numberAffected, rawResponse) {
      if (err) {
          res.json({status:'error','errcode': 2});
          return;
        }else {
          res.json({status:'success',user:{'userID':userID}});}
      });
    }
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
                          liveInfo = {
                              liveRoomID: bill.lesson.liveRoomID,
                              startdate: bill.lesson.startdate,
                              enddate: bill.lesson.enddate,
                              classstarttime: bill.lesson.classstarttime,
                              classendtime: bill.lesson.classendtime,

                              enrolldeadline: bill.lesson.enrolldeadline,

                              classhours: bill.lesson.classhours,
                              studentslimit: bill.lesson.studentslimit
                          }
                          lessons_serialize.push({lessonID:bill.lesson.id,price:bill.lesson.price,updated:bill.lesson.updated,description:bill.lesson.description,
                            videoType:bill.lesson.videoType,videoID:bill.lesson.videoID,thumbnails:bill.lesson.thumbnails,billID:bill.id,status:bill.status,
                            liveInfo:liveInfo,livePassword:livePassword,commentnums:bill.lesson.comments.length,likenums:bill.lesson.likeusers.length})
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

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var User = require('../models/user')

router.post('/register', function(req, res) {
  var user = new User({telephone:req.body.telephone,password:req.body.password,type:req.body.type});
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
        const crypto = require('crypto');
        token = crypto.randomBytes(64).toString('hex');
        user.token = token;
        user.save(function(err){
          if (err)  res.json({status:'error','errcode':0});
          else res.json({status:'success','user':{'userID':user.id,"token":user.token,"type":user.type}});
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

module.exports = router;

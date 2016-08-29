var express = require('express');
var router = express.Router();

var User = require('../models/user')

router.post('/register', function(req, res) {
  var user = new User({telephone:req.body.telephone,password:req.body.password});
  user.save(function(err){
    if (err)  res.json({status:'error','errcode':1});
    else res.json({status:'success',user:{'userID':user.id}});
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
          else res.json({status:'success','user':{'userID':user.id,"token":user.token}});
        })

      }else{
        res.json({status:'error','errcode':2});
      }
    });

  });
});


module.exports = router;

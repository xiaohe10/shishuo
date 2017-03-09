/**
 * Created by TonyJ on 2017/3/9.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Androidupdate = require('../models/androidupdate')

router.post('/create', function(req, res) {
    androidupdate = new Androidupdate();

    androidupdate.save(function(err){
        if (err)  {
            res.json({status:'error','errcode':2});return;
        }
        else res.json({status:'success','androidupdate':{'androidupdateID':androidupdate._id}});
    })
});

router.post('/getVersion', function(req, res) {
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
        Androidupdate.findOne({_id:'58c0ca008be36e26f470548f'},function(err,androidupdate){
            if(err){
                res.json({status:'error','errcode':2});return;
            }
            if(!androidupdate){
                res.json({status:'error','errcode':1});
                return;
            }
            res.json({status:'success',androidupdate:{'versioncode':androidupdate.versioncode,'description':androidupdate.description}});
        });
    });
});




module.exports = router;
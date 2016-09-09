/**
 * Created by t-hexiao on 2016/9/9.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Lesson = require('../models/lesson')
var Pay = require('../models/pay')

router.post('/create', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID;
    // price = req.body.price;

    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Pay.findOne({lesson:lessonID,user:userID},function(err,pay){
            if(err){
                res.json({status:'error','errcode':3});return;

            }else{
                //already pay
                if(!!pay){
                    res.json({status:'error','errcode':4});return;
                }else{
                    pay = new Pay()
                    pay.user = user;
                    pay.lesson = lessonID;

                    pay.save(function(err){
                        if (err)  {
                            res.json({status:'error','errcode':5});return;
                        }
                        else res.json({status:'success'});
                    })
                }

            }
        })

    });
});
router.post('/paid', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
    lessonID = req.body.lessonID;
    // price = req.body.price;

    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        Pay.findOne({lesson:lessonID,user:userID},function(err,pay){
            if(err){
                res.json({status:'error','errcode':3});return;
            }else{
                //already pay
                res.json({status:'success'});
            }
        })

    });
});

module.exports = router;
/**
 * Created by t-hexiao on 2016/9/9.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Question = require('../models/question')

router.post('/create', function(req, res) {
    question = new Question();
    question.lessonLevel = req.body.lessonLevel;
    question.lessonSubject = req.body.lessonSubject;
    question.content = req.body.content;

    question.save(function(err){
        if (err)  {
            res.json({status:'error','errcode':2});return;
        }
        else res.json({status:'success','question':{'questionID':question._id,'content':question.content}});
    })
});


module.exports = router;
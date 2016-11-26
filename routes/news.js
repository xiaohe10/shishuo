/**
 * Created by t-hexiao on 2016/9/9.
 */

var express = require('express');
var router = express.Router();

var User = require('../models/user')
var News = require('../models/news')
var Comment = require('../models/comment')
var upload = require('./utils/upload').upload;

router.post('/create', upload.array('newsimages',12),function(req, res) {
    userID = req.body.userID;
    token = req.body.token;
    savedimages = []
    req.files.forEach(function(e){
        savedimages.push(e.filename);
    })
    images = savedimages;
    content = req.body.content;
    User.findOne({ _id: userID,token:token }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        news = new News();
        news.user = user;
        news.images = images;
        news.content = content;
        news.save(function(err){
            if (err)  {
                res.json({status:'error','errcode':3});return;
            }
            else res.json({status:'success','news':{'newsID':news._id,}});
        })

    });
});

router.post('/list', function(req, res) {
    userID = req.body.userID;
    usertoken = req.body.token;
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
        News.find().limit(pagestart*10,10).sort({updated:-1}).populate('user').populate('likeusers','_id nickname').populate('comments','_id user username type content replyto replytoName').exec(function(err,newses){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var news_serialize = [];
                newses.forEach(function(news){
                    news_serialize.push({newsID:news._id,updated:news.updated,content:news.content,commentnums:news.commentnums,likenums:news.likenums,
                        likeusers:news.likeusers,images:news.images,
                        comments:news.comments,
                        user:{userID:news.user._id,avatar:news.user.avatar,nickname:news.user.nickname}})
                });
                res.json({status:'success','newses':news_serialize});

            }
        })
    });
});

router.post('/like',function(req,res){
    userID = req.body.userID;
    usertoken = req.body.token;
    newsID = req.body.newsID;
    User.findOne({ _id: userID,token:usertoken }, function(err, user) {
        if (err) {
            res.json({status:'error','errcode':2});return;
        }
        if(!user){
            res.json({status:'error','errcode':1});
            return;
        }
        News.update({_id:newsID},{$push:{likeusers:userID}},function(err,numberAffected, rawResponse) {
            if (err) {
                res.json({status: 'error', 'errcode': 2});
                return;
            }else res.json({status:'success','news':{'news':newsID}});
        });
    });
})

router.post('/comments/create',function(req,res){
    userID = req.body.userID;
    usertoken = req.body.token;
    newsID = req.body.newsID;

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
            News.update({_id:newsID},{$push:{comments:comment._id}},function(err,numberAffected, rawResponse) {
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
                            res.json({status:'success','commentID':comment._id,'commentfrom':comment.user.nickname,'commentUserAvatar':comment.user.avatar,'updated':comment.updated,'newsID':newsID});
                        }
                    });
                }
            });
        });

    });
})

module.exports = router;
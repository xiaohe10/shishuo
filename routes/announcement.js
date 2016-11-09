
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Announcement = require('../models/announcement')

router.post('/create', function(req, res) {
	userID = req.body.userID;
    usertoken = req.body.token;
    classtimestart = req.body.classtimestart;
    classtimeend = req.body.classtimeend;
    classtime = req.body.classtime;
    liveaddress = req.body.liveaddress;
    limit = req.body.limit;
    money = req.body.money;
    expirydate = req.body.expirydate;
    classhours = req.body.classhours;
    description = req.body.description;

    User.findOne({_id:userID,token:usertoken},function(err,user){
    	if(err){
    		res.json({status:'error','errcode':2});return;
    	}
    	if(!user){
    		res.json({status:'error','errcode':1});
    		return;
    	}
    	announcement = new Announcement();
    	announcement.user = user;
    	announcement.classtimestart = classtimestart;
        announcement.classtimeend = classtimeend;
        announcement.classtime = classtime;
        announcement.liveaddress = liveaddress;
        announcement.limit = limit;
        announcement.expirydate = expirydate;
		announcement.money = money;
        announcement.classhours = classhours;
    	if(description != ''){
    		announcement.description = description;
    	}
    	announcement.save(function(err){
	        if (err)  {
	            res.json({status:'error','errcode':2});return;
	        }
	        Announcement.findOne({_id:announcement._id}).populate('user').exec(function(err,announcement){
	        	if(err){
	        		res.json({status:'error','errcode':2});return;
	        	}
	        	if(!announcement){
	        		res.json({status:'error','errcode':2});
	        		return;
	        	}
	        	else{
	        		res.json({status:'success','announcement':{'announcementID':announcement._id,'classtimestart':announcement.classtimestart,'classtime':announcement.classtime}});
	        	}
	        });
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
        Announcement.find({user:userID}).limit(pagestart*10,10).sort({updated:-1}).populate('user').exec(function(err,announcements){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var announcements_serialize = [];
                announcements.forEach(function(announcement){
                    announcements_serialize.push({announcementID:announcement._id,classtimestart:announcement.classtimestart,classtimeend:announcement.classtimeend,
                                            classtime:announcement.classtime,liveaddress:announcement.liveaddress,limit:announcement.limit,updated:announcement.updated,
                                            classhours:announcement.classhours,expirydate:announcement.expirydate,description:announcement.description,money:announcement.money,
                                            user:{userID:announcement.user._id,avatar:announcement.user.avatar,nickname:announcement.user.nickname}})
                });
                res.json({status:'success','announcements':announcements_serialize});
            }
        })
    });
});

module.exports = router;
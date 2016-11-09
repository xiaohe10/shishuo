
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Bill = require('../models/bill')

router.post('/create', function(req, res) {
	userID = req.body.userID;
    usertoken = req.body.token;
    money = req.body.money;
    isout = req.body.isout;
    description = req.body.description;

    User.findOne({_id:userID,token:usertoken},function(err,user){
    	if(err){
    		res.json({status:'error','errcode':2});return;
    	}
    	if(!user){
    		res.json({status:'error','errcode':1});
    		return;
    	}
    	bill = new Bill();
    	bill.owner = user;
    	bill.isout = isout;
		bill.money = money;
    	if(description != ''){
    		bill.description = description;
    	}
    	bill.save(function(err){
	        if (err)  {
	            res.json({status:'error','errcode':2});return;
	        }
	        Bill.findOne({_id:bill._id}).populate('owner').exec(function(err,bill){
	        	if(err){
	        		res.json({status:'error','errcode':2});return;
	        	}
	        	if(!bill){
	        		res.json({status:'error','errcode':2});
	        		return;
	        	}
	        	else{
	        		res.json({status:'success','bill':{'billID':bill._id,'owner':bill.owner.nickname,'money':bill.money,'isout':bill.isout,'description':bill.description}});
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
        Bill.find({owner:userID}).limit(pagestart*10,10).sort({updated:-1}).populate('owner').exec(function(err,bills){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var bills_serialize = [];
                bills.forEach(function(bill){
                    bills_serialize.push({billID:bill._id,money:bill.money,updated:bill.updated,description:bill.description,
                                            isout:bill.isout,
                                            owner:{ownerID:bill.owner._id,avatar:bill.owner.avatar,nickname:bill.owner.nickname}})
                });
                res.json({status:'success','bills':bills_serialize});
            }
        })
    });
});

module.exports = router;
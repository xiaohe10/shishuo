
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Suggestion = require('../models/suggestion')

router.post('/create', function(req, res) {
	userID = req.body.userID;
    usertoken = req.body.token;
    content = req.body.content;

    User.findOne({_id:userID,token:usertoken},function(err,user){
    	if(err){
    		res.json({status:'error','errcode':2});return;
    	}
    	if(!user){
    		res.json({status:'error','errcode':1});
    		return;
    	}
    	suggestion = new Suggestion();
    	suggestion.user = user;
        suggestion.content = content;

    	suggestion.save(function(err){
	        if (err)  {
	            res.json({status:'error','errcode':2});return;
	        }
            else{
                 res.json({status:'success','suggestion':{'suggestionID':suggestion._id}});
            }
    	})
    });
});


module.exports = router;

var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Bill = require('../models/bill')
var Lesson = require('../models/lesson')
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

router.post('/create', function(req, res) {
	userID = req.body.userID;
    usertoken = req.body.token;
    money = req.body.money;
    lessonID = req.body.lessonID;

    User.findOne({_id:userID,token:usertoken},function(err,user){
    	if(err){
    		res.json({status:'error','errcode':2});return;
    	}
    	if(!user){
    		res.json({status:'error','errcode':1});
    		return;
    	}
    	Lesson.findOne({_id:lessonID}).populate('user').exec(function(err,lesson){
            if(err){
                res.json({status:'error','errcode':3});
                return;
            }
            bill = new Bill();
            bill.money = money;
            bill.lesson = lesson;
            bill.student = user;
            bill.teacher = lesson.user;
            bill.description_student = "您购买了 {0} 的课程:{1}".format(lesson.user.nickname,lesson.description);
            bill.description_teacher = "{0} 购买了您的课程:{1}".format(user.nickname,lesson.description);
            bill.save(function(err){
                if(err){
                    res.json({status:'error','errcode':4});return;
                }
                res.json({status:'success'});
            })
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
        Bill.find({$or:[{"teacher":userID},{"student":userID}]}).limit(pagestart*10,10).sort({updated:-1}).exec(function(err,bills){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else {
                var bills_serialize = [];
                bills.forEach(function(bill){
                    isout = true;
                    description = bill.description_student;
                    if(bill.teacher == userID){
                        isout = false;
                        description = bill.description_teacher;
                    }
                    bills_serialize.push({billID:bill._id,money:bill.money,updated:bill.updated,description:description,
                                            isout:isout})
                });
                res.json({status:'success','bills':bills_serialize});
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
        Bill.findOne({lesson:lessonID,student:userID},function(err,pay){
            if(err){
                res.json({status:'error','errcode':3});return;
            }else{
                //already pay
                if(!!pay){
                    res.json({status:'success'});
                }else{
                    res.json({status:'error','errcode':4});return;
                }

            }
        })

    });
});
module.exports = router;
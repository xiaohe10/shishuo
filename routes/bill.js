
var express = require('express');
var router = express.Router();

var User = require('../models/user')
var Bill = require('../models/bill')
var Lesson = require('../models/lesson')
var format = require('string-format')
var crypto = require('crypto');
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
    	Bill.findOne({lesson:lessonID,student:userID},function(err,bill){
    		if(err){
    			res.json({status:'error','errcode':2});return;
    		}
    		if(bill){
    			res.json({status:'error','errcode':5,'billstatus':bill.status});return;
    		}
    		if(!bill){
	    		Lesson.findOne({_id:lessonID}).populate('user').exec(function(err,lesson){
		            if(err){
		                res.json({status:'error','errcode':3});
		                return;
		            }
		            // console.log(lesson);
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
		                res.json({status:'success','billID':bill._id});
		            })
		        })
    		}
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
                    bills_serialize.push({billID:bill._id,money:bill.money,updated:bill.updated,status:bill.status,description:description,
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

//webhook回调接口
router.post('/webhook', function(req, res) {
	var App_ID = '04250155-4651-42d1-917d-2f793f720806';//后续根据平台申请的更改
	var App_Secret = '811671b6-34d6-4db5-b020-484dcc8bf844';//后续根据平台申请的更改
	timestamp = req.body.timestamp; //1426817510111
	sign = req.body.sign;
	transaction_fee = req.body.transaction_fee;
	transaction_id = req.body.transaction_id;
	transaction_type = req.body.transaction_type;
	// channel_type = req.body.channel_type;

	var signstr = getmd5(App_ID+App_Secret+timestamp);
	console.log(signstr);
	console.log(sign);
	console.log(transaction_type);
	console.log(transaction_id);
	console.log(transaction_fee);
	if(signstr!=sign){
		console.log("A");
	}
	if(signstr!=sign || transaction_type!="PAY"){
		res.json({status:'error','errcode':2});
		console.log("B");
		return;
	}
	Bill.findOne({_id:transaction_id},function(err,bill){
		if(err){
			console.log("C");
			return;
		}
<<<<<<< HEAD
		//if(bill.status == true || transaction_fee != bill.money){
		//	console.log("D");
		//	return;
		//}
	    if(bill.status == true){
		   console.log("D");
		   return;
=======
		if(bill.status == true || transaction_fee != bill.money){
			console.log("D");
			return;
>>>>>>> 1310ecf96639509dd1f6a370082949b1746d0df0
		}
		else{
			Bill.update({_id:bill._id},{status:true},function(err,numberAffected, rawResponse) {
                if (err) {
<<<<<<< HEAD
					console.log("E");
                  return;
                }else{
					console.log("F");
=======
                	console.log("E");
                  return;
                }else{
                	console.log("F");
>>>>>>> 1310ecf96639509dd1f6a370082949b1746d0df0
                	res.send("success");
                }
            });
		}
	});
});

function getmd5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};
module.exports = router;

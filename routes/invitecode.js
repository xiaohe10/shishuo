
var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var Invitecode = require('../models/invitecode')


router.post('/create', function(req, res) {

    for(i = 0;i < 100;i++){
        var invitecode = new Invitecode();
        invitecode.code = randomstring.generate({
            length:8,
            capitalization:'uppercase'
        });
        console.log("----------->"+invitecode.code);
        invitecode.save(function(err){
            if (err)  {
                res.json({status:'error','errcode':2});return;
            }
            else res.json({status:'success'});
        })
    }
});
router.post('/list', function(req, res) {
    Invitecode.find().exec(function(err,codes){
        if (err)  {
            res.json({status:'error','errcode':2});return;
        }
        else {
            codes.forEach(function(code){
                console.log(code.code);
            });
            res.json({status:'success'});

        }
    });
});



module.exports = router;
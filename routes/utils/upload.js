/**
 * Created by xiaohe on 2016/11/26.
 */

/*
 * Uploads Config
 *
 */
var multer = require('multer');
var crypto = require('crypto');
var  rand = require('csprng')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'thumbnails') {
            cb(null, 'public/images/lesson_thumbnails');
        }else if(file.fieldname == 'avatar'){
            cb(null,'public/images/avatars')
        }else if(file.fieldname == 'newsimages'){
            cb(null,'public/images/newsimages')
        }
    },
    filename: function (req, file, cb) {
        var tokens = file.originalname.split(".");

        var name = crypto.createHash('md5').update(Date.now() + rand(160, 36)).digest("hex");
        cb(null, name + Date.now() + "." + tokens[tokens.length - 1]);
    }
});
module.exports.upload = multer({ storage: storage });
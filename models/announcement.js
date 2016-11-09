

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Lesson = require('./lesson');

var AnnouncementSchema   = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    classtimestart:{type: Date},//开课时间
    classtimeend:{type: Date},//结课时间
    classtime:{type: Date},//上课时间
    liveaddress:{type:String},//直播地址
    limit:{type: Number, min: 0, default: 100},//限制人数
    paid:{type: Number, min: 0, default: 0},//已购买人数
    expirydate:{type: Date},//报名截止时间
    classhours:{type: Number, min: 0, default: 0},//课时数
    description:{type:String,default:"这是课程描述"},
    money:{ type: Number, min: 0, default: 0},//点播价格
    updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);



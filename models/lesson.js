/**
 * Created by t-hexiao on 2016/8/24.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Question = require('./question');

var LessonSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    description: { type: String,default:"课程描述"},
    tabs:{type:String,default:"popular,moke"},

    videoType:{type:String,default:"record"}, // record 录播，live 直播，livefinished 直播已经结束
    videoID:{type:String,default:"0"},

    //如果是直播，那么记录 liveRoomID
    liveRoomID:{type:String,default:"0"},
    liveTime:{ type: String, default: "" },
    teacherCCID:{type:String,default:"0"},
    teacherCCpassword:{type:String,default:"0"},
    studentCCID:{type:String,default:"0"},
    studentCCpassword:{type:String,default:"0"},

    price:{ type: Number, min: 0, default: 0},
    updated: { type: Date, default: Date.now },
    likenums:{type: Number, min: 0, default: 0},
    likeusers:[{type: Schema.Types.ObjectId, ref: 'User'}],

    commentnums:{type:Number,min:0,default:0},
    comments:[{type: Schema.Types.ObjectId, ref: 'Comment'}],

    updated: { type: Date, default: Date.now },
    thumbnails:{type:String,default:'/images/lesson_thumbnails/sample.jpg'},

    question:{type:Schema.Types.ObjectId,ref:"Question"}
});

module.exports = mongoose.model('Lesson', LessonSchema);



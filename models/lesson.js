/**
 * Created by t-hexiao on 2016/8/24.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');

var LessonSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    description: { type: String},
    videoID:{type:String,default:"0"},
    price:{ type: Number, min: 0, default: 0},
    updated: { type: Date, default: Date.now },
    likenums:{type: Number, min: 0, default: 0},
    commentnums:{type:Number,min:0,default:0},
    thumbnails:{type:String,default:'/images/lesson_thumbnails/sample.jpg'}
});

module.exports = mongoose.model('Lesson', LessonSchema);



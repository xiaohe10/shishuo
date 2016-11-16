/**
 * Created by t-hexiao on 2016/9/9.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');

var QuestionSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    lessonType1:{ type: String,default:"教室资格证面试,教室招聘"},
    lessonType2:{ type: String,default:"说课，片段教学"},
    lessonLevel:{type:String,default:"-1"},
    lessonSubject:{type:String,default:"-1"},
    content: { type: String,default:"问题描述：荷塘月色"},
    thumbnails:{type:String,default:'/images/question_thumbnails/sample.jpg'},
    preparationtime:{type:Number,min:0,default:10},
    answertime:{type:Number,min:0,default:40},
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);



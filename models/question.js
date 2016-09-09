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
    lessonLevel:{type:String,default:"小学"},
    lessonSubject:{type:String,default:"语文"},
    content: { type: String,default:"问题描述：荷塘月色"}
});

module.exports = mongoose.model('Question', QuestionSchema);



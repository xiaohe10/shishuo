/**
 * Created by t-hexiao on 2016/9/9.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');


var CommentSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    // parentType:{type:String,default:"news"},//可以是对朋友圈 news 的评价、对课程 lesson(包含直播） 的评价，但实际上可以不用
    username:{type:String,default:"用户"},
    type:{type:String,default:"text"}, //text 代表文本， sound 代表声音
    content:{ type: String,default:"这是一条评论"}, //内容/声音
    replyto:{type: Schema.Types.ObjectId, ref: 'User'},
    replytoName:{type:String},
    updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);



/**
 * Created by t-hexiao on 2016/9/9.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Comment = require('./comment');

var NewsSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    images:[String],//朋友圈图片列表
    content:{ type: String,default:"这是一条消息"}, //内容
    commentnums:{type:Number,min:0,default:0},
    likenums:{type: Number, min: 0, default: 0},
    likeusers:[{type: Schema.Types.ObjectId, ref: 'User'}],
    comments:[{type: Schema.Types.ObjectId, ref: 'Comment'}],
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', NewsSchema);



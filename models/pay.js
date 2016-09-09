/**
 * Created by t-hexiao on 2016/9/9.
 */


var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Lesson = require('./lesson');

var PaySchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    lessonID:{type:Schema.Types.ObjectId,ref:'Lesson'},
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pay', PaySchema);



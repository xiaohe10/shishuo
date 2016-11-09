

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Lesson = require('./lesson');

var BillSchema   = new Schema({
    owner:{type: Schema.Types.ObjectId, ref: 'User'},
    money:{ type: Number, min: 0, default: 0},
    description:{type:String,default:"这是一条账单记录"},
    updated: { type: Date, default: Date.now },
    isout:{type:Boolean,default:true}
});

module.exports = mongoose.model('Bill', BillSchema);



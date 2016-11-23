

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');
var Lesson = require('./lesson');

var BillSchema   = new Schema({
    // owner:{type: Schema.Types.ObjectId, ref: 'User'},
    money:{ type: Number, min: 0, default: 0},
    description_student:{type:String,default:"这是一条账单记录"},
    description_teacher:{type:String,default:"这是一条账单记录"},
    lesson:{type:Schema.Types.ObjectId,ref:'Lesson'},
    status:{type:Boolean,default:false},//订单状态，初始为false，订单未支付
    // type:{type:String,default:''},//第三方SDK反馈的支付方式
    teacher:{type: Schema.Types.ObjectId, ref: 'User'},
    student:{type: Schema.Types.ObjectId, ref: 'User'},

    updated: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Bill', BillSchema);



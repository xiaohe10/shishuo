
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InvitecodeSchema   = new Schema({

    code:{type:String},
    // status:{type:Boolean,default:true},
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invitecode', InvitecodeSchema);





var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AndroidupdateSchema   = new Schema({
    versioncode:{ type: String, default: ''},
    description:{type:String,default:''},
    updated: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Androidupdate', AndroidupdateSchema);



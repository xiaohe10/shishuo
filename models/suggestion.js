/**
 * Created by TTonyJ on 2016/11/23.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');

var SuggestionSchema   = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    content:{type:String,default:"这是反馈内容"},
    updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);



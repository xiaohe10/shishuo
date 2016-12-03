/**
 * Created by t-hexiao on 2016/8/24.
 */
var mongoose     = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/shishuo')
mongoose.connect('mongodb://shishuo:hengaigaoke@hengaigaoke.com:27017/shishuo')
var Schema       = mongoose.Schema;
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema   = new Schema({
    telephone: {type:String,required:true,index:{unique:true}},
    password: { type: String, required: true },
    token: { type: String},
    sex:{type:String,default:"male"},
    subject:{type:String,default:"语文"},
    level:{type:String,default:"小学"},
    school:{type:String,default:"XXXX学校"},
    type:{type:String,default:"student"}, //teacher or student
    updated: { type: Date, default: Date.now },
    description:{type:String,default:"这是个人简介"},
    style:{type:String,default:"这里是授课风格介绍"},
    avatar:{type:String,default:'/images/avatars/avatar_sample.jpg'},
    nickname:{type:String,default:'学生'},

    education:{type:String,default:'高中'},//初中，高中，中专，大专，本科，硕士，博士，博士后，其他
});
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);

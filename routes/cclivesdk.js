/**
 * Created by xiaohe on 2016/11/19.
 */

var request = require('request');
var crypto = require('crypto');
var format = require('string-format')
var querystring = require("querystring");
function CCLive() {
}
var ccLive = CCLive.prototype;

ccLiveuserID = "372FAB00A0958D2F"
ccLiveAPIKey = "ucW1LbUbg3KfTWJtioNr4fhAb8UjnFVE"
URL_livecreate = 'http://api.csslcloud.net/api/room/create'
URL_livesearch = 'http://api.csslcloud.net/api/room/search'
ccLive.createLiveRoom = function(teacherpass,studentpass,roomname,roomdesc,callback){
    queryMap = { userid:ccLiveuserID,name:roomname,desc:roomdesc,
        templatetype:1,authtype:1,
        publisherpass:teacherpass,assistantpass:"shishuo",playpass:studentpass,
        barrage:0,foreignpublish:0
    };

    queryhash = createHashedQueryString(queryMap);
    URL_livecreate += "?"+queryhash

    request({url:URL_livecreate}, function(err, response, body) {
        if(err) { console.log(err); return; }
        callback(body);

    });
}
ccLive.searchLiveRoom = function(roomid,cb){
    queryMap = { userid:ccLiveuserID,roomid:roomid}
    queryhash = createHashedQueryString(queryMap);
    URL_livesearch += "?"+queryhash
    console.log(URL_livesearch)
    request({url:URL_livesearch}, function(err, response, body) {
        if(err) { console.log(err); return; }
        cb(body);

    });
}


/**
 * 功能：将一个Map按照Key字母升序构成一个QueryString. 并且加入时间混淆的hash串
 * @param queryMap  query内容
 * @param time  加密时候，为当前时间；解密时，为从querystring得到的时间；
 * @param salt   加密salt
 * @return
 */

function createHashedQueryString(queryMap) {
    keys = [];

    for (k in queryMap) {
        if (queryMap.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort();
    len = keys.length;
    sortedmap = {};
    for (i = 0; i < len; i++) {
        sortedmap[keys[i]] = queryMap[keys[i]];
    }

    //拼接 ，转义
    querystr = querystring.stringify(sortedmap);

    //获取时间戳
    var d = new Date()
    time = d.getTime()
    time = Math.floor(time/1000)

    //拼接
    str = format("{0}&time={1}&salt={2}",querystr, time, ccLiveAPIKey)

    //MD5加密
    hash = getmd5(str);
    hash = hash.toLowerCase();


    thqs = format("{0}&time={1}&hash={2}",querystr, time, hash)

    return thqs
}
function getmd5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
};
// createLiveRoom("shishuo","shishuo","测试老师的直播间","我是测试老师，useid是0",function(data){
//     console.log(data);
// });
// searchLiveRoom("C2D2C40FEE9E5CB29C33DC5901307461",function(data){
//     console.log(data);
// })

module.exports = ccLive;
/**
 * Created by tonyj on 2016/12/18.
 */

var request = require('request');
var crypto = require('crypto');
var format = require('string-format')
var querystring = require("querystring");
function CCRecord() {
}
var ccRecord = CCRecord.prototype;

ccRecorduserID = "1F95D50A9DE128D5"
ccRecordAPIKey = "qhfARw0Xo1Ge1cnfXUWxAzZaki7LNazg"
URL_recordsearch_base = 'http://spark.bokecc.com/api/videos'

ccRecord.getRecordVideos = function(videoid_from,videoid_to,num_per_page,page,format,cb){
    queryMap = { userid:ccRecorduserID,
        videoid_from:videoid_from,
        videoid_to:videoid_to,
        num_per_page:num_per_page,
        page:page,
        format:format
    }
    
    queryhash = createHashedQueryString(queryMap);

    url = URL_recordsearch_base+"?"+queryhash;
    request({url:url}, function(err, response, body) {
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
    str = format("{0}&time={1}&salt={2}",querystr, time, ccRecordAPIKey)


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
// getRecordVideos("","","10","1","json",function(data){
//     console.log(data);
// });

module.exports = ccRecord;

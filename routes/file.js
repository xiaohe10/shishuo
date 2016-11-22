var express = require('express');
var fs = require('fs');
var router = express.Router();

var User = require('../models/user')
var File = require('../models/file')


function walk(path, floor) {  
    fs.readdir(path, function(err, files) {  
        if (err) {  
            console.log('read dir error');  
        } else {  
            files.forEach(function(item) {  
                var tmpPath = path + '/' + item;  
                fs.stat(tmpPath, function(err1, stats) {  
                    if (err1) {  
                        console.log('stat error');  
                    } 
                    else {
                        if (stats.isDirectory()) {
                            walk(tmpPath, floor);
                        } 
                        else {
                        	//解析路径地址中的question信息
						    paths = tmpPath.split('/');
						    filename = paths[paths.length-1];
						    name1s = filename.split('.');
						    name2s = name1s[0].split(' ');
						    // if(name2s.length < 2 ){return;}//拍照题库中针对章节的图片，如第七章.jpg（正常情况为第七章第一节 （1）.jpg）的情况，是否视为一道题
						    grade = paths[paths.length-2];
						    level = paths[paths.length-3];
						    subject = paths[paths.length-4];
						    content = subject+level+grade+name2s[0];
						    thumbnail = subject+'/'+level+'/'+grade+'/'+filename;
						    console.log('-' + tmpPath + '  leng：' + name2s.length + '   subject:'+ subject + '   level:'+ level + '   grade:'+ grade + '   filename:'+ filename + '   content:'+ content);
						    var file = File.findOne({content:content},function(err,data){
						    	if(!data){
						    		//数据库中无此题记录
						            file = new File();
						    		file.lessonSubject = subject;
						    		file.lessonLevel = level;
						    		file.lessonGrade = grade;
						    		file.content = content;
						    		// file.thumbnails[0] = thumbnail;
						    		file.thumbnails.push(thumbnail);
						    		file.save(function(err){
						    			if(err){
						    				console.log('if failed');return;
						    			}
						    			else{
						    				console.log('if success');return file;
						    			}
						    		});
						    	}
						    	else{
							    	//已存入相关记录,需更新对应记录，添加缩略图
							        File.update({content:content},{$push:{thumbnails:thumbnail}},function(err,numberAffected, rawResponse) {
							            if (err) {
							            	console.log('else failed');return;
							            }else {
							            	console.log('else success');return data;
							            }
							        });
						    	}
						    });
                        }
                    }
                })
            });
        }
    });
}
  
walk('D:/拍照题库', 0);

module.exports = router;

# 师说 API 文档

12.14更新说明：
>* accounts/mylessons接口对于学生显示已购买课程列表（创建订单，不一定支付完成），现在增加返回对应账单的billID，便于前端处理未支付完成订单，点击跳转到支付界面即可，现在增添返回对应视频的点赞数和评论数，均为真实数据
>* accounts/myvideo接口修复了部分返回图片不能正常显示的bug，现在增添返回对应视频的点赞数和评论数，均为真实数据

12.13更新说明：
>* lesson/list、lesson/details、news/list接口返回的likenums、commentnums现在不会一直为“0”，返回真实数据
>* CC后台上传的录播视频已全部关联到我们的服务端，挂在CC上的视频返回的thumbnail直接使用CC接口返回的，需要直接获取图片，我们后台原本返回的还需要拼接url
>* lesson/list接口不再返回课程图片的宽高
>* news/create接口现在支持多张图片上传，对应图片文件的fieldname应为newsimages，多张图片构成数组供后台解析

12.9更新说明：
>* lesson/list接口 现在根据传入type值不同显示不同类别的课程，具体内容见下方接口说明


12.7更新说明：
>* lesson/list接口返回增加liveInfo
>* accounts/myvideo接口返回增加videoID
>* accounts/mylessons接口返回增加videoID、livePassword
>* 最新修改的接口需求于返回字段说明的更新，与运行的后台程序保持一致


12.3更新说明：
>* bill/create接口 调用时根据当前userID和lessonID判断是否已生成过订单，已生成的话会返回报错errcode：5和订单支付状态，避免重复订单

11.26更新说明：

>* 更改了 抽题 /lesson/choose 和 /lesson/uploadvideo的bug
>* getinfo 和 setinfo增加了 教育信息：education，直接填写相应的汉字：初中，高中，中专，大专，本科，硕士，博士，博士后，其他
>* news/create bug修改，可以上传照片列表了，news/list 部落动态列表返回评论的昵称


11.24更新说明：
>* 增加我要上课/我要听课接口，接口为/accounts/mylessons，接口针对当前用户身份做出不同操作，
>* 对于学生是我要听课，后台查询所有该学生购买过的课程（这里指创建过订单的，但有可能支付未完成），返回这些课程的相关信息和支付情况
>* 对于老师是我要上课，后台查询所有对应user为该老师的课程，返回这些课程的相关信息

11.23更新说明：
>* 添加用户反馈内容接口/suggestion/create,用户反馈内容以一条suggestion记录的形式存储到数据库中
>* 添加app上我的视频对应后台接口/accounts/myvideo，返回当前登录用户自己录制上传的视频，供用户自己查看

11.22更新说明：
>* 数据库表格中user表添加字段description（个人简介）、school（对应学校）、subject（学科）、level（学段）、sex（性别）、style（授课风格）
>* 登陆成功接口/accounts/login返回增加description(用户简介)和nickname(用户名称)
>* 注册两个了账号 供测试使用（教师 18812345678 123456）（学生 17712345678 123456 ）
>* 添加个人信息获取接口/accounts/getinfo,个人信息修改接口/accounts/changeinfo


11.21更新说明：
>* 创建订单 /bill/create接口现增加返回创建账单bill的ID，用来当做发送给第三方支付平台的唯一订单号，方便支付结果反馈给服务器端时查询对应订单，更改本地支付业务逻辑
>* 本地完成第三方支付平台Beecloud的webhook回调函数，其中APP ID和APP Secret需要在Beecloud平台申请完成后，告诉后台，固定保存在服务器端

11.19更新说明：
>* 创建直播间 /lesson/createlive：教师需要指定价格(price)和直播间名称（description)等参数，返回直播间名称和教师密码
>* 在课程详情/lesson/details 里获取直播信息，如果用户有权限观看，会返回直播间ID、教师密码和学生密码，学生采用密码模式观看直播。为方便调试，密码都是 shishuo,即使未支付也可以测试直播和观看


11.16更新说明:
>* 修改了账单的接口，请按照新接口，通过bill/create 支付，bill/list 查询历史账单
>* 抽题不再同时创建题目，使用新接口 lesson/choose ，原 lesson/create 接口作废
>* 创建新的录播课程使用 lesson/uploadvideo ，需要把抽到的题目 questionID 发给后台（可以缺省）
>* 创建直播课程，使用 lesson/createlive，需要 把抽到的题目 questionID 发给后台（可以缺省），需要把cc房间号、老师直播的userID和password、学生看录播的userID和password传给后台，还需要上传直播的预计时间
>* 课程详情 lesson/details，如果paystate == 'paid' 或者 'free' 那么返回直播房间号和用户名密码等信息（在liveInfo中），否则 liveInfo为空
>* 课程列表 lesson/list 里面增加了课程类型（录播或者直播）

11.11更新说明：
>* 1. 部落动态和视频详情的评论部分接口添加返回字段
>* 2. 热门list的接口返回时增加缩略图的宽高thumbnailswidth、thumbnailsheight
>* 3. 数据库question表中增加thumbnails图片、preparationtime备课时间、answertime答题时间字段，抽题接口返回时增加以上新增问题相关字段

11.09更新说明：
>* 1. 数据库新建公告表announcement
>* 2. 后台添加发布课程公告/announcement/create、公告查询显示/announcement/list接口

11.08更新说明：
>* 1. 用户登录时返回添加了用户头像字段 
>* 2. 增加了用户修改头像接口/accounts/changeavatar 
>* 3. 数据库新建账单表bill
>* 4. 后台添加账单创建/bill/create、收入支出记录显示/bill/list接口

11.02更新说明：
>*  添加了/accounts/changepassword修改密码、/accounts/logout注销登录接口 


10.30 更新说明：
>* 1. 添加了 部落消息、支付接口 
>* 2. 课程、部落消息的 点赞和评论接口 
>* 3. 老师和学生通过注册区分，登陆我在后台返回用户类型 
>* 4. 直播和课程合并在一起，先通过 lesson/create 建立课程，然后客户端创建直播间，通过 lesson/startlive 把直播信息和课程绑定在一起，从而在教学视频列表中显示出直播

## 服务器信息
**接口 :** http://hengaigaoke.com:8090

**匿名用户：** 
`userID:"57c46e700d21db303f349c55"`
`token:"ea8a0d55e98afc5e06740e2f3a3e6a5af02f1d85daf5ede7e992dda00da0e8f7792dafead94174c1a39a057d9d01e34a6df6d47d9289e50ffa3e93420602a362"`




## 接口说明
Requests use POST method, return JSON (all the key-value in string format).

All the error return json formated as:

```
{text, errcode, status}
if status == "success" means success
if status == "error" means error
```

## 用户接口
### 用户使用手机账户登陆
> * /accounts/login

> * Input Parameters
>> * telephone:requested
>> * password:requested

> * Successful Return
>> * {user:{userID,token,avatar,nickname,description,type},status}
>> * type: "student"代表学生，"teacher" 代表教师

> * Error Return
>> * errcode = 1: 账号不存在
>> * errcode = 2: 密码不正确

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58184fe203775a8f0fd1b096",
    "token": "0f33f7ea745a0535329455301cc4ee41e782037f00e7ac81de10a89c6ef736661dc1b26f3a2132d2397fec1010fda4bcfbba279adff52654dc05c1979a86b3b5",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "nickname": "老师",
    "description": "这是个人简介",
    "type": "student"
  }
}
```

### 用户注册
> * /accounts/register

> * Input Parameters
>> * telephone:requested
>> * password:requested
>> * invitecode:optional
>> * sex:optional("female"代表女性，默认"male"为男)
>> * level:optional
>> * subject:optional
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {user:{userID},status}

> * Error Return
>> * errcode = 1: 此手机号已经注册
>> * errcode = 2: 邀请码不正确

> * example

```
{"user":{"userID":"1001"},"status":"success"}
```


### 用户修改密码
> * /accounts/changepassword

> * Input Parameters
>> * password:requested
>> * newpassword:requested
>> * re_newpassword:requested
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID}}

> * Error Return
>> * errcode = 0: 免登陆体验账号，不提供修改密码服务
>> * errcode = 1: 此手机号已经注册
>> * errcode = 2: 密码不正确或两次输入新密码不同

> * example

```
{"status":"success","user":{"userID":"1001"}}
```

### 注销登录
> * /accounts/logout

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {status,user:{userID，token}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","user":{"userID":"1001","token":"e59cc2dfab213b4cd1d3b562bdc22e56ad26556034539e01742a5c81396af613abd2f7ce75577e724b15e46af0ce6894c4dff0f2ca4c24bf6bd636290d161499"}}
```

### 修改头像
> * /accounts/changeavatar

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * file.name:requested
>> * file.path:requested
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {status,user:{userID，avatar}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","user":{"userID":"1001","avatar":"/images/avatars/avatar_sample.jpg"}}
```

### 获取个人信息
> * /accounts/getinfo

> * Input Parameters
>> * userID:requested
>> * token:requested

> * Successful Return
>> * {status,user:{userID，avatar，nickname，description,type,level,subject,school,style,sex,education}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58340eb2a33d6b1c28e68b67",
    "avatar": "/images/avatars/avatar_sample.jpg",
    "nickname": "学生",
    "description": "这是个人简介",
    "type": "teacher",
    "level": "小学",
    "subject": "语文",
    "school": "XXXX学校",
    "style": "这里是授课风格介绍",
    "sex": "male",
    "education":"高中"
  }
}
```

### 修改个人信息
> * /accounts/changeinfo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * description:requested
>> * username:requested
>> * school:requested
>> * subject:requested
>> * level:requested
>> * sex:requested
>> * style:requested
>> * education:requested //初中，高中，中专，大专，本科，硕士，博士，博士后，其他

> * Successful Return
>> * {status,user:{userID}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "user": {
    "userID": "58340eb2a33d6b1c28e68b67"
  }
}
```

### 我的视频接口
> * /accounts/myvideo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,commentnums,likenums}...]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "58462cbc1849195616f1283a",
      "price": 0,
      "updated": "2016-12-06T03:13:00.944Z",
      "description": "课程描述",
      "videoType": "record",
      "videoID": "F7845E75DEBC6D3E9C33DC5901307461",
      "thumbnails": "1ab929556253136862a10ebcf5719f9f1480993980751.jpg",
	  "commentnums":1,
	  "likenums":2
    },
	...
  ]
}
```

### 我要上课/我要听课接口
> * /accounts/mylessons

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested
>> * pagestart:requested


> * Successful Return
>> * student:
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,status,billID,liveroom,livePassword}...]}
>> * teacher:
>> * {status,lessons:[{lessonID,price,updated,description,videoType,videoID,thumbnails,liveroom,livePassword:{teacherCCpassword,studentCCpassword}}...]}
>> * livePassword：老师和学生的密码如果未支付状态，那么livePassword为空（为方便调试，密码都是shishuo ,即使没有支付接口都为空，客户端这边也能先调试）

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
student：
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "584241cc812603d314ec08d0",
      "price": 1,
      "updated": "2016-12-03T03:53:48.438Z",
      "description": "的点点滴滴",
      "videoType": "live",
      "videoID": "0",
      "thumbnails": "/images/lesson_thumbnails/sample.jpg",
      "billID": "584241cc812603d314e",      
	  "status": true,
      "liveroom": "D97E93E203AF42A19C33DC5901307461",
      "livePassword": {
        "teacherCCpassword": "shishuo",
        "studentCCpassword": "shishuo"
      }
    }
	...
  ]
}
```
```
teacher：
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "584241cc812603d314ec08d0",
      "price": 1,
      "updated": "2016-12-03T03:53:48.438Z",
      "description": "的点点滴滴",
      "videoType": "live",
      "videoID": "0",
      "thumbnails": "/images/lesson_thumbnails/sample.jpg",
      "liveroom": "D97E93E203AF42A19C33DC5901307461",
      "livePassword": {
        "teacherCCpassword": "shishuo",
        "studentCCpassword": "shishuo"
      }
    }
	...
  ]
}
```

## 用户反馈接口

###发送反馈信息

> * /suggestion/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * content:requested



> * Successful Return
>> * {status,suggestion:{suggestionID}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "suggestion": {
    "suggestionID": "58353e647050a215682fd2b9"
  }
}
```


## 账单信息

###创建账单


1.购买课程时创建创建账单
2.自己上传的课程被别人购买时创建账单


> * /bill/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * money:requested
>> * lessonID:requested


> * Successful Return
>> * {status,billID}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success"，'billID':'00'}
```

###账单列表

> * /bill/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,bills:[{billID,money,updated,status,description,isout]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "bills": [
    {
      "billID": "582bb938e8f2761e8597a8ef",
      "money": 5,
      "updated": "2016-11-16T01:41:12.233Z",
	  "status":true,
      "description": "您购买了 老师 的课程:课程描述",
      "isout": true
    },
	...
  ]
}
```


## 课程公告

### <del>创建(发布)课程公告</del>  <font color=red>这个接口现在被弃用了</font>


> * /announcement/create
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * classtimestart:requested(开课时间)
>> * classtimeend:requested(结课时间)
>> * classtime:requested(上课时间)
>> * money:requested
>> * liveaddress:requested
>> * limit:requested(限制人数)
>> * description:requested
>> * expirydate:requested(报名截止日期)
>> * classhours:requested(学时数)


> * Successful Return
>> * {status,announcement:{announcementID,classtimestart,classtime}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","announcement": {"announcementID":"5822c9e584133412f82493da","classtimestart":"2016-10-12T00:00:00.000Z","classtime":"2016-10-12T03:22:00.000Z"
  }}
```


### <del>显示课程公告</del>  <font color=red>这个接口现在被弃用了</font>


> * /announcement/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,announcements:[{announcementID,classtimestart,classtimeend,classtime,liveaddress,limit,updated,classhours,,expirydate,description,money,user:{userID,avatar,nickname}}]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{
  "status": "success",
  "announcements": [
    {
      "announcementID": "5822c9e584133412f82493da",
      "classtimestart": "2016-10-12T00:00:00.000Z",
      "classtimeend": "2016-11-22T00:00:00.000Z",
      "classtime": "2016-10-12T03:22:00.000Z",
      "liveaddress": "www.zhibodizhi.com",
      "limit": 80,
      "updated": "2016-11-09T07:01:57.540Z",
      "classhours": 12,
      "expirydate": "2016-10-22T00:00:00.000Z",
      "description": "这是一条公告",
      "money": 20,
      "user": {
        "userID": "580f259bd424e61ec043beb0",
        "avatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
        "nickname": "老师"
      }
    }
	...
  ]
}
```


## 热门页面
###获取课程列表:


1. 热门页面下的 师说录制的课程列表
2. 热门页面下的 学生录制的课程列表
3. 磨课的视频专区的课程列表

> * /lesson/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:optional type==0 对应“热门名师”的免费视频课程，type==1代表“热门考生”的学生发布视频, type==2 代表“磨课视频课程”的教师发布录播视频，type==3代表“磨课直播课程”的教师发布直播课程（此接口不传type参数则显示所有课程，type传入空值与type==0是一种情况）
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {lessons:{lessonID,price,updated,description,videoType,thumbnails,commentnums,likenums,liveInfo:{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,studentslimit},teacher:{teacherID,avatar,nickname,teacherType}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程描述,price:价格
>> *  videoType:record代表录播，live 代表直播
>> * liveInfo：直播房间号、开始日期等信息



> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{
  "status": "success",
  "lessons": [
    {
      "lessonID": "584241cc812603d314ec08d0",
      "price": 1,
      "updated": "2016-12-03T03:53:48.438Z",
      "description": "的点点滴滴",
      "videoType": "live",
      "thumbnails": "sample.jpg",
      "thumbnailswidth": 587,
      "thumbnailsheight": 725,
      "commentnums": "0",
      "likenums": "0",
      "liveInfo": {
        "liveRoomID": "D97E93E203AF42A19C33DC5901307461",
        "startdate": "2016-12-03T00:00:00.000Z",
        "enddate": "2016-12-03T00:00:00.000Z",
        "classstarttime": "11:53:30",
        "classendtime": "12:53:00",
        "enrolldeadline": "2016-12-04T00:00:00.000Z",
        "classhours": 100,
        "studentslimit": 100
      },
      "teacher": {
        "teacherID": "58340105a33d6b1c28e68b66",
        "avatar": "/images/avatars/95791d20-b2eb-11e6-b6af-1d3916fb4a28.jpeg",
        "nickname": "ybb"
      }
    },
	...
  ]
}
```
###获取视频详情
(直接获取了评论列表）
> * /lesson/details

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

> * Successful Return
>> * {lesson:{lessonID,price,updated,description,thumbnails,commentnums,likenums,comments,videoType,teacher:{teacherID,avatar,nickname},paystate,videoID,liveInfo:{liveRoomID,startdate,enddate,classstarttime,classendtime,enrolldeadline,classhours,studentslimit},livePassword:{teacherCCpassword,studentCCpassword}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程描述,price:价格
>> *  videoType:record代表录播，live 代表直播
>> * paystate: paid 已经支付过，unpaid 未支付
>> * liveInfo：直播房间号、开始日期等信息
>> * livePassword：老师和学生的密码如果未支付状态，那么livePassword为空（为方便调试，密码都是shishuo ,即使没有支付接口都为空，客户端这边也能先调试）


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{
  "status": "success",
  "lesson": {
    "lessonID": "58302ca4663be359fb439ecd",
    "price": 10,
    "updated": "2016-11-19T10:42:44.800Z",
    "description": "全国大学生英语竞赛",
    "thumbnails": "/images/lesson_thumbnails/sample.jpg",
    "commentnums": "0",
    "likenums": "0",
    "comments": [],
    "videoType": "live",
    "teacher": {
      "teacherID": "582baf6d7f91281c6d98af1e",
      "avatar": "/images/avatars/avatar_sample.jpg",
      "nickname": "老师"
    },
    "paystate": "owner",
    "videoID": "0",
    "liveInfo": {
      "liveRoomID": "5BE6541A22FED0B19C33DC5901307461",
      "startdate": "2016-11-19T00:00:00.000Z",
      "enddate": "2016-11-20T00:00:00.000Z",
      "classstarttime": "20:00:00",
      "classendtime": "21:00:00",
      "enrolldeadline": "2016-11-17T00:00:00.000Z",
      "classhours": 2,
      "studentslimit": 100
    },
    "livePassword": {
      "teacherCCpassword": "shishuo",
      "studentCCpassword": "shishuo"
    }
  }
}
```

###给课程评论
> * /lesson/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested
>> * content:requested 评论内容
>> * type:requested 评论类型 text 代表 文本， sound 代表声音，用 base64 编码在content 表示
>> * replyto: optional 回复给用户的 userID
>> * replytoName: optional 回复给用户的userID

> * Successful Return
>> * {status,commentID,commentfrom,commentUserAvatar,lessonID}


> * Error Return
>> * errcode = 1: 用户不存在
>> * errcode = 2: 权限认证错误，请重新登陆
>> * errcode = 3: 评论保存失败
>> * errcode = 4: lessonID对应的课程不存在

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "lessonID": "57ca1145f418b4796909724f"
}
```




##评论
### <del>获取评论列表</del>  <font color=red>这个接口现在被弃用了</font>
 
> * /comment/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested: type == 0 代表视频课程， type == 1 代表直播, type == 2 代表部落里的评论
>> * contentID:requsted 相关课程的ID 或者 直播间的ID 或者 部落的评论
>> * pagestart:optional 默认为 0，每次加载 20个评论

> * Successful Return
>> * {comment:{commentID,commentContent,user:{userID,nickname}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"comment":{"commentID":"1001","commentContent":"做的非常好",user:{"userID":"12","nickname":"刘老师"}},"status":"success"}
```

### <del>发表新评论</del>  <font color=red>这个接口现在被弃用了</font>
> * /comment/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * type:requested: type == 0 代表视频课程， type == 1 代表直播, type == 2 代表部落里的评论
>> * contentID:requsted 相关课程的ID 或者 直播间的ID 或者 部落的评论
>> * replyID:optional 如果回复某条评论，那么为这条评论的ID，否则为空 ]
>> * content:requested 评论的内容

> * Successful Return
>> * {comment:{commentID},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"comment":{"commentID":"1001"},"status":"success"}
```


##练习
### 抽题，不创建题目（这样更合理）
<del>新建题目，并进行抽题</del>

从相应类别下的题目中随机抽取一题
> * /lesson/choose
> * <del>/lesson/create</del>

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonType1:optional ` 0 代表教师资格证面试/ 1 代表是 教师招聘`
>> * lessonType2:optional `0：说课，1：片段教学，2：试教，3：结构化面试 4：答辩`
>> * lessonLevel:optional: `学段：0:幼儿园，1：小学，2:初中, 3:高中`
>> * lessonSubject:optional: `学科: 0:语文, 1:数学,2:英语,3:物理,4:化学,5:生物,6:历史,7:地理,8:政治,9:体育,10:美术,11:信息技术,12:音乐,13:其他,14:综合`


> * Successful Return
>> * {question:{questionID,questionContent,thumbnails,preparationtime,answertime},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{
  "status": "success",
  "question": {
    "questionID": "582baf1e7f91281c6d98af1c",
    "questionContent": "乌鸦有几只",
    "thumbnails": "/images/question_thumbnails/sample.jpg",
    "preparationtime": 10,
    "answertime": 40
  }
}
```

### 创建直播间
> * /lesson/createlive

> * Input Parameters

```
{
	userID:582baf6d7f91281c6d98af1e,
	token:466d86fb189a71590c32c210aad927eb33fc9927ed98031d02c3338733bc618939c16a75430c1214a25ef65eabf976ded587e2b854d93e576bcb74b6f522652e,
	price:10,
	startdate:2016-11-19,        //开始日期
	enddate:2016-11-20,         //结束日期
	classstarttime:20:00:00,    //课程开始时间
	classendtime:21:00:00,      //课程结束时间
	enrolldeadline:2016-11-17, //报名截止日期
	classhours:2,              //课时
	studentslimit:100,         //学生限制数量
	description:"全国大学生英语竞赛",
}
```

> * successful return

```
{
  "status": "success",
  "lessonid": "582ff0e853792f5049670fe6",
  "liveroomid": "3F1FB53711E5B9159C33DC5901307461",
  "teacherpass": "shishuo"
}
```
> * Error Return
> 
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 没有此用户
>> * errcode = 3: 创建直播间错误
>> * errcode = 4: 课程保存错误



###上传录播的视频

> * /lesson/uploadvideo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * videoID:requested  videoID 为cc后台记录的视频ID，用来后续访问
>> * thumbnails: optional 生成截图传给后台
>> * price: optional 老师设置的课程价格，可为空


> * Successful Return
>> * {status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 课程号不存在
>> * errcode = 3: 保存失败
>> * errcode = 4: 保存失败

> * example

```
{
	"status":"success"
}
```

### 给课程评论
> * /lesson/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested
>> * content: requested
>> * type: requested
>> * replyto: optional
>> * replytoName:optional


> * Successful Return
>> * {status,commentID,commentfrom,commentUserAvatar,lessonID}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "lessonID": "57ca1145f418b4796909724f"
}
```

### 给课程点赞

> * /lesson/like

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {lesson:{lessonID},status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "lesson": {
    "lessonID": "57d2ce18b64d1db00aa8400d"
  }
}
```


###获取标准答案  <font color=green>暂时没实现</font>

> * /lesson/getanswers

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested


> * Successful Return
>> * {lessons:{lessonID,thumbnails,likenums,commentnums,teacher:{teacherID,avatar,nickname}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{"lessons":{"lessonID":"1001","thumbnails":"/media/lessons/thumbnails/1.jpg","likenums":"2000","commentnums":"10000","teacher":{"teacherID":"1001","avatar":"/media/avatars/1.jpg","nickname":"张老师"}},"status":"success"}
```

## 磨课
###视频专区，获取视频列表：
见 热门页面 >获取课程列表:

###<del>直播专区，获取直播列表</del>
<font color="red">(暂时被弃用，直播和课程合并在一起）</font>

> * /live/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {lives:{liveID,currentViewerNum,ccVideoID},status}
>> * currentViewerNum:当前观众人数,ccVideoID:cc直播的视频ID


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{"lives":{"liveID":"10001","currentViewerNum":"1560","ccVideoID":"12334"},"status":"success"}
```


## 部落
###获取部落 新动态

> * /news/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pageStart:requested 默认从0开始，每次加载10个


> * Successful Return
>> * {newses:{newsID,images,likenums,likeusers:[{userID,nickname}]，commentnums,comments:[{_id,user,username,type,content,replytoName,replyto}],updated,user:{userID,avatar,nickname}},status}
>> * images 可以为空数组，comments中的 replyto 和 replytoName 如果没有回复则不存在该字段

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "newses": [
    {
      "newsID": "583938ca67a9c3f4ef34fb21",
      "updated": "2016-11-26T07:24:58.666Z",
      "content": "这是一个新鲜事",
      "commentnums": 0,
      "likenums": 0,
      "likeusers": [],
      "images": [
        "3fd16501df2fbe45d9171a68623f0b991480145098643.jpeg",
        "5eb271409dfe9f828f449b96edbc63af1480145098649.png"
      ],
      "comments": [],
      "user": {
        "userID": "582bada68e36e61c1be44f47",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "nickname": "老师"
      }
    },
    {
      "newsID": "58393759d5a82cf488cc1a83",
      "updated": "2016-11-26T07:18:49.353Z",
      "content": "这是一个新鲜事",
      "commentnums": 0,
      "likenums": 0,
      "likeusers": [],
      "images": [
        "9d004fc84b635ff5448952f0b6e4910f1480144729335.jpeg"
      ],
      "comments": [
        {
          "_id": "58392bd688185fef44586d35",
          "user": "582bada68e36e61c1be44f47",
          "content": "这是一条评论",
          "type": "text",
          "username": "用户"
        },
        {
          "_id": "58392da1ecbc17f138f863d8",
          "user": "582bada68e36e61c1be44f47",
          "content": "这是一条评论",
          "type": "text",
          "username": "老师"
        },
        {
          "_id": "583933b306f6ecf2bd1b655b",
          "user": "582bada68e36e61c1be44f47",
          "content": "这是一条评论",
          "type": "text",
          "username": "老师"
        }
      ],
      "user": {
        "userID": "582bada68e36e61c1be44f47",
        "avatar": "/images/avatars/avatar_sample.jpg",
        "nickname": "老师"
      }
    }
   ]
 }
```

###发表一条新动态

> * /news/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * content: optional 文本内容
>> * images:requested 动态图片列表，是一个文件数组，如果没有图片则不用传或者为空


> * Successful Return
>> * {news:{newsID},status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "news": {
    "newsID": "57d2ce18b64d1db00aa8400d"
  }
}
```


### 给朋友圈点赞

> * /news/like

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested


> * Successful Return
>> * {news:{newsID},status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "news": {
    "newsID": "57d2ce18b64d1db00aa8400d"
  }
}
```


### 给朋友圈评论
> * /news/comments/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newsID: requested
>> * content: requested
>> * type: requested
>> * replyto: optional
>> * replytoName:optional


> * Successful Return
>> * {commentID,newsID,commentfrom,commentUserAvatar,updated,status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "commentID": "582534c798d7b60e00a36cd1",
  "commentfrom": "老师",
  "commentUserAvatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
  "updated": "2016-11-11T03:02:31.848Z",
  "newsID": "57d2ba2afe5081244697a5c0"
}
```


##支付课程
### 支付
> * /pay/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success"
}
```
### 查看某个用户是否已经支付某个课程
> * /pay/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID: requested


> * Successful Return
>> * {status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案
>> * errcode = 3：获取状态失败
>> * errcode = 4: 没有支付过

> * example

```
{
  "status": "success"
}
```


##教师端
###发布课程，
见 "上传课程的视频、价格" 接口

###<del>开始直播</del>
<font color="red">(暂时被弃用，直播和课程合并在一起）</font>
> * /live/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * ccLiveID:requested
>>


> * Successful Return
>> * {live:{liveID}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆


> * example

```
{"live":{"liveID":"1001},"status":"success"}
```


## 消息

### 获取当前动态(尚未开放）
>* /notify/list
> * Input Parameters
>> * userID:requested
>> * token:requested


> * Successful Return
>> * {notify:{notifyID,content,type},status}
>> * type: 0: 新的评论， 1: 新的赞， 2: 新的购买

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆

> * example

```
{"notify":{"notifyID":"1001","content":"有人赞了您的课程荷塘月色","type":"1"},"status":"success"}
```

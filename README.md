# 师说 API 文档

1109更新说明：
>* 1. 数据库新建公告表announcement
>* 2. 后台添加发布课程公告/announcement/create、公告查询显示/announcement/list接口

1108更新说明：
>* 1. 用户登录时返回添加了用户头像字段 
>* 2. 增加了用户修改头像接口/accounts/changeavatar 
>* 3. 数据库新建账单表bill
>* 4. 后台添加账单创建/bill/create、收入支出记录显示/bill/list接口

1102更新说明：
>*  添加了/accounts/changepassword修改密码、/accounts/logout注销登录接口 


更新说明：
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
>> * {user:{userID,token,type},status}
>> * type: "student"代表学生，"teacher" 代表教师

> * Error Return
>> * errcode = 1: 账号不存在
>> * errcode = 2: 密码不正确

> * example

```
{"user":{"userID":"1001","token":"48133892c5ade1235b69458ebcec8818","type":"student"},"status":"success"}
```

### 用户注册
> * /accounts/register

> * Input Parameters
>> * telephone:requested
>> * password:requested
>> * invitecode:optional
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
>> * telephone:requested
>> * password:requested
>> * newpassword:requested
>> * re_newpassword:requested
>> * userID:requested
>> * type:requested （ type: "student"代表学生，"teacher" 代表教师）

> * Successful Return
>> * {status,user:{userID}}

> * Error Return
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
>> * {status,user:{userID，userAvatar}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","user":{"userID":"1001","userAvatar":"/images/avatars/avatar_sample.jpg"}}
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
>> * isout:requested
>> * description:requested


> * Successful Return
>> * {status,bill:{billID,owner,money,isout,description}}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","bill":{"billID":"1001","owner":"100","money":10,"isout":true,"description":"这是一条账单"}}
```

###展示账单

> * /bill/list
> 
> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pagestart:requested


> * Successful Return
>> * {status,bills:[{billID,money,updated,description,isout,owner:{ownerID,avatar,nickname}}]}

> * Error Return
>> * errcode = 1: 用户登录信息错误
>> * errcode = 2: 函数调用异常

> * example

```
{"status":"success","bills":[
    {
      "billID": "1001",
      "money": 5,
      "updated": "2016-11-08T07:09:10.216Z",
      "description": "这是一条新建账单",
      "isout": true,
      "owner": {
        "ownerID": "1001",
        "avatar": "/images/avatars/a44a3fd0-a258-11e6-818d-3db40fa2e94b.jpg",
        "nickname": "老师"
      }
    },
	....
}
```


## 课程公告

###创建(发布)课程公告


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

###显示课程公告

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
>> * type:optional type==0 代表师说的录制课程，type==1代表学生的热门视频, type==2 代表磨课的视频专区
>> * pagestart:optional 分页开始，默认为 0，每次刷新10个

> * Successful Return
>> * {lessons:{lessonID,thumbnails,likenums,commentnums,price,description,teacher:{teacherID,avatar,nickname}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程描述,price:价格


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{"lessons":{"lessonID":"1001","thumbnails":"/media/lessons/thumbnails/1.jpg","likenums":"2000","commentnums":"10000",price:"5","description":"这是一个非常好的课程，请收听","teacher":{"teacherID":"1001","avatar":"/media/avatars/1.jpg","nickname":"张老师"}},"status":"success"}
```
###获取视频详情
(直接获取了评论列表）
> * /lesson/details

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

> * Successful Return
>> * {lesson:{lessonID,thumbnails,likenums,commentnums,comments,price,videoID,videoType,liveRoomID,liveMeta,description,teacher:{teacherID,avatar,nickname}},status}
>> * thumbnails：课程缩略图，likenums：点赞数，commentnums:评论数，avatar:老师头像,description:课程描述,price:价格
>> * liveRoomID 直播间， videoType:record代表录播，live 代表直播,liveMeta:直播的老师和学生账号等（可以扩展或者都存成一个字符串）


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取课程失败

> * example

```
{
  "status": "success",
  "lesson": {
    "lessonID": "57ca1145f418b4796909724f",
    "price": 0,
    "updated": "2016-09-02T23:54:45.645Z",
    "description": "课程描述",
    "thumbnails": "/images/lesson_thumbnails/sample.jpg",
    "commentnums": "0",
    "likenums": "0",
    "comments": [
      {
        "_id": "57d2c7e0b64d1db00aa8400b",
        "replytoName": "xiaohe",
        "replyto": "57d2493a887881642e9fc237",
        "content": "这是一条评论",
        "type": "text"
      },
      {
        "_id": "57d2cf9ab64d1db00aa8400f",
        "replytoName": "xiaohe",
        "replyto": "57d2493a887881642e9fc237",
        "content": "这是一条评论",
        "type": "text"
      }
    ],
    "videoType": "record",
    "liveRoomID": "0",
    "liveMeta": "{teacherID:1,teacherToken:asdf,studentID:12,studentToken:asdf}",
    "videoID": "0",
    "teacher": {
      "teacherID": "57c46e700d21db303f349c55",
      "avatar": "/images/avatars/avatar_sample.jpg",
      "nickname": "老师"
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
>> * {status,commentID,lessonID}


> * Error Return
>> * errcode = 1: 用户不存在
>> * errcode = 2: 权限认证错误，请重新登陆
>> * errcode = 3: 评论保存失败
>> * errcode = 4: lessonID对应的课程不存在

> * example

```
{
  "status": "success",
  "commentID": "57d2c7e0b64d1db00aa8400b",
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
###新建题目，并进行抽题
上传题目信息，抽题时上传，暂时不传视频，录制视频之后再更新视频信息
> * /lesson/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonType1:optional ` 0 代表教师资格证面试/ 1 代表是 教师招聘`
>> * lessonType2:optional `0：说课，1：片段教学，2：试教，3：结构化面试 4：答辩`
>> * lessonLevel:optional: `学段：0:幼儿园，1：小学，2:初中, 3:高中`
>> * lessonSubject:optional: `学科: 0:语文, 1:数学,2:英语,3:物理,4:化学,5:生物,6:历史,7:地理,8:政治,9:体育,10:美术,11:信息技术,12:音乐,13:其他,14:综合`


> * Successful Return
>> * {lessons:{lessonID,question:{questionID,questionContent}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"lessons":{"lessonID":"1001","question":{"questionID":"1001","questionContent":"请试讲荷塘月色"}}},"status":"success"}
```

### 开始直播
> * /lesson/startlive

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested
>> * liveRoomID:requested  liveRoomID 为cc后台记录的视频ID，用来后续访问
>> * thumbnails:optional 因为截图可能需要实时更新，截图接口后面再单独开接口上传吧
>> * liveMeta:requested 直播元数据：包括老师用户的登陆账号和密码，学生用户的登陆账号和密码
>> * price: optional 老师设置的课程价格，可为空


> * Successful Return
>> * {lessons:{lessonID},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 课程号不存在
>> * errcode = 3: 截图上传失败

> * example

```
{"lessons":{"lessonID":"1001"},"status":"success"}
```


###上传课程的视频、价格

> * /lesson/uploadvideo

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested
>> * videoID:requested  videoID 为cc后台记录的视频ID，用来后续访问
>> * thumbnails:requested 生成截图传给后台
>> * price: optional 老师设置的课程价格，可为空


> * Successful Return
>> * {lessons:{lessonID},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 课程号不存在
>> * errcode = 3: 截图上传失败

> * example

```
{"lessons":{"lessonID":"1001"},"status":"success"}
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
>> * {lessonID,newsID,status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "lessonID": "57d2cf40b64d1db00aa8400e",
  "newsID": "57d2ba2afe5081244697a5c0"
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
>> * {newses:{newsID,images,likenums,likeusers:[{userID,nickname}]，commentnums,comments:[{_id,type,content,replytoName,replyto}],updated,user:{userID,avatar,nickname}},status}
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
      "newsID": "57d2ba2afe5081244697a5c0",
      "updated": "2016-09-09T13:33:30.270Z",
      "commentnums": 0,
      "likenums": 0,
      "likeusers": [],
      "images": [
        "image1",
        "image2"
      ],
      "comments": [
        {
          "_id": "57d2bae8ad9f885028699a1d",
          "content": "这是一条评论",
          "type": "text"
        },
        {
          "_id": "57d2bb55e9915fdc1ee1a91f",
          "replytoName": "xiaohe",
          "replyto": "57d2493a887881642e9fc237",
          "content": "这是一条评论",
          "type": "text"
        }
      ],
      "user": {
        "userID": "57d2493a887881642e9fc237",
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
>> * content: requested 动态内容
>> * images:requested 动态图片列表，是一个数组，如果没有图片则不用传或者为空


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
>> * {commentID,newsID,status}

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{
  "status": "success",
  "commentID": "57d2cf40b64d1db00aa8400e",
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

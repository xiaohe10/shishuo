# 师说 API 文档
## 服务器信息
**接口 :** http://hengaigaoke.com:8090



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
>> * {user:{userID,token},status}

> * Error Return
>> * errcode = 1: 账号不存在
>> * errcode = 2: 密码不正确

> * example

```
{"user":{"userID":"1001","token":"48133892c5ade1235b69458ebcec8818"},"status":"success"}
```

### 用户注册
> * /accounts/register

> * Input Parameters
>> * telephone:requested
>> * password:requested
>> * invitecode:optional

> * Successful Return
>> * {user:{userID},status}

> * Error Return
>> * errcode = 1: 此手机号已经注册
>> * errcode = 2: 邀请码不正确

> * example

```
{"user":{"userID":"1001"},"status":"success"}
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
视频下的评论通过获取评论接口统一获取
> * /lesson/details

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * lessonID:requested

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

##评论
### 获取评论列表
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

### 发表新评论
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
>> * lessonType2:optional `0：说课，1：片段教学，2：试教，3：结构化面试 4：答辩，5:结构化面试，6:试教`
>> * lessonLevel:optional: `学段：0:幼儿园，1：小学，2:初中, 3:高中`
>> * lessonSubject:optional: `学科: 0:语文, 1:数学,2:英语,3:物理,4:化学,5:生物,6:历史,7:地理,8:政治,9:体育,10:美术,11:信息技术,12:音乐,13其他`


> * Successful Return
>> * {lessons:{lessonID,question:{questionID,questionContent}},status}


> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 上传课程失败

> * example

```
{"lessons":{"lessonID":"1001","question":{"questionID":"1001","questionContent":"请试讲荷塘月色"}}},"status":"success"}
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

###获取标准答案

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

###直播专区，获取直播列表

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
评论通过专门的评论列表获取
> * /community/news/list

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * pageStart:requested 默认从0开始，每次加载10个


> * Successful Return
>> * {news:{newsID,images,newscontent,likenums,commentnums,user:{userID,avatar,nickname}},likeusers:{userID,nickname},status}
>> * images：动态图片列表，newscontent：动态内容，likenums：点赞数，commentnums:评论数，avatar:老师头像,likeusers:点赞用户

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{"news":{"newsID":"1001","images":{"/image/1.jpg","image/2.jpg"},"likenums":"2000","commentnums":"10000","user":{"userID":"1001","avatar":"/media/avatars/1.jpg","nickname":"张老师"},likeusers:{userID,nickname},"status":"success"}
```

###发表一条新动态

> * /community/news/create

> * Input Parameters
>> * userID:requested
>> * token:requested
>> * newscontent: 动态内容
>> * images:动态图片列表


> * Successful Return
>> * {news:{newsID,images,newscontent,likenums,commentnums,user:{userID,avatar,nickname}},likeusers:{userID,nickname},status}
>> * images：动态图片列表，newscontent：动态内容，likenums：点赞数，commentnums:评论数，avatar:老师头像,likeusers:点赞用户

> * Error Return
>> * errcode = 1: 权限认证错误，请重新登陆
>> * errcode = 2: 获取答案

> * example

```
{"news":{"newsID":"1001","images":{"/image/1.jpg","image/2.jpg"},"likenums":"2000","commentnums":"10000","user":{"userID":"1001","avatar":"/media/avatars/1.jpg","nickname":"张老师"},likeusers:{userID,nickname},"status":"success"}
```

## 消息

### 获取当前动态
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

##教师端
###发布课程，见 "上传课程的视频、价格" 接口

###开始直播
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


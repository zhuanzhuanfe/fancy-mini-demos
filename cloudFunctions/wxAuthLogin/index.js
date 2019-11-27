// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 微信授权登录
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { code, encryptedData, iv} = event;

  //更新微信session
  let sessionInfo = (await cloud.callFunction({
    name: 'updateWXSession',
    data: {
      code
    }
  })).result;

  //解密数据
  let userInfo = (await cloud.callFunction({
    name: 'decryptData',
    data: {
      encryptedData,
      iv,
      wxSessionKey: sessionInfo.wxSessionKey,
    }
  })).result;

  //维护后端自己的登录态
  let fancySessionKey = 'session'+Date.now();

  //查找/创建用户
  let userRecord = (await cloud.database().collection('users').where({
    openId: userInfo.openid,
  }).get()).data[0];

  if (!userRecord) {
    let addRes = await cloud.database().collection('users').add({
      data: {
        openId: userInfo.openid,
      }
    });
    userRecord = {
      _id: addRes._id,
      openId: userInfo.openid,
    }
  }

  //更新用户信息

  let data = {
    //微信用户信息
    openId: userInfo.openId,
    unionId: userInfo.unionId,
    nickName: userInfo.nickName,
    avatarUrl: userInfo.avatarUrl,
    gender: userInfo.gender,
    city: userInfo.city,
    province: userInfo.province,
    country: userInfo.country,

    //后端自己的用户信息
    uid: userRecord._id,
    fancySessionKey,
  };

  let updateRes = await cloud.database().collection('users').where({
    openId: userInfo.openid,
  }).update({
    data
  });

  return {
   respCode: 0,
   respData: {
     nickName: data.nickName, //昵称
     avatarUrl: data.avatarUrl, //头像
     gender: data.gender, //性别
     uid: data.uid, //后端自己维护的用户标识
     sessionKey: data.fancySessionKey, //后端自己维护的登录凭证
     validityPeriod: 7*24*60*60*1000, //有效期，单位：ms
     token: data.openId, //登录前分配的临时标识，登录后继续关联
   }
  }
}

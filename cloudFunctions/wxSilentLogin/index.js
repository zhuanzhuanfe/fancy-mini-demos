// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 微信静默登录
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let { code } = event;

  //更新微信session
  let sessionInfo = (await cloud.callFunction({
    name: 'updateWXSession',
    data: {
      code
    }
  })).result;

  //查找对应用户
  let userRecord = (await cloud.database().collection('users').where({
    openId: sessionInfo.openId,
  }).get()).data[0];

  //用户不存在，按失败返回
  if (!userRecord) {
    return {
      respCode: -200,
      errMsg: "user doesn't exist"
    }
  }

  //用户存在，按成功返回
  let data = userRecord;
  return {
    respCode: 0,
    respData: {
      nickName: data.nickName, //昵称
      avatarUrl: data.avatarUrl, //头像
      gender: data.gender, //性别
      uid: data.uid, //后端自己维护的用户标识
      sessionKey: data.fancySessionKey, //后端自己维护的登录凭证
      validityPeriod: 7 * 24 * 60 * 60 * 1000, //有效期，单位：ms
      token: data.openId, //登录前分配的临时标识，登录后继续关联
    }
  }
}
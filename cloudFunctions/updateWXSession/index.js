// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise-native');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {code} = event;

  return await updateWXSession({ code });
}

//创建/更新微信session
async function updateWXSession({ code }) {
  let appAuthRes = await cloud.database().collection('auth').doc('appAuth').get();
  let appAuth = appAuthRes.data;

  let sessionRes = await request.get({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: appAuth.appId,
      secret: appAuth.secret,
      js_code: code,
      grant_type: 'authorization_code',
    },
    json: true,
  });

  let data = {
    wxSessionKey: sessionRes.session_key,
    openId: sessionRes.openid,
    unionId: sessionRes.unionid, //只在满足一定条件时能获取
  };

  //写入用户表
  await cloud.database().collection('users').where({
    openId: data.openId,
  }).update({
    data
  });

  return data;
}

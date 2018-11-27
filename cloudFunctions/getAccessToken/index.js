// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise-native');

cloud.init()

//从微信服务器中获取新的token（会导致现有token失效）
async function refreshToken(){
  let appAuth = await cloud.database().collection('auth').doc('appAuth').get().data;
  
  let tokenRes = await request.get({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      grant_type: 'client_credential',
      appid: appAuth.appId,
      secret: appAuth.secret,
    },
    json: true,
  });
  
  return {
    token: tokenRes.access_token,
    expire: Date.now() + tokenRes.expires_in*1000,
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  //从数据库中获取当前token
  const tokenRes = await cloud.database().collection('auth').doc('accessToken').get();

  //若当前token已失效，则从服务器中获取新的token
  let data = tokenRes.data;
  let buffTime = 5 * 60 * 1000;
  if (Date.now() + buffTime > data.expire) {
    data = await refreshToken();
    await cloud.database().collection('auth').doc('accessToken').set({data});
  }

  //返回结果
  return data.token;
}
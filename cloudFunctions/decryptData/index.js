// 云函数入口文件
const cloud = require('wx-server-sdk')
const WXBizDataCrypt = require('./WXBizDataCrypt')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { encryptedData, iv, wxSessionKey, openId} = event;
  openId = wxContext.OPENID || openId; //客户端调用时以微信提供的为准，云端调用时允许自由指定

  if (!wxSessionKey && openId) {
    let userInfo = (await cloud.database().collection('users').where({
      openId
    }).get()).data;
  
    wxSessionKey = userInfo.wxSessionKey;
  }
  

  var pc = new WXBizDataCrypt(wxContext.APPID, wxSessionKey);
  return pc.decryptData(encryptedData, iv);
}
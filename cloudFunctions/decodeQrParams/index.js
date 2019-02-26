// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let scene = event.scene || '';
  if (scene.indexOf('long_')!==0){
    return {
      code: -1,
      paramsStr: '',
    }
  }

  let paramsId = scene.split('_')[1];
  let paramsRes = await cloud.database().collection('qrParams').doc(paramsId).get();

  return {
    code: 0,
    paramsStr: paramsRes.data.value, 
  }
}
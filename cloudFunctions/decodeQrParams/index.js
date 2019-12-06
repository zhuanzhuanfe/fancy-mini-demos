// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let scene = event.scene || '';
  if (!scene) {
    return {
      code: -1,
      errMsg: 'bad param: scene is required'
    }
  }

  let paramsRes = {
    hit: false,
    value: '',
  };
  try {
    let docRes = await cloud.database().collection('qrParams').doc(scene).get();
    paramsRes.hit = true;
    paramsRes.value = docRes.data.value;
  } catch (e) {
    console.error(e);
  }



  return {
    code: paramsRes.hit ? 0 : -1,
    paramsStr: paramsRes.value,
  }
}

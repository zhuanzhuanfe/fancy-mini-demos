'use strict';

const cloud = require('wx-server-sdk');
const request = require('request-promise-native');

cloud.init();

exports.main = async (event, context) => {
  let accessTokenRes = await cloud.callFunction({name: 'getAccessToken'});

  event.params = decodeURIComponent(event.params || '');
  
  const MAX_SCENE_WIDTH = 32;
  let scene = '_'+event.params;
  scene = scene.length>MAX_SCENE_WIDTH ? 'long_'+(await storeParams(event.params)) : scene;

  let qrRes = await request.post({
    url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessTokenRes.result}`,
    body: {
      scene,
      page: event.page,
      width: event.width,
      auto_color: event.auto_color,
      line_color: event.line_color,
      is_hyaline: event.is_hyaline,
    },
    encoding: null,
    json: true,
  });

  if (qrRes.errcode) { //生成失败
    console.log('createQrCode failed:', qrRes);
    return {
      code: qrRes.errcode,
      errMsg: qrRes.errmsg,
      base64Data: '',
    }
  } else { //生成成功
    return {
      code: 0,
      errMsg: 'ok',
      base64Data: (new Buffer(qrRes)).toString('base64')
    };
  }
};

/**
 * 由于二维码编码空间有限，参数较多时难以直接携带
 * 此时，改为将参数存进后端数据库，并将存储标识编入二维码，前端再根据标识调接口获得原始参数
 */
async function storeParams(paramsStr){
  let addRes = await cloud.database().collection('qrParams').add({
    data: {
      value: paramsStr,
    }
  });
  return addRes._id;
}
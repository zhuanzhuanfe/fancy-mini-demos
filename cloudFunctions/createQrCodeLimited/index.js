'use strict';

const cloud = require('wx-server-sdk');
const request = require('request-promise-native');

cloud.init();

exports.main = async (event, context) => {
  let accessTokenRes = await cloud.callFunction({name: 'getAccessToken'});

  let qrRes = await request.post({
    url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${accessTokenRes.result}`,
    body: {
      path: event.path,
      width: event.width,
    },
    encoding: null,
    json: true,
  });

  if (qrRes.errcode) { //生成失败
    console.log('createQrCode failed:', qrRes);
    return {
      code: qrRes.errcode,
      errMsg: qrRes.errmsg,
      base64Img: '',
    }
  } else { //生成成功
    return {
      code: 0,
      errMsg: 'ok',
      base64Img: 'data:image/jpg;base64,'+(new Buffer(qrRes)).toString('base64')
    };
  }
};

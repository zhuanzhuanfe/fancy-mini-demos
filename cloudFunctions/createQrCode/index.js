'use strict';

const cloud = require('wx-server-sdk');
const request = require('request-promise-native');

cloud.init();

exports.main = async (event, context) => {
  let accessToken = await cloud.callFunction({name: 'getAccessToken'});

  let qrRes = await request.post({
    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    form: {
      access_token: accessToken,
      scene: event.scene,
      page: event.page,
      width: event.width,
      auto_color: event.auto_color,
      line_color: event.line_color,
      is_hyaline: event.is_hyaline,
    },
  });
  return qrRes;
};

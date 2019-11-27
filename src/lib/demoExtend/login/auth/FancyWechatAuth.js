//FancyWechatAuth.js
import WechatAuth from "fancy-mini/lib/login/auth/WechatAuth";

/**
 * 微信登录鉴权模块-自定义扩展示例
 */
class FancyWechatAuth extends WechatAuth {
  /**
   * 微信授权登录
   * 根据用户同意授权后从微信处拿到的信息，完成登录过程
   * @param {WechatAuth~WxLoginRes} wxLoginRes wx.login执行结果
   * @param {Object} authData 登录界面交互结果，格式同wx.getUserInfo返回结果
   * @param loginOptions 登录函数调用参数，参见{@link BaseLogin#login}
   * @param configOptions 登录模块配置参数，参见{@link BaseLogin#config}
   * @return {BaseAuth~LoginRes}
   */
  async loginByWxAuth({wxLoginRes, authData, loginOptions, configOptions}) {
    //调用后端接口，根据微信授权信息获取登录结果
    let loginRes = await configOptions.requester.request({
      url: 'https://cloud.function/wxAuthLogin',
      data: {
        code: wxLoginRes.code,
        encryptedData: authData.encryptedData,
        iv: authData.iv,
      },
      method: "POST",
    });

    //后端：
    //  1. 调用微信api，根据入参中的code，获取session_key，官方文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
    //  2. 调用微信api，根据入参中的encryptedData、iv和上一步中获取的session_key，获取微信用户标识和用户信息，官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
    //      2.1 用户标识：openId，用户在小程序中的唯一标识，因小程序而异
    //      2.2 用户标识：unionId，用户在同一主体中的唯一标识，同一用户在同一主体下的所有小程序、公众号、网页、APP等应用中unionId一致
    //      2.3 用户信息：昵称、头像、性别、地区等
    //  3. 根据上一步中获取的openId/unionId，查询用户表；若存在相关记录，则返回对应用户信息，登录成功；若不存在，则自动注册，并存储微信用户信息作为用户初始信息，存储微信用户标识作为关联标识备查，之后返回对应用户信息，登录成功。

    //登录失败处理
    if (loginRes.respCode != 0) {
      return {
        succeeded: false, //是否成功
        errMsg: 'login api failed:' + JSON.stringify(loginRes), //详细错误信息，调试用
        toastMsg: loginRes.respData && loginRes.respData.errMsg //（若有）错误话术，向用户提示用
      };
    }

    //登录成功处理
    let data = loginRes.respData;
    return {
      succeeded: true, //是否成功
      errMsg: 'ok', //错误信息
      userInfo: { //用户信息
        nickName: data.nickName, //昵称
        avatarUrl: data.avatarUrl, //头像
        gender: data.gender, //性别
        uid: data.uid, //后端自己维护的用户标识
        sessionKey: data.sessionKey, //后端自己维护的登录凭证
      },
      expireTime: Date.now() + data.validityPeriod, //有效期至，格式：绝对时间戳，-1表示长期有效
      anonymousInfo: { //（若有）匿名信息，登录前分配的临时标识，登录后继续关联
        token: data.token,
      },
    };
  }

  /**
   * 微信静默登录
   * 在用户无感知的情况下悄悄完成登录过程
   * @param {WechatAuth~WxLoginRes} wxLoginRes wx.login执行结果
   * @param loginOptions 登录函数调用参数，参见{@link BaseLogin#login}
   * @param configOptions 登录模块配置参数，参见{@link BaseLogin#config}
   * @return {BaseAuth~LoginRes}
   */
  async loginByWxSilent({wxLoginRes, loginOptions, configOptions}) {
    let loginRes = await configOptions.requester.request({
      url: 'https://cloud.function/wxSilentLogin',
      data: {
        code: wxLoginRes.code,
      },
      method: "POST",
    });

    //后端：
    //  1. 调用微信api，根据入参中的code，获取openId，官方文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
    //  2. 根据openId，查询用户表；若存在相关记录，则返回对应用户信息，登录成功；若不存在相关记录，则登录失败
    //     效果：老用户可以在无感知的情况下悄悄静默登录；新用户依然是要等到授权登录时拿到用户信息才进行注册和登录，但静默尝试用户无感知，不会产生打扰

    //登录失败处理
    if (loginRes.respCode != 0) {
      return {
        succeeded: false, //是否成功
        errMsg: 'fail', //详细错误信息，调试用
        anonymousInfo: { //（若有）匿名信息，登录前分配的临时标识，登录后继续关联
          token: loginRes.respData.token,
        }
      };
    }

    //登录成功处理
    let data = loginRes.respData;

    return {
      succeeded: true, //是否成功
      errMsg: 'ok', //错误信息
      userInfo: { //用户信息
        nickName: data.nickName, //昵称
        avatarUrl: data.avatarUrl, //头像
        gender: data.gender, //性别
        uid: data.uid, //后端自己维护的用户标识
        sessionKey: data.sessionKey, //后端自己维护的登录凭证
      },
      expireTime: Date.now() + data.validityPeriod, //有效期至，格式：绝对时间戳，-1表示长期有效
      anonymousInfo: { //（若有）匿名信息，登录前分配的临时标识，登录后继续关联
        token: data.token,
      },
    }
  }
}

export default FancyWechatAuth;

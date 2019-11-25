import FancyLogin from "../demoExtend/login/FancyLogin";
import FancyWechatAuth from "../demoExtend/login/auth/FancyWechatAuth";
import LoginPlugin from "fancy-mini/lib/request/plugin/LoginPlugin";
import Requester from "fancy-mini/lib/request/Requester";
import Cookie from 'fancy-mini/lib/Cookie';
import {authEvents} from 'fancy-mini/lib/globalEvents';

//实例创建
const loginCenter = new FancyLogin(); //登录中心
const requester = new Requester(); //请求管理器
const cookie = new Cookie(); //cookie管理器

//登录模块配置
loginCenter.config({
  requester, //请求管理器，用于发送接口请求
  authEngineMap: { //鉴权器映射表，key为登录方式，value为对应的鉴权器
    'wechat' : new FancyWechatAuth(), //登录方式：微信，鉴权器：微信登录鉴权
  },
  defaultAuthType: 'wechat', //默认登录方式：微信
  async userAuthHandler(){ //默认登录交互
    let userAuthRes = await new Promise(resolve=>{
      authEvents.subscribe({ //监听交互结果
        eventType: 'userAuthFinish',
        handler: resolve, //交互结束时resolve当前promise
        persistType: 'once'
      });
      wx.navigateTo({ //展示登录界面
        url: '/pages/login/index'
      });
    });

    //等待用户交互，直到用户交互结束，登录界面信息收集完毕，该Promise才会被resolve，后续代码才会自动继续执行

    //返回交互结果
    return userAuthRes;
  },

  //自定义参数
  cookie,
  source: 1,
});

//请求管理器配置
requester.config({
  plugins: [
    //登录插件，在请求前后自动加入登录态相关逻辑
    new LoginPlugin({
      loginCenter,
      apiAuthFailChecker(resData, reqOptions){ //根据接口返回内容，判断后端登录态是否已失效
        return (
          (resData.respMsg && resData.respMsg.includes('请登录')) || //后端登录态失效通用判断条件
          (reqOptions.url.includes('/bizA/') && resData.respCode===-1) || //业务线A后端接口登录态失效
          (reqOptions.url.includes('/bizB/') && resData.respCode===-2) //业务线B后端接口登录态失效
        );
      }
    }),
    //cookie插件，在请求前后自动加入cookie相关逻辑
    new CookiePlugin({
      cookie,
    }),
  ]
});

export {
  requester,
  loginCenter,
  cookie,
}

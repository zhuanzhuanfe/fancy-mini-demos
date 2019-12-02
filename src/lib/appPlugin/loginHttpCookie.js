import FancyLogin from "../demoExtend/login/FancyLogin";
import FancyWechatAuth from "../demoExtend/login/auth/FancyWechatAuth";
import LoginPlugin from "fancy-mini/lib/request/plugin/LoginPlugin";
import Requester from "fancy-mini/lib/request/Requester";
import Cookie from 'fancy-mini/lib/Cookie';
import CookiePlugin from 'fancy-mini/lib/request/plugin/CookiePlugin';
import {authEvents} from 'fancy-mini/lib/globalEvents';
import CloudFuncPlugin from 'fancy-mini/lib/request/plugin/CloudFuncPlugin';
import {getCurWepyPage, registerToThis} from 'fancy-mini/lib/wepyKit';

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
  pageConfigHandler(){ //获取页面级登录配置
    let curPage = getCurWepyPage() || {}; //获取当前页面实例
    return curPage.$loginOpts; //返回当前页面的自定义配置参数
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
    //云函数插件，将云函数封装成http接口的形式使用
    new CloudFuncPlugin(),
  ]
});

//将登录模块相关功能注册到this上，方便页面/组件直接使用
const propMapThis2Login = { //命名映射，key为this属性名，value为loginCenter属性名, '*this'表示loginCenter自身
  '$loginCenter': '*this', // this.$loginCenter 对应 loginCenter
  '$login': 'login', // this.$login() 对应 loginCenter.login()
  '$logout': 'logout',
  '$reLogin': 'reLogin',
  '$checkLogin': 'checkLogin',
};

for (let [thisProp, loginProp] of Object.entries(propMapThis2Login)) {
  let loginTarget = loginProp === '*this' ? loginCenter : loginCenter.makeAssignableMethod(loginProp);
  registerToThis(thisProp, loginTarget);
}

//将请求模块相关功能注册到this上，方便页面/组件直接使用
const propMapThis2Requester = { //命名映射，key为this属性名，value为requester属性名, '*this'表示requester自身
  '$requester': '*this', // this.$requester 对应 requester
  '$http': 'request', // this.$http() 对应 requester.request()
  '$httpWithLogin':'requestWithLogin', //this.$httpWithLogin() 对应 requester.requestWithLogin()
};

for (let [thisProp, requesterProp] of Object.entries(propMapThis2Requester)) {
  let requesterTarget = requesterProp === '*this' ? requester : requester.makeAssignableMethod(requesterProp);
  registerToThis(thisProp, requesterTarget);
}

export {
  requester,
  loginCenter,
  cookie,
}

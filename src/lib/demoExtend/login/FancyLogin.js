import BaseLogin from 'fancy-mini/lib/login/BaseLogin';
import {peerAssign} from 'fancy-mini/lib/operationKit';

/**
 * 登录模块-自定义实现示例
 * 通过继承覆盖的形式，可以在登录模块的各个环节中添加各种自定义逻辑
 * e.g.引入cookie逻辑，使得所有接口请求自动携带登录信息
 */
class FancyLogin extends BaseLogin{
  cookie = null;

  //模块配置
  config(configOptions){
    //参数校验...

    //处理模块自身所需的自定义参数
    this.cookie = configOptions.cookie;

    //处理需要传递给鉴权模块、钩子函数等其它可配模块的自定义参数
    const defaultFancyOpts = {
      source: '', //小程序编号，用于区分不同的小程序，由rd指定，后端可以根据source查询到对应小程序的appId、appSecret等信息
    };

    let fancyOptions = peerAssign({}, defaultFancyOpts, configOptions);

    //注册额外参数
    this._appendConfig('fancyOptions', fancyOptions); //则鉴权模块、钩子函数等可以通过 configOptions.fancyOptions 拿到这些自定义参数

    //处理通用参数
    super.config(configOptions);
  }

  //模块初始化
  _init(){
    super._init();

    //写入cookie
    this.cookie.set('uid', this._loginInfo.userInfo.uid || '');
    this.cookie.set('sessionKey', this._loginInfo.userInfo.sessionKey || '');
  }

  //清除登录态
  clearLogin(...args){
    super.clearLogin(...args);
    this.cookie.set('uid', '');
    this.cookie.set('sessionKey', '');
  }

  //保存/更新用户信息
  _saveInfo(loginInfo){
    super._saveInfo(loginInfo);

    // 写入cookie
    this.cookie.set('uid', loginInfo.userInfo.uid);
    this.cookie.set('sessionKey', loginInfo.userInfo.sessionKey);
  }

  //保存/更新匿名信息
  _saveAnonymousInfo(anonymousInfo){
    super._saveAnonymousInfo(anonymousInfo);

    anonymousInfo.token && this.cookie.set('token', anonymousInfo.token);
  }
}

export default FancyLogin;

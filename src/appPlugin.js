import {registerToThis, registerPageHook, pageRestoreHandler} from 'fancy-mini/lib/wepyKit';
import AdaptiveToast from 'fancy-mini/lib/AdaptiveToast';
import Navigator from 'fancy-mini/lib/navigate/Navigator';
import {customWxPromisify} from 'fancy-mini/lib/wxPromise';

//长度自适应的原生toast
let toast = (new AdaptiveToast({
  icons: {
    success: '/images/tipsucc.png',
    fail: '/images/tipfail.png'
  }
})).toast;
registerToThis('$toast', toast);


//无限层级路由方案
Navigator.config({
  enableCurtain: true, //是否开启空白中转策略
  curtainPage: '/pages/curtain/curtain',  //空白中转页

  enableTaintedRestore: true, //是否开启实例覆盖自动恢复策略

  /**
   * 自定义页面数据恢复函数，用于
   * 1. wepy实例覆盖问题，存在两级同路由页面时，前者数据会被后者覆盖，返回时需予以恢复
   * 2. 层级过深时，新开页面会替换前一页面，导致前一页面数据丢失，返回时需予以恢复
   */
  pageRestoreHandler: pageRestoreHandler,

  MAX_LEVEL: 10, //最多同时打开的页面层数
});
registerPageHook('onUnload', Navigator.onPageUnload);

//wx接口Promise化
let {wxPromise, wxResolve} = (function () {
  let overrides = {  //覆盖wx的部分接口
    navigateTo: Navigator.navigateTo,
    redirectTo: Navigator.redirectTo,
    navigateBack: Navigator.navigateBack,
    reLaunch: Navigator.reLaunch,
    switchTab: Navigator.switchTab,
  };

  return {
    wxPromise: customWxPromisify({overrides, dealFail: false}),
    wxResolve: customWxPromisify({overrides, dealFail: true}),
  }
}());
registerToThis("$wxPromise", wxPromise);
registerToThis("$wxResolve", wxResolve);

export { //导出部分api，方便lib文件使用
  toast,
  wxPromise,
  wxResolve,
}

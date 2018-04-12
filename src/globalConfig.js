import wepy from 'wepy';
import {registerToThis, registerPageHook} from 'fancy-mini/lib/wepyKit';
import AdaptiveToast from 'fancy-mini/lib/AdaptiveToast';
import Navigator from 'fancy-mini/lib/navigate/Navigator';
import {customWxPromisify} from 'fancy-mini/lib/wxPromise';

//不受长度限制、不受层级约束的原生toast
let adaptiveToast = new AdaptiveToast({
  icons: {
    success: '/images/tipsucc.png',
    fail: '/images/tipfail.png'
  }
});
registerToThis(adaptiveToast); //registerToThis(adaptiveToast, adaptiveToast.installProps);


//无限层级路由方案
Navigator.config({
  curtainPage: '/pages/curtain/curtain',  //空白中转页
  enableCurtain: true, //是否开启空白中转策略
  enableTaintedRefresh: true, //是否开启实例覆盖自动刷新策略
});

registerPageHook('onUnload', Navigator.onPageUnload);
registerToThis("$wxPromise", customWxPromisify({
  overrides: {
    navigateTo: Navigator.navigateTo,
    redirectTo: Navigator.redirectTo,
    navigateBack: Navigator.navigateBack,
  }
}));

import {customWxPromisify} from 'fancy-mini/lib/wxPromise';
import {registerToThis} from 'fancy-mini/lib/wepyKit';
import {Navigator} from './navigate';

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

export {
  wxPromise,
  wxResolve,
}

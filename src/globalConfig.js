import wepy from 'wepy';
import {installGlobalProps} from 'fancy-mini/lib/wepyKit';
import AdaptiveToast from 'fancy-mini/lib/AdaptiveToast';
import Navigator from 'fancy-mini/lib/navigate/Navigator';
import {customWxPromisify} from 'fancy-mini/lib/wxPromise';

let adaptiveToast = new AdaptiveToast({
  icons: {
    success: '/images/tipsucc.png',
    fail: '/images/tipfail.png'
  }
});
installGlobalProps(adaptiveToast); //installGlobalProps(adaptiveToast, adaptiveToast.installProps);


Navigator.install();
installGlobalProps("$wxPromise", customWxPromisify({
  overrides: {
    navigateTo: Navigator.navigateTo,
    redirectTo: Navigator.redirectTo,
    navigateBack: Navigator.navigateBack,
  }
}));

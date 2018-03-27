import wepy from 'wepy';
import {installGlobalProps} from 'fancy-mini/lib/wepyKit';
import AdaptiveToast from 'fancy-mini/lib/AdaptiveToast';

let adaptiveToast = new AdaptiveToast({
  icons: {
    success: '/images/tipsucc.png',
    fail: '/images/tipfail.png'
  }
});
installGlobalProps(adaptiveToast); //installGlobalProps(adaptiveToast, adaptiveToast.installProps);


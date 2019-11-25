import AdaptiveToast from "fancy-mini/lib/AdaptiveToast";
import {registerToThis} from 'fancy-mini/lib/wepyKit';

//长度自适应的原生toast
let toast = (new AdaptiveToast({
  icons: {
    success: '/images/tipsucc.png',
    fail: '/images/tipfail.png'
  }
})).toast;
registerToThis('$toast', toast);

export {
  toast
}

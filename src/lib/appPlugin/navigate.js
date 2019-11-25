import Navigator from "fancy-mini/lib/navigate/Navigator";
import {registerPageHook, pageRestoreHandler} from 'fancy-mini/lib/wepyKit';

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

export {
  Navigator,
}

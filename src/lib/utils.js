import {wxPromise} from '@/lib/appPlugin';

//语义化的时间戳，主要用于页面中的日志打印
export function semanticTimestamp() {
  let timestamp = new Date();
  return`${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}.${timestamp.getMilliseconds()}`;
}

/**
 * 自适应跳转
 * 根据链接格式自动选择合适的跳转方式
 * @param {string} href
 * @param {boolean} [needFulfill=true] 是否自动填充（兼容配置链接中未添加打头的'/'的情形）
 * @return {Promise<void>}
 */
export async function adaptiveOpen({href, needFulfill=true}) {
  if (/^http/.test(href)) { //M页
    //个人主体小程序不支持内嵌M页，暂引导去浏览器中查看
    await wxPromise.setClipboardData({
      data: href,
    });
    await wxPromise.showModal({
      content: '链接已复制，请到浏览器中打开',
      confirmText: '好的',
      showCancel: false,
    });
  } else { //原生页面
    if (needFulfill && href[0] !== '/')
      href = '/'+href;

    await wxPromise.navigateTo({
      url: href,
    });
  }
}

//语义化的时间戳，主要用于页面中的日志打印
export function semanticTimestamp() {
  let timestamp = new Date();
  return`${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}.${timestamp.getMilliseconds()}`;
}

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // extends: 'standard', //注掉使用标准规则集，此时，所有内置lint规则均默认关闭
  // required to lint *.wpy files
  plugins: [
    'html', //保留html插件，否则eslint会在<template>部分报错
    'fancy-mini' //引入自定义lint插件
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy'] //将.wpy加入html后缀，避免其中的DOM部分和css部分被当成js解析
  },
  // add your custom rules here
  'rules': {
    'fancy-mini/navigate-wxapi': 'off', //配置自定义规则的警告级别：'error', 'warn',  'off'
    'fancy-mini/navigate-onunload': 'off',
  }
}

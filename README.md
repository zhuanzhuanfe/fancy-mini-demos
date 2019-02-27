#  fancy-mini-demos

## 功能
小程序代码库 [fancy-mini](https://github.com/zhuanzhuanfe/fancy-mini)功能演示


## 访问
- 小程序名称：fancyDemos
- 二维码：  
![](./docs/images/fancyQrCode.jpg)

## 安装
- 下载 [项目代码]()
- 下载 [微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)
- 安装依赖：

    ```bash
      npm install -g wepy-cli #安装框架的全局工具，要求版本为1.7.1及以上
      cd fancy-mini-demos #进入项目目录
      npm install #安装项目依赖
    ```

## 运行
- 编译  
    ```bash
      cd fancy-mini-demos #进入项目目录
      npm run dev #编译项目（开发模式，其它运行模式见下文）
      #此时，fancy-mini-demos目录下生成dist文件夹，该文件夹即为编译后的代码。
    ```

    可选编译模式：
    ```bash
      # npm run dev #适合开发：关闭压缩，实时刷新，可以边修改边预览
      # npm run build #适合上线：开启压缩&各种检查优化
    ```

- 新建项目  
  微信开发者工具 - 项目 - 新建项目
    - 项目目录：选择fancy-mini-demos根目录
    - AppID： 填写开发者自己的小程序AppID
    - 项目名称：fancy-mini-demos （或其它任意名称）
- 打开项目  
  新建完成后自动打开，也可在 微信开发者工具 - 项目 - 切换至最近项目/查看所有项目 中进行切换
- 配置项目  
  微信开发者工具 - 详情 - 项目设置
  - 关闭“ES6 转 ES5”
  - 关闭“上传代码时样式自动补全”
  - 关闭“代码上传时自动压缩”
  - 其它选项随意，根据需求场景自行配置
- 查看效果  
  - PC预览：微信开发者工具 - 编译，即可在模拟器中查看小程序页面
  - 手机预览：微信开发者工具 - 预览 - 手机扫描生成的二维码
  - 上传至体验版：微信开发者工具 - 上传 - 请管理员将自己提交的版本设为体验版
  - 上线： 微信开发者工具 - 上传 - 请管理员将自己的版本提交审核

## 文档
### 项目技术栈 & 参考学习资源
- [小程序开发](https://mp.weixin.qq.com/debug/wxadoc/dev/)
- [wepy框架](https://tencent.github.io/wepy/)
- [es6语法](http://es6.ruanyifeng.com/#docs/reference)
- [less语法](http://lesscss.org/)
- 转转小程序代码库：[fancy-mini](https://github.com/zhuanzhuanfe/fancy-mini)

## TODO
- 补全demo

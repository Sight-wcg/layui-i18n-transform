# layui 国际化转换工具

# 使用

1. 克隆项目到本地
```
git clone --recurse-submodules https://github.com/Sight-wcg/layui-i18n-transform
```
2. 安装依赖
```
npm install
```
3. 在 `src/lang-template` 下创建一个名为 `{locale}.js` 的文件
4. 从 `src/base-template/index.js` 中复制模板内容粘贴到 `{locale}.js` 中
5. 开始翻译
6. 执行 `npm run t {locale}`，例如 `npm run t en-us` 转换翻译文本
7. 在 `out` 目录找到转换后的文件，复制到 layui 项目中构建

# 相关信息
[AST-GREP JavaScript API](https://ast-grep.github.io/guide/api-usage/js-api.html)

[Git 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

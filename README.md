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
3. 在 `src/lang-template` 下创建一个名为 `{locale}.js` 的文件，例如 `en-us.js`
4. 从 `src/base-template/index.js` 中复制模板内容粘贴到 `{locale}.js` 中
5. 开始翻译
6. 执行 `npm run t locale [fnName]`，fnName 是可选的，表示翻译函数名
```
npm run t en-us  // 纯文本替换，转换后的文件会直接输出到 layui 目录
npm run t custom $.i18n.prop // 指定后会在翻译文本的外部包裹函数，用于配合第三方 i18n 库使用
```
注意，一些本地化文本中包含 HTML 标签，很容易导致 XSS 漏洞，因此推荐用纯文本替换的方案。配合第三方 i18n 库使用时需要手动将 HTML 内容剔除，修改源码中的字符串拼接。

7. 检查转换文件内容无误后，执行 `npm run build` 构建 layui-i18n 文件，构建后的文件在 `layui/dist` 目录

# 相关信息
[AST-GREP JavaScript API](https://ast-grep.github.io/guide/api-usage/js-api.html)

[Git 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

const {override, fixBabelImports, addLessLoader} = require('customize-cra');
// override 对以前函数覆盖
// fixBabelImports  简写
module.exports = override(
  fixBabelImports('import', {		// 引用了 babel-plugin-import
    libraryName: 'antd',			// 针对 antd
    libraryDirectory: 'es',			// 源码文件夹中的es文件夹
    style: true,					// 自动打包相关的样式文件，默认'css'表示加载 css 样式，本例修改 less 为样式文件
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},   // 可以自定义变量，修改了 primary 主题的颜色
  }),
);
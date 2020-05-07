# react-webpack

一个webpack配置的react项目模板，包含typescript和一些拓展内容。

## 技术栈

#### 托管平台

- [x] github

#### 服务器

- [ ] windows server

#### 数据库

- [ ] sqlite

#### 后端

- [x] node8
    - [ ] koa2

#### 前端

- [x] react
    - [x] react-router-dom
    - [x] react-redux
    - [x] reselect
- [x] redux
    - [x] redux-thunk
- [x] axios
- [x] less

## 项目功能实现

- [ ] 1.待写入

## 参考资料

#### 1. 关于pages.config.js

- 简述

```
`pages.config.js` 是一个webpack多页面应用配置项，暂时还未实现完全动态化。
注意：如果你开发的是单页面应用无需改变pages.config.js的内容

pages针对的是多页面进行配置
如果需要进行针对单页面，多个路由进行分块加载，请使用routes中的dynamic高阶组件

配置说明：
isExtractCss：boolean-----是否提取样式文件css或less到单独文件当中
chunksOnAllPages：[string,array]-----多页面应用时配置所有页面都需要包含的chunk
defaultOpt: [object]-----为所有页面配置默认可选参数，如defaultOpt: {title: "所有图片的默认标题"}
pages：[string,object,array]-----页面关联的js文件，这个配置关系到打包后生成的html文件数量


例如：
    只有一个index页面---pages:"index" 或者 pages:{pageName:"index"}
    多个页面，如存在index和about页面---["index","about"]
    如果页面需要特殊设置请传入一个对象---[{pageName:"index"}]

更加复杂的页面分割优化：需要进行chunks参数设置，同时要设置splitChunks
具体设置参考webpack chunks参数，chunks参数可以直接在`pages.config.js`中设置
```

- [ page ]参数

```
{
    notHtml: false,  //不需要生成对应html页面的出口文件
    type: 'js',  //指定文档类型，默认js，支持ts
    title: '页面标题',
    keywords: "页面关键字",
    description: "页面描述",
    iconPath: "./favicon.ico",
    style: "页面全局style",
    pageName: "index",  //页面名称
    template: "./draft/template.html",  //页面模板
    chunks: []  //打入页面的chunks，与splitChunks参数配置有关
}
```

#### 2. 资源模块化

```
图片导入建议使用，require("图片路径")
esModule默认被设置false，如果想启用请在webpack.config.js中设置
```

#### 3. 热更新HMR启用

```
webpack.config.js中启用hot参数

index.js中监听模块变化，并执行替换逻辑

    if (module.hot) { //告诉 webpack 接受热替换的模块
        module.hot.accept('./print.js', function() {
            // 当print.js模块变化时，执行的逻辑
            // 更新逻辑得自己写
        })
    }

```

#### 4. 支持说明

```
支持ts和tsx语法
支持jsx解析，支持服务器代理
支持css模块化，模块化导入请后缀带有module.css
支持less和less模块化，模块化导入请后缀带有module.less
支持文件导入，并且小文件自动编译base64，大文件单独导出
```

#### 5. 配合路由动态导入组件实现代码分割

```
// 该组件是动态加载的
const Login = React.lazy(() => import(/* webpackChunkName: "login" */'../views/login/login'));
```

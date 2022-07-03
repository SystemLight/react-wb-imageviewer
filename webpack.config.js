const path = require('path')
const fs = require('fs')

const webpack = require('webpack')

// webpack配置项：https://webpack.js.org/configuration/
class Webpack5RecommendConfig {
  constructor(env, argv, options) {
    let cwd = process.cwd()
    let isTsProject = fs.existsSync(path.join(cwd, 'tsconfig.json'))
    this.mode = argv.mode || 'development'
    this.isProduction = this.mode === 'production'

    let _options = {
      cwd: cwd, // 当前运行webpack所在位置
      srcPath: path.resolve(cwd, 'src'), // 源码目录文件位置
      distPath: path.resolve(cwd, 'dist'),// 输出文件位置
      publicPath: '/', // 发布时URL访问路径
      packageJSON: require(path.join(cwd, 'package.json')), // package.json文件信息对象
      isTsProject: isTsProject, // 是否为ts项目
      isEntryJSX: false, // 定义入口文件是否是JSX或者TSX
      scriptExt: isTsProject ? '.ts' : '.js', // 入口脚本扩展名称
      entryDefaultName: 'main', // 入口默认名,webpack默认入口为index.js，输出为main.js
      entryDefaultFileName: null, // // 入口文件默认名称
      staticFolderPath: path.join(cwd, 'public'), // 静态文件public目录
      title: 'Webpack App', // 主页标题
      enableProfile: false, // 是否统计并打印webpack打包详细信息
      enableProxy: false, // 是否启用代理配置
      enableThread: false, // 是否启用多线程
      enableBabel: this.isProduction, // 默认生产环境进行babel编译，如果你使用React JSX那么需要永久启用并添加@babel/preset-react
      enableHash: true, // 是否启用HASH
      emitCss: this.isProduction, // 是否分离css
      emitHtml: true, // 是否弹出HTML文件
      emitPublic: true, // 是否复制public中静态文件
      isSplitChunk: true, // 是否做代码Chunk切分
      libraryName: false, // 是否作为库函数进行发布
      externals: [], // 需要做排除的库，目前支持react
      skipCheckBabel: false // 跳过babel编译检查
    }
    if (Array.isArray(options)) {
      if (options.length === 1) {
        Object.assign(_options, options[0])
      } else if (options.length === 3) {
        if (this.isProduction) {
          Object.assign(_options, options[0], options[1]) // 生产配置
        } else {
          Object.assign(_options, options[0], options[2]) // 开发配置
        }
      } else {
        throw TypeError('Incorrect number of options parameters.')
      }
    } else if (typeof options === 'object') {
      Object.assign(_options, options)
    }

    this.cwd = _options.cwd
    this.srcPath = _options.srcPath
    this.distPath = _options.distPath

    this.publicPath = _options.publicPath

    this.packageJSON = _options.packageJSON
    this.dependencies = Object.keys({ // 项目依赖库数组，用于判定包含什么框架
      ...this.packageJSON['devDependencies'],
      ...this.packageJSON['dependencies']
    })

    this.isTsProject = _options.isTsProject
    this.isEntryJSX = _options.isEntryJSX
    this.scriptExt = _options.scriptExt
    if (this.isEntryJSX === true || this.isEntryJSX === 'auto' && this.isInclude('react')) {
      this.scriptExt += 'x'
    }
    this.entryDefaultName = _options.entryDefaultName
    this.entryDefaultFileName = _options.entryDefaultFileName || `${this.entryDefaultName}${this.scriptExt}`
    this.staticFolderPath = _options.staticFolderPath

    this.enableHash = _options.enableHash
    this.enableProfile = _options.enableProfile
    this.enableProxy = _options.enableProxy
    this.enableThread = _options.enableThread
    this.enableBabel = _options.enableBabel
    this.skipCheckBabel = _options.skipCheckBabel
    if (this.isProduction) {
      this.checkEnableBabel()
    }
    if (!this.isTsProject && this.isInclude('react')) {
      this.checkEnableBabel()
    }
    if (this.enableBabel) {
      this.checkBabelCompileReact()
    }

    this.title = _options.title

    this.emitCss = _options.emitCss
    this.emitHtml = _options.emitHtml
    this.emitPublic = _options.emitPublic
    this.isSplitChunk = _options.isSplitChunk

    this.externals = _options.externals
    this.libraryName = _options.libraryName
    if (this.libraryName === true) {
      this.libraryName = this.camelCase(this.packageJSON['name']) || 'library'
    }

    this._config = {}
  }

  static buildLibraryOptions(libraryName) {
    return [
      {
        emitCss: false,
        emitHtml: false,
        libraryName: libraryName,
        isSplitChunk: false,
        enableHash: false
      },
      {emitPublic: false},
      null
    ]
  }

  static buildReactLibraryOptions(componentName) {
    let options = Webpack5RecommendConfig.buildLibraryOptions(componentName)
    options[0].externals = ['react']
    return options
  }

  static newLibrary(env, argv, libraryName) {
    return new Webpack5RecommendConfig(env, argv, Webpack5RecommendConfig.buildLibraryOptions(libraryName))
  }

  static newReactLibrary(env, argv, componentName) {
    return new Webpack5RecommendConfig(env, argv, Webpack5RecommendConfig.buildReactLibraryOptions(componentName))
  }

  build(buildCallback) {
    // webpack5配置文档：https://webpack.js.org/configuration/
    this.buildBasic()
    this.buildInsAndOuts()
    this.buildExternals()
    this.buildResolve()
    this.buildDevServer()
    this.buildImprove()
    this.buildRules()
    this.buildPlugins()

    if (buildCallback) {
      buildCallback.call(this, this._config)
    }
    return this
  }

  buildBasic() {
    this._config.mode = this.mode
    this._config.stats = 'errors-only'
    this._config.devtool = this.isProduction ? false : 'eval-source-map'
    this._config.context = this.cwd
    if (!this.isProduction) {
      this._config.target = 'web' // 默认值：browserslist
    }

    return this
  }

  buildInsAndOuts() {
    this._config.entry = {
      [this.entryDefaultName]: path.join(this.srcPath, this.entryDefaultFileName)
    }

    this._config.output = {
      path: this.distPath,
      publicPath: this.publicPath,
      compareBeforeEmit: false,
      iife: true,
      clean: true
    }

    if (this.enableHash) {
      Object.assign(this._config.output, {
        filename: '[name].bundle.[chunkhash:8].js',
        chunkFilename: '[name].chunk.[chunkhash:8].js',
        assetModuleFilename: 'assets/[name][hash:8][ext]'
      })
    } else {
      Object.assign(this._config.output, {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        assetModuleFilename: 'assets/[name][ext]'
      })
    }

    // https://webpack.js.org/configuration/output/#outputlibrary
    if (this.libraryName) {
      this._config.output.globalObject = 'this'
      this._config.output.library = {
        name: this.libraryName,
        // https://webpack.js.org/configuration/output/#outputlibrarytype
        type: 'umd2',
        export: 'default',
        umdNamedDefine: true,
        auxiliaryComment: {
          root: 'Root Export',
          commonjs: 'CommonJS Export',
          commonjs2: 'CommonJS2 Export',
          amd: 'AMD Export'
        }
      }
    }

    return this
  }

  buildExternals() {
    // https://webpack.js.org/configuration/externals/
    this._config.externals = {}

    if (this.externals.includes('react')) {
      Object.assign(this._config.externals, {
        react: {
          root: 'React',
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'react-dom'
        }
      })
    }

    return this
  }

  buildResolve() {
    this._config.resolve = {
      extensions: ['.js'],
      alias: {
        '@': path.join(this.cwd, 'src')
      }
    }

    if (this.isTsProject) {
      this._config.resolve.extensions.push('.ts')
    }

    if (this.isInclude('react')) {
      this._config.resolve.extensions.push('.jsx')
      if (this.isTsProject) {
        this._config.resolve.extensions.push('.tsx')
      }
    }

    if (this.isInclude('vue')) {
      this._config.resolve.extensions.push('.vue')
    }

    return this
  }

  buildDevServer() {
    // https://webpack.js.org/configuration/dev-server/
    let port = 8080
    this._config.devServer = {
      allowedHosts: 'all',
      historyApiFallback: false,
      host: '0.0.0.0',
      liveReload: true,
      hot: false, // HMR（Hot Module Replacement），JS文件内需要调用accept()
      open: [`http://localhost:${port}/`],
      port: port,
      magicHtml: false,
      // https://github.com/webpack/webpack-dev-middleware
      devMiddleware: {
        stats: false
      }
    }

    if (this.enableProxy) {
      this._config.devServer.proxy = this.configProxy()
    }

    return this
  }

  buildImprove() {
    this._config.performance = {
      hints: 'warning',
      maxAssetSize: (this.isProduction ? 3 : 30) * 1024 * 1024,
      maxEntrypointSize: (this.isProduction ? 3 : 30) * 1024 * 1024
    }

    this._config.optimization = {}
    if (this.isSplitChunk) {
      /**
       * https://webpack.js.org/plugins/split-chunks-plugin/#configuration
       *
       * 产生chunk的3种方式
       * 1. 手动设置规则进行切割
       * 2. 多个入口文件会被当成多个Chunk处理
       * 3. 使用import()进行异步导入
       */
      this._config.optimization.splitChunks = {
        /**
         * all: 所有方式引入的Module中的符合手动切割Chunk规则的Module都会被解析分离
         * initial: 异步引入的Module中符合手动切割Chunk规则的Module不做解析分离
         * async: 同步引入的Module中符合手动切割Chunk规则的Module不做解析分离
         */
        chunks: 'all',
        automaticNameDelimiter: '~',
        cacheGroups: this.getSplitChunksGroup()
      }

      if (this.isProduction) {
        this._config.optimization.runtimeChunk = 'single'
      }
    }

    Object.assign(this._config.optimization, {
      minimize: this.isProduction,
      minimizer: [
        new (require('terser-webpack-plugin'))() //
      ]
    })
    return this
  }

  buildRules() {
    this._config.module = {rules: []}

    /**
     * 添加js解析
     */
    let jsUse = this.enableBabel ? ['babel-loader'] : []
    if (this.enableThread) {
      jsUse.unshift('thread-loader')
    }
    this._config.module.rules.push({
      test: /\.js$/,
      exclude: /[\\/]node_modules[\\/]/,
      use: jsUse
    })

    /**
     * 添加jsx解析
     */
    let jsxUse = this.enableBabel ? ['babel-loader'] : []
    if (this.enableThread) {
      jsxUse.unshift('thread-loader')
    }
    this._config.module.rules.push({
      test: /\.jsx$/,
      use: jsxUse
    })

    if (this.isTsProject) {
      /**
       * 添加ts/tsx解析
       */
      let tsUse = this.enableBabel ? ['babel-loader'] : []
      let jsx = 'preserve'
      if (!this.enableBabel && this.isInclude('react')) {
        jsx = 'react-jsxdev'
      }

      tsUse.push({
        loader: 'ts-loader',
        options: {
          // https://github.com/TypeStrong/ts-loader#happypackmode
          happyPackMode: this.enableThread,
          transpileOnly: true,
          compilerOptions: {
            jsx: jsx,
            noEmit: true
          }
        }
      })
      if (this.enableThread) {
        tsUse.unshift('thread-loader')
      }
      this._config.module.rules.push({
        test: /\.tsx?$/,
        use: tsUse
      })
    }

    /**
     * 添加css解析
     */
    this._config.module.rules.push({
      test: /\.css$/,
      use: this.getCssLoader()
    })

    /**
     * 添加sass解析
     */
    if (this.isInclude('sass')) {
      this._config.module.rules.push({
        test: /\.s[ca]ss$/,
        use: this.getCssLoader('sass')
      })
    }

    /**
     * 添加sass解析
     */
    if (this.isInclude('less')) {
      this._config.module.rules.push({
        test: /\.less$/,
        use: this.getCssLoader('less')
      })
    }

    /**
     * https://webpack.js.org/guides/asset-modules/
     *
     * 添加图片资源解析
     */
    this._config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      type: 'asset',
      generator: {
        filename: this.enableHash ? 'images/[name].[hash:8][ext]' : 'images/[name][ext]'
      }
    })

    /**
     * https://webpack.js.org/guides/asset-modules/
     *
     * 添加媒体资源解析
     */
    this._config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: this.enableHash ? 'media/[name].[hash:8][ext]' : 'images/[name][ext]'
      }
    })

    /**
     * https://webpack.js.org/guides/asset-modules/
     *
     * 添加字体资源解析
     */
    this._config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset',
      generator: {
        filename: this.enableHash ? 'font/[name].[hash:8][ext]' : 'images/[name][ext]'
      }
    })

    return this
  }

  buildPlugins() {
    this._config.plugins = []

    if (this.isProduction) {
      /**
       * 将 CSS 提取到单独的文件中
       * https://webpack.js.org/plugins/mini-css-extract-plugin/
       */
      this._config.plugins.push(
        new (require('mini-css-extract-plugin'))({
          filename: this.enableHash ? '[name].style.[chunkhash:8].css' : '[name].style.css'
        })
      )
    }

    /**
     * 自动添加HTML插件
     * https://github.com/jantimon/html-webpack-plugin
     */
    if (this.emitHtml) {
      let htmWebpackPluginOptions = {
        title: this.title,
        filename: 'index.html',
        inject: 'body',
        scriptLoading: 'defer', // 'blocking'|'defer'|'module'
        hash: false,
        // https://github.com/terser/html-minifier-terser
        minify: this.isProduction
          ? {
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true
          }
          : false
      }
      this._config.plugins.push(new (require('html-webpack-plugin'))(htmWebpackPluginOptions))
    }

    if (this.emitPublic && fs.existsSync(this.staticFolderPath)) {
      /**
       * 将已存在的单个文件或整个目录复制到构建目录
       * https://webpack.js.org/plugins/copy-webpack-plugin
       */
      this._config.plugins.push(
        new (require('copy-webpack-plugin'))({
          patterns: [
            {
              from: this.staticFolderPath,
              to: '.'
            }
          ]
        })
      )
    }

    if (this.enableProfile) {
      /**
       * Elegant ProgressBar and Profiler for Webpack 3 , 4 and 5
       * https://github.com/unjs/webpackbar
       */
      this._config.plugins.push(
        new (require('webpackbar'))({
          reporters: ['fancy', 'profile'],
          profile: true
        })
      )
    } else {
      this._config.plugins.push(new (require('webpackbar'))())
    }

    /**
     * 允许在编译时配置全局常量
     * https://webpack.js.org/plugins/define-plugin
     */
    this._config.plugins.push(
      new webpack.DefinePlugin({
        webpack5RecommendConfigOptions: {
          author: '"SystemLight"'
        }
      })
    )

    /**
     * 在监视模式下忽略指定的文件
     * https://webpack.js.org/plugins/watch-ignore-plugin/
     */
    let ignorePaths = []
    if (this.isTsProject) {
      // https://github.com/TypeStrong/ts-loader#usage-with-webpack-watch
      ignorePaths.push(/\.js$/, /\.d\.ts$/)
      this._config.plugins.push(
        new webpack.WatchIgnorePlugin({
          paths: ignorePaths
        })
      )
    }

    return this
  }

  checkEnableBabel() {
    if (!this.skipCheckBabel && !this.enableBabel) {
      throw TypeError('Please start Babel in the production environment to compile.')
    }
  }

  checkBabelCompileReact() {
    if (this.isInclude('react') && !this.isInclude('@babel/preset-react')) {
      throw TypeError('Please add and configure @babel/preset-react in Babel to compile the react project.')
    }
  }

  camelCase(content) {
    if (!content) {
      return ''
    }
    return content.split('/').slice(-1)[0].replace(/-(\w)/g, (_, $1) => $1.toUpperCase())
  }

  isInclude(libraryName) {
    return this.dependencies.includes(libraryName)
  }

  getSplitChunksGroup() {
    // 内置定义Chunk切割分离规则
    let cacheGroups = {
      common: {
        name: 'common',
        minChunks: 2,
        reuseExistingChunk: true,
        priority: -20
      },
      vendors: {
        name: 'vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      }
    }

    if (this.dependencies.includes('vue')) {
      Object.assign(cacheGroups, {
        vue: {
          name: 'vue',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)/,
          chunks: 'all',
          enforce: true
        }
      })
    }

    if (this.dependencies.includes('element-ui')) {
      Object.assign(cacheGroups, {
        elementUI: {
          name: 'element-ui',
          test: /[\\/]node_modules[\\/](element-ui)/,
          chunks: 'all'
        }
      })
    }

    if (this.dependencies.includes('react')) {
      Object.assign(cacheGroups, {
        react: {
          name: 'react',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)/,
          chunks: 'all'
        }
      })
    }

    if (this.dependencies.includes('antd')) {
      cacheGroups = Object.assign(cacheGroups, {
        antd: {
          name: 'antd',
          test: /[\\/]node_modules[\\/](@ant-design|antd)/,
          chunks: 'all'
        }
      })
    }

    return cacheGroups
  }

  getCssLoader(cssPreprocessing) {
    let cssRuleLoaders = []

    if (this.emitCss) {
      cssRuleLoaders.push(require('mini-css-extract-plugin').loader)
    } else {
      cssRuleLoaders.push('style-loader')
    }

    cssRuleLoaders.push('css-loader')

    if (this.isProduction && this.isInclude('postcss-loader')) {
      cssRuleLoaders.push('postcss-loader')
    }

    switch (cssPreprocessing) {
      case 'sass':
        cssRuleLoaders.push('sass-loader')
        break
      case 'less':
        cssRuleLoaders.push('less-loader')
        break
    }

    return cssRuleLoaders
  }

  configProxy() {
    return {
      // https://github.com/chimurai/http-proxy-middleware
      '/api': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        secure: false
      }
    }
  }

  toConfig(debug) {
    if (debug) {
      console.log(this._config)
    }
    return this._config
  }
}

module.exports = (env, argv) => Webpack5RecommendConfig
  .newReactLibrary(env, argv, 'WbImageViewer')
  .build(function (config) {
    config.devtool = false
    if (this.isProduction) {
      config.output.filename = '[name].umd.js'
    }
  })
  .toConfig()

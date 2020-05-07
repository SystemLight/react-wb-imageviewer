const ph = require("path");

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const {
    splitChunks,
    chunksOnAllPages,
    pages,
    defaultOpt,
    isExtractCss
} = require("./pages.config");


function getExtractTextPlugin() {
    if (isExtractCss) {
        return [
            new ExtractTextPlugin({
                filename: "css/[name].style.css"
            })
        ];
    }
    return [];
}

function getExtract(opt) {
    if (isExtractCss) {
        return ExtractTextPlugin.extract(opt);
    } else {
        opt.use.unshift(opt.fallback);
        return [...opt.use];
    }
}

module.exports = (env, argv) => {
    let workEnv = argv.mode;

    let getMinify = workEnv === "development" ? undefined : {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true
    };

    let getDevServer = {
        contentBase: './dist',
        index: 'index.html',
        openPage: '',
        inline: true,
        historyApiFallback: true,
        hot: false,
        hotOnly: false,
        open: true,
        proxy: {
            '/proxy':
                {
                    target: 'https://cnodejs.org/',
                    secure: true,
                    pathRewrite: {'^/proxy': ''},
                    changeOrigin: true,
                    cookieDomainRewrite: ".cnodejs.org"
                }
        }
    };

    let getHtmlPage = function (pages) {
        let htmlArray = [];
        if (!Array.isArray(pages)) {
            pages = [pages];
        }
        pages.forEach((page) => {
            if (page.hasOwnProperty("notHtml") && page.notHtml) {
                // 如果页面设置了notHtml参数将不创建对应的html页面
                return;
            }

            // 初始默认参数
            let defaultPageOpt = Object.assign({
                title: 'my react app',
                keywords: "关键词",
                description: "描述",
                iconPath: "./favicon.ico",
                style: "",
                pageName: "index",
                template: "./draft/template.html",
                chunks: []
            }, defaultOpt);

            switch (typeof page) {
                case "string":
                    defaultPageOpt["pageName"] = page;
                    break;
                case "object":
                    defaultPageOpt = Object.assign(defaultPageOpt, page);
                    break;
                default:
                    break;
            }

            if (typeof defaultPageOpt.chunks === "string") {
                defaultPageOpt["chunks"] = [defaultPageOpt["chunks"]];
            }

            let chunks;
            switch (typeof chunksOnAllPages) {
                case "string":
                    chunks = new Set([defaultPageOpt.pageName, ...defaultPageOpt.chunks, chunksOnAllPages]);
                    break;
                case "object":
                    chunks = new Set([defaultPageOpt.pageName, ...defaultPageOpt.chunks, ...chunksOnAllPages]);
                    break;
                default:
                    chunks = [defaultPageOpt.pageName, ...defaultPageOpt.chunks];
                    break;
            }

            htmlArray.push(
                new HtmlWebpackPlugin({
                    title: defaultPageOpt.title,
                    keywords: defaultPageOpt.keywords,
                    description: defaultPageOpt.description,
                    iconPath: defaultPageOpt.iconPath,
                    style: defaultPageOpt.style,
                    hash: false,
                    filename: `${defaultPageOpt.pageName}.html`,
                    template: defaultPageOpt.template,
                    inject: true,
                    minify: getMinify,
                    chunks: [...chunks]
                })
            );
        });
        return htmlArray;
    };

    let getEntry = function (pages) {
        let entryObject = {};
        if (!Array.isArray(pages)) {
            pages = [pages];
        }
        pages.forEach(page => {
            let key;
            let type = "js";
            if (typeof page === "string") {
                key = page;
            } else {
                key = page.pageName;
                type = page.type || type;
            }
            entryObject[key] = `./src/${key}.${type}`;
        });
        return entryObject;
    };

    return {
        mode: workEnv,
        devtool: workEnv === "development" ? 'inline-source-map' : "source-map",
        context: __dirname,
        resolve: {
            extensions: [".js", ".ts", ".jsx", ".tsx"]
        },
        devServer: getDevServer,
        optimization: {splitChunks: splitChunks},
        entry: getEntry(pages),
        output: {
            filename: "js/[name].bundle.js",
            path: ph.resolve(__dirname, "dist"),
            publicPath: "/"
        },
        externals: {},
        module: {
            rules: [
                {
                    test: /^(?!.*\.module).*\.less$/,
                    exclude: /(node_modules|bower_components)\/(?!antd)/,
                    use: getExtract({
                        fallback: "style-loader",
                        use: ["css-loader", "less-loader"]
                    })
                },
                {
                    test: /^(.*\.module).less$/,
                    exclude: /(node_modules|bower_components)/,
                    use: getExtract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: "[name]-[hash:base64:6]",
                                    },
                                }
                            },
                            "less-loader"
                        ]
                    })
                },
                {
                    test: /^(?!.*\.module).*\.css$/,
                    exclude: /(node_modules|bower_components)\/(?!antd)/,
                    use: getExtract({
                        fallback: "style-loader",
                        use: ["css-loader"]
                    })
                },
                {
                    test: /^(.*\.module).css$/,
                    exclude: /(node_modules|bower_components)/,
                    use: getExtract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: "[name]-[hash:base64:6]",
                                    },
                                }
                            }
                        ]
                    })
                },
                {
                    test: /(\.jsx|\.js)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader!ts-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            fallback: 'file-loader',
                            name: 'media/images/[name].[hash:7].[ext]',
                            publicPath: '/',
                            esModule: false
                        }
                    }]
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: __dirname + '/public',
                    to: __dirname + '/dist',
                    ignore: ['.*']
                }
            ]),
            ...getExtractTextPlugin(),
            // 如果需要预渲染，需要安装插件后，把这段代码注释去掉，并正常引入插件
            // new PrerenderSPAPlugin({
            //     staticDir: ph.resolve(__dirname, "dist"),
            //     routes: ['/', '/about'],
            //     renderer: new Renderer({
            //         headless: false,
            //         renderAfterDocumentEvent: 'pre-render'
            //     })
            // }),
            ...getHtmlPage(pages),
        ]
    }
};

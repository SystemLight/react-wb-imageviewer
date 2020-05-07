let splitChunks = {
    // chunks : all, async, and initial
    chunks: 'async',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: 4,
    automaticNameDelimiter: '~',
    automaticNameMaxLength: 30,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        },
        react: {
            // Define a chunk named react
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
        }
    }
};

module.exports = {
    splitChunks,
    chunksOnAllPages: "react",
    isExtractCss: false,
    defaultOpt: {title: "微博图片浏览组件"},
    pages: "index"
};
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MultipleJsEntryPlugin = require('../../plugin/index.js');

const env = process.env.NODE_ENV;

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '../src/app.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name]-[hash].js',
        // filename: '[name].js',
        chunkFilename: '[name]-[chunkhash]x.js',
        publicPath: 'http://localhost:1093/',
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
    stats: {
        // 'errors-only'
        // 移除样式文件引入顺序不一致告警
        warningsFilter: warning => /Conflicting order between/gm.test(warning),
    },
    devServer: {
        open: false,
        hot: true,
        contentBase: path.join(__dirname, '..', 'dist'),
        compress: true,
        watchContentBase: false,
        port: 1093,
        // allowedHosts: ['.youzan.com', '0.0.0.0', '*'],
        disableHostCheck: true, // 禁止检测 host 域名
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        watchOptions: {
            aggregateTimeout: 500,
            ignore: /node_modules/,
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-0'], // <--- here
                    },
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // 将css提取为单独的文件
                    },
                    // 将 vue 文件中的样式文件插入到 html 中
                    // 使用了 MiniCssExtractPlugin 进行分离，所以不需要再使用 vue-style-loader
                    // 否则会报错，style-loader 也是同理
                    // 'vue-style-loader',
                    // 'style-loader',
                    'css-loader', // 将 CSS 转化成 js 模块
                    'postcss-loader',
                    'sass-loader', // 将 Sass/Scss 编译成 CSS
                ],
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // 小于 1 KB 图片使用 base64
                    },
                },
            }, // 处理 图片路径的 loader
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: '[id]-[hash].css',
            ignoreOrder: true,
        }),
        new MultipleJsEntryPlugin({
            src: path.join(__dirname, '../src'),
            split: '-',
            level: 0,
            // entryFiles: '*/**/index.js',
            // filter: (file) => {
            //     console.warn('into filter =======>');
            //     console.warn(file);
            //     return true;
            // },
            // format: (file) => {
            //     console.warn('into format =======>');
            //     console.warn(file);
            //     return Math.random();
            // },
        }),
    ],
};

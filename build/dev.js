const merge = require('webpack-merge');
const webpackBaseConfig = require('./base');
const path = require('path');
const webpack = require('webpack');

const webpackDevConfig = merge(webpackBaseConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'script/[name].[hash].js',
        chunkFilename: 'script/[name].[hash].js'
        // publicPath:'./dist/'
    },
    // 代码映射，方便调错，会把源代码的错误行数报出来
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        // 静态访问的文件放到根目录下的static目录下；
        // 发布到线上的话，对应的静态文件放到域名指向的根目录
        // dist和static目录下面的文件，可直接通过`/${文件名}.${后缀名}`访问，相当于这些文件都是在根目录下的
        contentBase: [path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../static')],
        compress: true,
        port: 8081,
        host: '0.0.0.0',
        // 编译的错误或警告信息是否显示
        overlay: {
            errors: true
        },
        // 启动模块热更新
        hot: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                // pathRewrite: {"^/api" : ""},
                changeOrigin: true
            },
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        // 模块热更新插件
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            // css文件编译
            {
                test:/\.css$/,
                use:['style-loader','css-loader','postcss-loader']
            },
            // less文件编译
            {
                test: /\.less$/,
                // 数组中loader的执行顺序是倒着排的
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
        ]
    }
});

module.exports = webpackDevConfig;

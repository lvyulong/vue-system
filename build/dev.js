const merge = require('webpack-merge');
const webpackBaseConfig = require('./base');
const path = require('path');
const webpack = require('webpack');

const webpackDevConfig = merge(webpackBaseConfig,{
  mode:'development',
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:'script/[name].[hash].js',
    chunkFilename: 'script/[name].[hash].js'
    // publicPath:'./dist/'
  },
  // 代码映射，方便调错，会把源代码的错误行数报出来
  devtool:'cheap-module-eval-source-map',
  devServer:{
    contentBase:path.resolve(__dirname,'../dist'),
    compress:true,
    port:80,
    host:'0.0.0.0',
    // 编译的错误或警告信息是否显示
    overlay: {
      errors:true
    },
    // 启动模块热更新
    hot:true,
    proxy: {
      // "/api": {
      //   target: "http://localhost:3000",
      //   pathRewrite: {"^/api" : ""}
      // }
      "/api": "http://localhost:3000"
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
  module:{
    rules:[
            // less文件编译
            {
              test:/\.less$/,
              // 数组中loader的执行顺序是倒着排的
              use:['style-loader','css-loader','postcss-loader','less-loader']
            },
    ]
  }
});

module.exports = webpackDevConfig;

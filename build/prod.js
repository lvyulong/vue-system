const merge = require('webpack-merge');
const webpackBaseConfig = require('./base');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const webpackProdConfig = merge(webpackBaseConfig,{
  /* 声明为生产环境，webpack使用的很多plugin会自动使用生产环境的方式打包，
  比如optimization.mnimize在生产环境默认为true，压缩代码*/
  mode:'production',
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:'script/[name].[chunkhash].js',
    chunkFilename: 'script/[name].[chunkhash].js',
    publicPath:'./'
  },
  plugins: [
    // 定义全局变量，在src文件下可以使用；打包时替换
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 提取css文件为单独的文件
    new MiniCssExtractPlugin({
      filename:'style/[name].[hash].css',
      chunkFilename: 'style/[id].[hash].css'
    }),
    // 压缩css文件
    // new OptimizeCssAssetsWebpackPlugin(),
    // 每次构建清除dist
    new CleanWebpackPlugin(['dist'],{
      root:path.resolve(__dirname,'../')
    }),
  ],
  module:{
    rules:[
      // less文件编译,并提取为单独的文件，方便做浏览器缓存
      {
        test:/\.less$/,
        use:[
          // css文件提取为单独的文件
          {
            loader:MiniCssExtractPlugin.loader,
            options:{
              publicPath: '../' 
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ],
      },
    ]
  },
  optimization:{
    // 生产环境，minimize默认为true；
    // minimize:false,
    // 提取出来公共的模块
    splitChunks: {
      cacheGroups: {
        vendors:{
          test: /[\\/]node_modules[\\/]/,
          chunks: "all"
        }
      }
    }
  }
});
module.exports = webpackProdConfig;

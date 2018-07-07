const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = {
  entry: path.resolve(__dirname,'../src/main.js'),

  plugins: [
    // 15版本除了需要声明loader，还需要在plugin处声明
    new VueLoaderPlugin(),
    // 生成入口html
    new HtmlWebpackPlugin({
      title:'Vue Demo',
      favicon:path.resolve(__dirname,'../favicon.ico')
    }),
  ],
  resolve:{
    alias: {
      app: path.resolve(__dirname, '../src/'),
    }
  },
  module:{
    rules:[
      // es6语法编译
      {
        test:/\.js$/,
        exclude: /node_modules/,
        use:{
          loader:'babel-loader'
        }
      },
      // vue文件编译
      {
        test:/\.vue$/,
        use:{
          loader:'vue-loader',
          options:{}
        }
      },
      // css文件编译
      {
        test:/\.css$/,
        use:['style-loader','css-loader','postcss-loader']
      },
      // 图片处理
      {
        test:/\.(jpe?g|png|svg|gif)$/,
        include: [path.resolve(__dirname,'../src/assets/image')],
        use: {
          loader:'url-loader',
          options:{
            limit:10000,
            name: 'image/[name].[hash:7].[ext]'
          }
        }
      },
      // 字体处理
      {
        test:/\.(woff2?|eot|ttf|svg|otf)$/,
        use:{
          loader:'url-loader',
          options:{
            limit:10000,
            name:'font/[name].[hash:7].[ext]'
          }
        }
      }
    ]
  }
};

module.exports = webpackBaseConfig;

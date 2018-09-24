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
      template:'index.html',
      favicon:path.resolve(__dirname,'../favicon.ico')
    }),
  ],
  resolve:{
    alias: {
      app: path.resolve(__dirname, '../src/'),
      // 快捷用法：api、image、style
      api: path.resolve(__dirname, '../src/common/resource/api/'),
      component: path.resolve(__dirname, '../src/common/component/'),
      filter: path.resolve(__dirname, '../src/common/filter/'),
      config: path.resolve(__dirname, '../src/common/config/'),
      image: path.resolve(__dirname, '../src/assets/image/'),
      style: path.resolve(__dirname, '../src/assets/style/'),
    },
    extensions: ['.js', '.vue', '.json']
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

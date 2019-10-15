const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
global.CURRENT_VERSION = new Date().getTime();
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
    // 定义别名，方便在vue组件中引用
    alias: {
      app: path.resolve(__dirname, '../src/'),
      api: path.resolve(__dirname, '../src/api/'),
      component: path.resolve(__dirname, '../src/common/component/'),
      filter: path.resolve(__dirname, '../src/common/filter/'),
      config: path.resolve(__dirname, '../src/config/'),
      image: path.resolve(__dirname, '../src/assets/image/'),
      style: path.resolve(__dirname, '../src/assets/style/'),
    },
      // 形如下列扩展名文件的引用，可以省略扩展名
    extensions: ['.js', '.vue', '.json']
  },
  module:{
    rules:[
      // es6语法编译;node_modules目录下的文件除外
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
            // byte 限制,超过该值则打包为文件,否则保存为base64,直接渲染在html中,减少了http请求;大的文件单独保存,方便缓存到浏览器
              limit: 10000,
              name: `[name].[ext]`,
              // 指定文件输出位置
              outputPath:`lib${CURRENT_VERSION}/image`,
              // 指定打包后文件的访问路径;
              // 此处的写法是从根路径开始找,请根据项目具体情况,进行修改production时的访问路径;development时不需修改
              publicPath:process.env.NODE_ENV=='production'?`/{{name}}/lib${CURRENT_VERSION}/image/`:`/lib${CURRENT_VERSION}/image/`
          }
        }
      },
      // 字体处理,与图片处理方法一致
      {
        test:/\.(woff2?|eot|ttf|svg|otf)$/,
        use:{
          loader:'url-loader',
          options:{
              limit: 10000,
              name: `[name].[ext]`,
              outputPath:`lib${CURRENT_VERSION}/font`,
              publicPath:process.env.NODE_ENV=='production'?`/{{name}}/lib${CURRENT_VERSION}/font/`:`/lib${CURRENT_VERSION}/font/`
          }
        }
      }
    ]
  }
};
module.exports = webpackBaseConfig;

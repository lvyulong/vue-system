# vue-system


### 一、初始化配置
#### 1、build/base
##### (1).resolve.alias
将经常用到的模块加入到该配置中，便于在写业务时引用。<br>
根据项目需要可自行配置，如： 
```javascript
api: path.resolve(__dirname, '../src/common/resource/api/')
```
##### (2).module.rules
图片与字体处理，如果是生产环境（production）时，请根据生产环境的访问根目录自行调整。<br>
如，生产环境为`http://xxxx.xxx.xx.com/admin/index.html`,则需要配置成/admin/lib${CURRENT_VERSION}/image(font)/}。
```javascript
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
              publicPath:process.env.NODE_ENV=='production'?`/admin/lib${CURRENT_VERSION}/image/`:`/lib${CURRENT_VERSION}/image/`
          }
        }
      },
      
```
```javascript
    // 字体处理,与图片处理方法一致
      {
        test:/\.(woff2?|eot|ttf|svg|otf)$/,
        use:{
          loader:'url-loader',
          options:{
              limit: 10000,
              name: `[name].[ext]`,
              outputPath:`lib${CURRENT_VERSION}/font`,
              publicPath:process.env.NODE_ENV=='production'?`/admin/lib${CURRENT_VERSION}/font/`:`/lib${CURRENT_VERSION}/font/`
          }
        }
      }
```
#### 2、build/dev
##### (1).devServer.contentBase
指定dev server(本地开发服务器)从哪个目录中拿取文件，可指定多个（数组的形式）。
从指定的目录中拿取文件就像从根目录中拿一样。<br>
根据项目需要可自行配置,如：
```javascript
    //如需要引用static/template/xxx.xls这个文件，在代码中就可以这样引用：/template/xxx.xls
    //请注意，在发布到线上时，需要将static目录下的所有文件放到域名指定的根目录下
   contentBase: [path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../static')]
```
##### (2).devServer.proxy
指定服务器代理接口地址。<br>
根据后端提供的接口地址，自行修改target的值，如：
```javascript
  proxy: {
    "/api":{
        target: "http://localhost:3000",
        changeOrigin: true
    }
  }
```

#### 3、build/prod
##### (1).output
指定上线前打包的代码输出目录。<br>
根据项目需要修改path值,如：
```javascript
path: path.resolve(__dirname, '../server/static')
```
##### (2).plugins
CleanWebpackPlugin插件，每次打包时，先清空输出的目录。<br>
根据项目需要修改，清空的目录路径要与output.path值保持一致,如：
```javascript
  new CleanWebpackPlugin(['static'], {
         root: path.resolve(__dirname, '../server/')
     })
```

#### 4、package.json
修改json文件中的必要属性，如：name、description、author、keywords。

#### 5、favicon.ico
根据项目需要自行更换。

#### 6、项目logo
自行更换项目logo：<br>
    image/logo1.png<br>
    image/logo2.png

#### 7、字体文件
可以根据项目需要自行添加用到的字体文件到src/assets/font目录下。
另外，需要在src/style/font.less中添加引入字体,如：
```css
   @font-face {
        font-family: 'SummaryNum';
        src: url('../font/summarynumfont.eot');
        src: url('../font/summarynumfont.woff') format('woff'), url('../font/summarynumfont.ttf') format('truetype'), url('../font/summarynumfont.svg') format('svg');
        font-weight: normal;
        font-style: normal;
    }
```

#### 8、main.js
##### (1).window.global_data配置
将开发机器的ip地址写到devIp变量中，devIp变量的作用是判断当前的代码运行环境是否为dev环境，从而可以在不同的环境下执行不同的业务逻辑。

```javascript
    window.global_data = {
        //除非需要写死域名的地方才会用到，否则需用location.origin动态获取
        domain:{
            dev:'',
            prod:'',
        },
        // 开发环境本机的ip
        devIp: ''
    };
```
#### 9、config/sys.js
##### (1).sysApiBase配置
配置后端接口的基础访问路径，如/api/；该配置会在common/resource/base.js中用到。
```javascript
  sysApiBase:'/api/',
```
#### 10、开启i18n（中英文语言切换）
根据自己的业务需求，可以选择是否开启该功能。开启流程如下：<br>

1、main.js

```javascript
import i18n from './i18n/i18n';

const vm = new Vue({
    render: (h) => {
        return h(main)
    },
    // i18n,
    router,
    store
});

 localStorage.setItem('lang', 'en');
```
2、src/i18n

i18n的配置文件在src/i18n目录下，elementUI框架的语言切换配置已经整合进去了，我们只需要把自己业务里面需要的加进去即可。

```javascript
//langs/cn.js
const cn = {
     login: {
         btn: '登录'
     },
    ...enLocale
};

//langs/en.js
const en = {
     login: {
         btn: 'Login'
     },
    ...enLocale
};
```


### 二、开发指南
#### 1、下载依赖
<pre>npm install</pre>

#### 2、开启本地服务器
<pre>npm start</pre>

#### 3、浏览器调试
打开浏览器，在地址栏输入：http://localhost:8081或者http://本机IP:8081。

#### 注意
在书写业务代码时，经常需要引入其他文件，比如img标签的src属性，a标签作为下载功能使用时的href属性。
此时，尽量不要使用“/xxx/xx”这样的根路径方式来访问资源，
因为在项目发布的时候,项目代码可能不是放在服务器域名指定的根目录下，此时可能会有问题。<br>
如果不得不使用根目录方式访问资源，请确保该资源一定要放在根目录下。
首先，开发环境需要在devServer中配置contentBase,指定本地服务器应该从哪里获取资源；其次，发布上线时，要把相应的资源放置到域名所对应的根目录下，以防止发布上线后访问不到该资源。

### 三、发布指南
#### 1、项目打包
<pre>npm run build</pre>

#### 2、代码拷贝到服务器
将打包后的所有文件全部放到服务器上。<br>
打包文件的位置可以查看build/prod.js配置文件中的output配置。

#### 3、静态资源拷贝到服务器根目录
如果代码中有业务逻辑访问了根目录下的资源(如：“/xxx/xx.xls”)，则需要将该资源悉数拷贝到服务器根目录下。<br>
这些资源的位置，可以在build/dev.js文件的devServer.contentBase中查看配置。

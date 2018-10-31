# vue-system


### 一、初始化配置
#### 1、build/base
##### (1).resolve.alias
将经常用到的模块加入到该配置中，便于在写业务时引用。<br>
根据项目需要可自行配置，如： 
```javascript
api: path.resolve(__dirname, '../src/common/resource/api/')
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
path: path.resolve(__dirname, '../../../web/admin')
```
##### (2).plugins
CleanWebpackPlugin插件，每次打包时，先清空输出的目录。<br>
根据项目需要修改，清空的目录路径要与output.path值保持一致,如：
```javascript
  new CleanWebpackPlugin(['admin'], {
         root: path.resolve(__dirname, '../../../web')
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
src/assets/font目录下summarynumfont字体只是为了做演示，真正写项目时要删除掉。<br>
可以根据项目需要自行添加用到的字体文件。
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
devIp变量的作用是判断当前的代码运行环境是否为dev环境，从而可以在不同的环境下执行不同的业务逻辑。
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

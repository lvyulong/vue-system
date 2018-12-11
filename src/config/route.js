// state:父子节点用“.”分割。
// type：blank表示该路由只是一个容器；如果不设置该属性，则指向一个确定的vue组件，路径由state决定。
// params：/:id
// useComponent：值为state格式；也就是使用指定的state的组件，如果指定的组件也有useComponent属性，则递归往下找。
// defaultLink：如果该路由有children，才可以设置defaultLink属性；表示该路由的下一级子路由path:''时，跳转到的路由。
// redirect：重定向到指定的路由；这个属性未进行封装，使用的方法跟vue-router提供的使用方法一致，一般常用{name:''}
// alias：别名；这个属性未进行封装，使用的方法跟vue-router提供的使用方法一致，alias的值为path格式
// props: 路由传参数，这个属性未进行封装，使用的方法跟vue-router提供的使用方法一致；
// props ：设置为true，route.params 将会被设置为组件属性；如果 props 是一个对象，它会被按原样设置为组件属性。
// meta:元信息，未封装
// beforeEnter 此处只能做一些认证之类的操作，但是无法往组件里面传数据；推荐在组件内使用beforeRouterEnter操作，next可以有回调;
import handle from 'config/handle';
const config = {
    default: 'app.user.index',
    routes: [
        // 登陆
        {state: 'login'},

        // 应用主体
        {state: 'app', defaultLink: 'app.user.index'},

        // 我的账户
        {state: 'app.user', type: 'blank', defaultLink: 'app.user.index'},
        {state: 'app.user.index'},
        {state: 'app.user.new'},
        {state: 'app.user.edit', params: '/:id'},

        // demo1
        {state: 'app.demo1', type: 'blank'},
        // demo1.1
        {state: 'app.demo1.demo11', type: 'blank'},
        {state: 'app.demo1.demo11.index'},
        {state: 'app.demo1.demo11.new'},
        {state: 'app.demo1.demo11.edit', params: '/:id'},
        // demo1.2
        {state: 'app.demo1.demo12', type: 'blank'},
        {state: 'app.demo1.demo12.index'},

    ]
};
export default config;
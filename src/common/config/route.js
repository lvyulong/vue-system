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

import handle from 'app/common/config/handle';

export default {
  default: 'appUserIndex',
  routes: [
    // 登陆
    { state: 'login' },

    // 应用主体
    { state: 'app' },
    // 我的账户
    { state: 'app.user', type: 'blank' },
    { state: 'app.user.index' },
    // 我的计划
    { state: 'app.plan', type: 'blank' },
    // 前端
    { state: 'app.plan.forward', type: 'blank' },
    { state: 'app.plan.forward.index' },
    // 后端
    { state: 'app.plan.backward', type: 'blank' },
    { state: 'app.plan.backward.index' },
    // 运动
    { state: 'app.plan.sport', type: 'blank' },
    { state: 'app.plan.sport.index' },
    // 休息
    { state: 'app.plan.rest', type: 'blank' },
    { state: 'app.plan.rest.index' }
  ]
};

// 全局可调用的数据
window.global_data = {

};

import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/less/font-awesome.less';
import 'app/assets/style/main.less';

import App from 'app/App.vue';
import routes from 'app/routes';
import 'app/common/config/global';
// import store from 'app/common/config/store';


// 使用插件
Vue.use(Router);
Vue.use(ElementUI);


// 路由
const router = new Router({routes});
// 挂载dom
const root = document.createElement('div');
document.body.appendChild(root);
const vm = new Vue({
  render:(h)=>{
    return h(App)
  },
  router,
  // store
});
vm.$mount(root);

// 将vue实例绑定到全局，方便使用其属性
window.vm = vm;

export default vm;

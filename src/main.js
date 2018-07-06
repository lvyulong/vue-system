
import 'app/assets/style/main.less';

import Vue from 'vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from 'app/App.vue';
import routes from 'app/routes';
import 'app/common/config/global';


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
  router
});
vm.$mount(root);

// 将vue实例绑定到全局，方便使用其属性
window.vm = vm;

export default vm;


import './assets/style/common.less';
import './assets/style/main.less';

import Vue from 'vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import routes from './routes';

Vue.use(Router);
Vue.use(ElementUI);

const router = new Router({routes});
const root = document.createElement('div');
document.body.appendChild(root);
const vm = new Vue({
  render:(createElement)=>{
    return createElement(App)
  },
  router
});

vm.$mount(root);
// 将vue实例绑定到全局，方便使用其属性
window.vm = vm;
export default vm;

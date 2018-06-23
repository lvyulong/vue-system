
import './assets/style/common.less';
import './assets/style/main.less';

import Vue from 'vue';

import Router from 'vue-router';

import App from './App.vue';
import routes from './routes';

// const router = new Router()

Vue.use(Router);
const router = new Router({routes});
const root = document.createElement('div');
document.body.appendChild(root);
const vm = new Vue({
  render:(createElement)=>{
    return createElement(App)
  },
  router
})
vm.$mount(root);

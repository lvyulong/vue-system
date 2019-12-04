// (第三方)库
import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import underscore from 'underscore';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/less/font-awesome.less';
import 'lv-common-css/dist/style/pc.css';
import 'app/assets/style/main.less';
import routesDesign from 'vue-routes-design';
import axios from 'axios';
import vueAxiosResource from 'vue-axios-resource';
// import i18n from './i18n/i18n';

// 自定义文件
import main from 'app/main.vue';
import routeConfig from 'config/route';
import storeConfig from 'app/common/store/index';
import myTool from 'app/common/myTool/index';
import 'config/global';
import sys from 'config/sys';
import interceptor from 'config/interceptor'
import lvlPlugin from 'app/common/plugin/lvlPlugin';

window.global_data = {
    //除非需要写死域名的地方才会用到，否则需用location.origin动态获取
    domain: {
        dev: 'http://{{domain}}',
        prod: '{{prod}}',
    },
    // 开发环境本机的ip
    devIp: '{{ip}}',
    routeState:{},
};
if (location.hostname === 'localhost' || location.hostname === global_data.devIp) {
    global_data.isDev = 1;
}
window.myTool = myTool;
window._ = underscore;

// 使用插件
Vue.use(lvlPlugin);
Vue.use(Router);
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(vueAxiosResource,{
    handler:axios,
    baseUrl:sys.sysApiBase,
    interceptor:interceptor
});
// vuex状态
const store = new Vuex.Store(storeConfig);

// 路由
var routes = routesDesign.create(routeConfig);
const router = new Router({routes});
router.afterEach((to, from) => {
    if(from && from.name){
        window.global_data.routeState[from.name] = {
            query:from.query,
            params:from.params
        }
    }
});
// 挂载dom
const root = document.createElement('div');
document.body.appendChild(root);
const vm = new Vue({
    render: (h) => {
        return h(main)
    },
    // i18n,
    router,
    store
});

// // 英文版
// localStorage.setItem('lang', 'en');
window.global_data.lang_type = 'cn';

axios.get('/static/scripts/errorEnumData.json').then(function (res) {
    // 获取到errorEnumData.json之后才渲染vue组件
    window.global_data.errorEnumData = res.data.data;
    vm.$mount(root);
});
// 将vue实例绑定到全局，方便使用其属性
window.vm = vm;
export default vm;

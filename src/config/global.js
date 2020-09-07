import register from 'app/common/register';
// 组件
const config = {
    component: [],
    directive: [],
    filter: []
};
// 加载common/component/global下的所有文件，注册为全局的组件
const components = require.context('../common/component/global',false,/\.vue/);
components.keys().forEach(key => {
    let component = components(key).default;
    let reg = /\.\/(\S+)\.vue/;
    let name = reg.exec(key)[1];
    config.component.push({
        name:name,
        component:component
    })
});

// 加载common/filter/下的所有文件，注册为全局的filter
const filters = require.context('../common/filter',false,/\.js/);
filters.keys().forEach(key => {
    if(key !== './index.js'){
        let filter = filters(key).default;
        let reg = /\.\/(\S+)\.js/;
        let name = reg.exec(key)[1];
        config.filter.push({
            name:name,
            filter:filter
        })
    }
});
register(config);
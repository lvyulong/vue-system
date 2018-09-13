import {_} from 'underscore';
import config from './common/config/route';

const blank = {
    render: (h) => {
        return h('div', [
            h('router-view')
        ])
    }
};

var routes = _.filter(config.routes, function (item) {
    return item.state.indexOf('.') === -1;
})

// 构造path
function stateToPath(route) {
    if (!route) {
        return;
    }
    var state = route.state.split('.');
    var path;
    // 根路由带"/"
    if (state.length === 1) {
        path = `/${state[0]}`;
    } else if (state.length > 1) {
        // 子路由就是最后一个节点
        path = state[state.length - 1];
    }
    // 如果有params，拼上params
    if (route.params) {
        path += route.params;
    }
    return path;
}

// 构造component，blank或者指向一个vue文件
function stateToComponent(route) {
    if (!route) {
        return;
    }

    if (route.type && route.type === 'blank') {
        return blank;
    } else {
        let stateArray = route.state.split('.');
        let path = '';
        stateArray.map((v, k) => {
            path += `/${v}`;
        })
        return () => import(`./views${path}.vue`)
    }
}

// 构造组件的name,驼峰命名
function stateToName(route) {
    if (!route) {
        return;
    }
    var state = route.state.split('.');
    if (state && state.length > 0) {
        let name = '';
        state.map((v, k) => {
            if (k === 0) {
                name += v;
            } else {
                name += v.replace(/^[a-z]/, v[0].toUpperCase());
            }
        });
        return name;
    }
}

// 找到使用的组件
function findUseComponentRoute(route) {
    if (route.useComponent) {
        let useRoute = _.findWhere(config.routes, {state: route.useComponent});
        return findUseComponentRoute(useRoute);
    } else {
        return route;
    }
}

// 构造路由数组
function createRoute(routes) {
    routes.map(function (v, k) {
        var current = v.state;
        // path
        v.path = stateToPath(v);
        // 重定向路由没有component
        // component
        if (!v.redirect) {
            if (v.useComponent) {
                // 如果设置了useComponent，则使用设置的组件
                v.component = stateToComponent(findUseComponentRoute(v));
            } else {
                v.component = stateToComponent(v);
            }
        }

        // path为空字符串的路由，没有name；并且空字符串的路由一定有redirect属性，所以也没有component
        if (!v.emptyPath) {
            // name
            v.name = stateToName(v);
        }
        // 子路由
        var children = _.filter(config.routes, function (item) {
            var stateArray = item.state.split('.');
            var childStr = stateArray.slice(0,stateArray.length-1).join('.');
            return childStr === current;
        });
        if (children && children.length > 0) {
            // 如果有子路由，并且设置了defaultLink属性，则添加path：''时的重定向路由
            if (v.defaultLink) {
                children.push({
                    state: `${v.state}.`,
                    emptyPath: 1,
                    redirect: {
                        name: stateToName({state: v.defaultLink})
                    }
                })
            }
            v.children = children;
            createRoute(children);
        }
    })
}
createRoute(routes);

// 根节点的默认路由
if (config.default) {
    routes.unshift({
        path: '',
        redirect: {
            name: stateToName({state: config.default})
        }
    })
}
export default routes;

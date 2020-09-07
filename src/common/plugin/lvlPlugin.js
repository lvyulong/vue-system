const LvlPlugin = {};
LvlPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    // 2. 添加全局资源：指令、组件
    // Vue.component('back',Back);

    // 3. 混入组件
    Vue.mixin({
        methods: {
            // 从列表数据中找到目标值并返回
            findCol(row, colItem) {
                let output = '';
                if (colItem.isArray) {
                    if (colItem.hasOwnProperty('subKey')) {
                        // 如果指定subKey,则认为数组中是对象，通过subKey找到对应的项
                        _.each(row[colItem.key], function (item, index) {
                            let itemVal = item[colItem.subKey];
                            output += `${itemVal}`;
                            if (index < (row[colItem.key].length - 1)) {
                                output += ' | '
                            }
                        });
                    } else {
                        // 如果没有指定subKey,则认为数组中是简单数据类型，展示直接
                        _.each(row[colItem.key], function (item, index) {
                            output += `${item}`;
                            if (index < (row[colItem.key].length - 1)) {
                                output += ' | '
                            }
                        });
                    }
                } else if (colItem.hasOwnProperty('map')) {
                    if (!Array.isArray(colItem.map)) {
                        throw new TypeError("map is not array");
                    }
                    let map = colItem.map;
                    let key = myTool.getProp(row, colItem.key);
                    let target = _.findWhere(colItem.map[0], {[map[1]]: key}) || {};
                    output = `<span class="${target.color}">${(target && target[map[2]]) || '-'}</span>`;
                } else {
                    output = myTool.getProp(row, colItem.key);
                    output = output === 0 ? 0 : (output || '-');
                }
                return output;
            },
            setOption(list, key, targetKey, option) {
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    if (item[key] == targetKey) {
                        this.$set(list[i], 'option', option);
                        break;
                    }
                }
            },
            setMap(list, key, targetKey, option) {
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    if (item[key] == targetKey) {
                        this.$set(list[i], 'map', option);
                        break;
                    }
                }
            }

        }
    });
    // 4. 添加实例方法：每个Vue实例上都能使用
    Vue.prototype.checkPms = function (pms, list) {
        var isPass = false;
        for (var i = 0; i < pms.length; i++) {
            if (list[pms[i]]) {
                isPass = true;
                break;
            }
        }
        return isPass;
    };
    // 读取所有的api，挂载到原型上
    const apiFiles = require.context('../../api',false,/\.js/);
    const apis = myTool.handleModules(apiFiles);
    _.each(apis,(apiVal,apiKey) => {
        Vue.prototype[apiKey] = apiVal;
    });
};

export default LvlPlugin;
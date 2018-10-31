import rule from './formRules';

// 删除数组中指定id的项
function deleteById(array, id) {
    if (!array) {
        return;
    };
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            array.splice(i, 1);
            break;
        }
    }
}

// 判断是否为object
function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

// 修剪object，指定需要的属性名
function trimObj(obj, keys) {
    var newObj = {};
    for (var i = 0; i < keys.length; i++) {
        if (obj.hasOwnProperty(keys[i])) {
            if (isObject(obj[keys[i]])) {
                newObj[keys[i]] = extend({}, obj[keys[i]])
            } else {
                newObj[keys[i]] = obj[keys[i]];
            }
        }
    }
    return newObj
}

// 删除指定的属性
function deleteProps(obj, keys) {
    var newObj = Object.assign({}, obj);
    for (var i = 0; i < keys.length; i++) {
        if (newObj.hasOwnProperty(keys[i])) {
            delete newObj[keys[i]];
        }
    }
    return newObj;
}

// 从url中获取search，如果传了key只返回key属性，否则返回整个search对象
function getSearch(url, key) {
    if (url.indexOf('?') > 0) {
        // 截取出第一个问号后面的字符串
        var search = url.slice(url.indexOf('?'));
        search = search.slice(1);
        // 去掉hash
        if (search.indexOf('#') > 0) {
            search = search.slice(0, search.indexOf('#'));
        }
        // 转成数组
        var searchArray = search.split('&');
        var searchObj = {};
        searchArray.forEach(function (v, k) {
            var v_split = v.split('=');
            searchObj[v_split[0]] = v_split[1];
        });
        if (key) {
            if (searchObj.hasOwnProperty(key)) {
                return searchObj[key]
            } else {
                return undefined;
            }
        } else {
            // 没有指定第一个参数，则返回search对象
            return searchObj;
        }

    } else {
        // 没有“？”则返回undefined；
        return undefined;
    }
}

// 获取对象中的某个属性值，一层一层往下找，
// 中间只要有属性找不到，则不再继续找，返回undefined；
// 找到该属性，则返回属性值
function getProp(obj, str) {
    var result = extend({}, obj);
    var array = str.split('.');
    for (var i = 0; i < array.length; i++) {
        if (result[array[i]]) {
            result = result[array[i]];
        } else {
            result = result[array[i]];
            break;
        }
    }
    return result;
}

//扩展、合并、复制对象
function extend(obj1, obj2) {
    for (var k in obj2) {
        if (obj1.hasOwnProperty(k)) {
            if (isObject(obj2[k])) {
                extend(obj1[k], obj2[k])
            } else {
                obj1[k] = obj2[k]
            }
        } else {
            obj1[k] = obj2[k]
        }
    }
    return obj1;
}

//清除对象中的无效字段（空字符串，空数组，空对象）
function clearInvalidProp(obj) {
    for (var key in obj) {
        var item = obj[key];
        if ((JSON.stringify(item) === '{}') || (JSON.stringify(item) === '[]') || (!item)) {
            delete obj[key]
        }
    }
    return obj;
}

//将对象转化成url的查询字符串
function toUrlString(obj) {
    var str = '';
    for (var key in obj) {
        str += key + '=' + obj[key] + '&';
    }
    str = str.substr(0, str.length - 1);
    return str;
}


export default {
    // 删除数组中指定id的项
    deleteById,
    //修剪object，挑选其中指定的属性，返回一个新对象
    trimObj,
    //判断是否为对象
    isObject,
    //url：url链接；key：从url中的search中找key的值，如果没有传key，以json格式返回所有search
    getSearch,
    //找对象下面的属性值，逐层寻找
    getProp,
    //将对象转化成url的查询字符串
    toUrlString,
    //清除对象中的无效字段（空字符串，空数组，空对象）
    clearInvalidProp,
    //扩展、合并、复制对象
    extend,
    deleteProps,
    // form表单规则
    rule
}

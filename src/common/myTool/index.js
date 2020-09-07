import rule from './formRules';

// 删除数组中指定id的项
function deleteById(array, id) {
    if (!array) {
        return;
    }
    ;
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


function objIsSame(obj1,obj2) {
    let isSame = true;
    for(let key in obj1){
        if(!obj2.hasOwnProperty(key)){
            isSame = false;
            break;
        }else if(isObject(obj1[key])){
            // 如果该属性是对象
            isSame = objIsSame(obj1[key],obj2[key]);
            if(!isSame){
                break;
            }
        }else if(Array.isArray(obj1[key])){
            // 如果该属性是数组
            let arr1 = JSON.stringify(obj1[key]);
            let arr2 = JSON.stringify(obj2[key]);
            if(arr1!==arr2){
                isSame = false;
                break;
            }
        }else if(obj1[key]!==obj2[key]){
            isSame = false;
            break;
        }
    }
    if(!isSame){
        return false;
    }
    for(let key in obj2){
        if(!obj1.hasOwnProperty(key)){
            isSame = false;
            break;
        }else if(isObject(obj2[key])){
            // 如果该属性是对象
            isSame = objIsSame(obj2[key],obj1[key]);
            if(!isSame){
                break;
            }
        }else if(Array.isArray(obj2[key])){
            // 如果该属性是数组
            let arr1 = JSON.stringify(obj1[key]);
            let arr2 = JSON.stringify(obj2[key]);
            if(arr1!==arr2){
                isSame = false;
                break;
            }
        }else if(obj1[key]!==obj2[key]){
            isSame = false;
            break;
        }
    }
    return isSame;
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

//清除对象中的无效字段（空字符串，空数组，空对象、undefined/null）
function clearInvalidProp(src) {
    let obj = JSON.parse(JSON.stringify(src));
    for (let key in obj) {
        let item = obj[key];
        if (JSON.stringify(item) === '{}' || JSON.stringify(item) === '[]' || item === '' || item === undefined || item === null) {
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

// 复制数组
function copyArray(array) {
    if (Array.isArray(array)) {
        return JSON.parse(JSON.stringify(array));
    }
}

// 深复制对象
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 从原数组中提取指定的字段，并可重命名字段名，组成一个新的精简数组
function trimArray(list, aliasObj) {
    var newList = [];
    if (Array.isArray(list) && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var newItem = {};
            for (var aliasKey in aliasObj) {
                var aliasVal = aliasObj[aliasKey];
                if (item.hasOwnProperty(aliasKey)) {
                    newItem[aliasVal] = item[aliasKey]
                }
            }
            newList.push(newItem)
        }
    }
    return newList;
}

function setProp(origin, str, value) {
    if (!isObject(origin)) {
        throw new TypeError("The first param is not a object");
    }
    let keys = str.split('.');
    let curKey = keys[0];
    let newStr = keys.slice(1).join('.');
    if (keys.length > 0) {
        if (keys.length == 1) {
            // 到达终点，设置值，结束
            origin[curKey] = value;
        } else if (!origin.hasOwnProperty(curKey) || !isObject(origin[curKey])) {
            // 还没到达终点，并且该层没有这个属性或者该属性不是一个对象，则设置该属性为空对象
            origin[curKey] = {};
            setProp(origin[curKey], newStr, value);
        } else {
            // 还没到达终点，但是该层有这个属性，则继续往下层找
            setProp(origin[curKey], newStr, value);
        }
    }
}

function handleModules(files) {
    // 处理webpack的requre.context方法返回的files，返回一个对象，key是module名
    let modules = {};
    files.keys().forEach(key => {
        let module = files(key).default;
        let reg = /[\.\/]/;
        let names = key.split(reg);
        modules[names[names.length - 2]] = module;
    });
    return modules;
}

function getItems(list, key, targets) {
    let result = [];
    list.forEach(item => {
        if (targets.indexOf(item[key]) >= 0) {
            let newItem = JSON.parse(JSON.stringify(item));
            result.push(newItem);
        }
    });
    return result;
}

function setItemId(list) {
    // 该方法改变的是原数组，不会返回新数组
    if (!Array.isArray(list)) {
        throw new Error("list 必须是一个数组");
    }
    if(list.length > 0){
        list.forEach((item, index) => {
            if (!isObject(item)) {
                throw new Error("item 必须是一个对象");
            }
            // 如果没有id属性时，将索引作为ID
            if(!item.hasOwnProperty('id')){
                item.id = index + 1;
            }
        })
    }
}


// 最大化合并JSON
// function merge(obj1,obj2) {
//
//     if(!isObject(obj1) || !isObject(obj2)){
//         throw new Error("两个参数都必须是对象");
//     }
//     let outPut = JSON.parse(JSON.stringify(obj1));
//     let target = JSON.parse(JSON.stringify(obj2));
//
//     for(let key2 in target){
//         // 如果obj1中没有obj2中的属性，则添加该属性
//         if(!obj1.hasOwnProperty(key2)){
//             obj
//         }
//     }
//
//     mergeObj(outPut,target);
//
//
//
//     function isObject(obj) {
//         return Object.prototype.toString.call(obj) == '[object Object]';
//     }
//     function mergeObj(src,target) {
//
//         for(let key2 in target){
//             // 如果obj1中没有obj2中的属性，则添加该属性
//             if(!obj1.hasOwnProperty(key2)){
//                 obj
//             }
//         }
//
//     }
//     return outPut
// }


export default {
    // 两个对象是否一样
    objIsSame,
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
    setProp,
    //将对象转化成url的查询字符串
    toUrlString,
    //清除对象中的无效字段（空字符串，空数组，空对象）
    clearInvalidProp,
    //扩展、合并、复制对象
    extend,
    deleteProps,
    // form表单规则
    rule,
    // 复制一个数组
    copyArray,
    copy,
    trimArray,
    handleModules,
    getItems,
    setItemId
}


import axios from 'axios';
import interceptor from './interceptor';
import sys from 'config/sys';

// http拦截器
axios.interceptors.request.use(interceptor.request.success,interceptor.request.error);
axios.interceptors.response.use(interceptor.response.success,interceptor.response.error);

/*
usage:
Resource类中所有的方法，都只接受一个option对象；
option对象中的可配置项：body、params、headers等
*/

//使用symbol的唯一性，模拟class的静态方法，在其他文件中的实例无法调用
const url = Symbol('url');
const baseOption = Symbol('baseOption');

export default class Resource {
    config;
    // url的公共部分
    [url] = sys.sysApiBase;
    // 基础配置，公用
    [baseOption] = {

    };
    constructor(config) {
        this.config = config;
        // 如果有actions，生成这些额外的方法，
        //这些方法是实例的方法，并不是公有方法（原型链上的方法,也就是说每个实例的这些方法可能都不一样）
        if (config.actions && config.actions.length > 0) {
            var that = this;
            config.actions.map(function (v, k) {
                // 如果有形如/:id的参数
                if(v.url.indexOf('/:')!=-1){
                    var names = v.url.split('/:');
                    var actionName = names[0];
                    var actionParam = names[1];
                    that[v.name] = function (option) {
                        if(!option.params){
                            option.params = {};                       
                        }
                        if(!option.params[actionParam]){
                            option.params[actionParam] = ''
                        }
                        var selfOption = {
                            url: that[url] + config.url + '/' + actionName + '/' + option.params[actionParam],
                            method: v.method
                        };
                        option = Object.assign({}, this[baseOption], selfOption, option);
                        return axios(option)
                    }                    
                } else {
                    that[v.name] = function (option) {
                        var selfOption = {
                            url: that[url] + config.url + '/' + v.url,
                            method: v.method
                        };
                        option = Object.assign({}, this[baseOption], selfOption, option);
                        return axios(option)
                    }
                }
                
            })
        }
    }
    // 公有方法：query、get、save、delete、update
    // index方法，注意传参顺序
    query(option) {
        var selfOption = {
            url: this[url] + this.config.url,
            method: 'GET'
        };
        option = Object.assign({}, this[baseOption], selfOption, option);
        return axios(option);
    }
    // view
    get(option) {
        var selfOption = {
            url: this[url] + this.config.url + '/' + option.params.id,
            method: 'GET'
        };
        option = Object.assign({}, this[baseOption], selfOption, option);
        return axios(option);
    }
    // create
    save(option) {
        var selfOption = {
            url: this[url] + this.config.url,
            method: 'POST'
        };
        option = Object.assign({}, this[baseOption], selfOption, option);
        return axios(option);
    }
    // update
    update(option) {
        var id = (option.params&&option.params.id) || (option.data&&option.data.id);
        var selfOption = {
            url: this[url] + this.config.url + '/' +  id,
            method: 'PUT'
        };
        option = Object.assign({}, this[baseOption], selfOption, option);
        return axios(option);
    }
    //delete
    delete(option) {
        var id = (option.params&&option.params.id) || (option.data&&option.data.id);
        var selfOption = {
            url: this[url] + this.config.url + '/' + id,
            method: 'DELETE'
        };
        option = Object.assign({}, this[baseOption], selfOption, option);
        return axios(option);
    }
}
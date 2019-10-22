/*
Progress实例有三个公共方法：
    run：实时取进度，实例初始化完成会自动调用
    cancel：取消后台任务(只支持single模式的实例，即key是字符串的情况)
    hide：转后台，前端不再实时取进度，但是后台仍在执行
*/
/*
Progress类的静态方法：
    cancel：取消后台任务(需要传一个key)
* */

import staticConfig from 'config/static';
import progressApi from 'api/progressApi';
var progressStatus = staticConfig['progressStatus'];

class Progress{
    constructor(config){
        this.runInBackground = false;
        if (config && config.key) {
            this.config = config;
            // 实例初始化完成就开始取进度
            if (Array.isArray(config.key) && config.key.length > 0) {
                // 多个
                this.runMuti();
            } else {
                // 单个
                this.run();
            }
        } else {
            console.error("缺少属性key")
        }
    };
    // 开始实时取进度(单个)
    run(){
        var _this = this;
        function getProgress(key) {
            // 转后台，前端不再实时获取进度了，后端任务还在跑
            if (_this.runInBackground) {
                return;
            }
            progressApi.getOne({
                params:{
                    key: key
                }
            }).then(function (res) {
                if (res.data.status == progressStatus['RUNING']) {
                    _this.config && _this.config.onProgress && _this.config.onProgress(res.data);
                    setTimeout(function () {
                        getProgress(key);
                    }, 2000)
                } else if (res.data.status == progressStatus['COMPLETE']) {
                    _this.config && _this.config.onProgress && _this.config.onProgress(res.data);
                    _this.config && _this.config.onComplete && _this.config.onComplete(res.data);
                } else if (res.data.status == progressStatus['FAIL']) {
                    _this.config && _this.config.onProgress && _this.config.onProgress(res.data);
                    _this.config && _this.config.onFail && _this.config.onFail(res.data);
                } else if (res.data.status == progressStatus['CANCEL']) {
                    _this.config && _this.config.onProgress && _this.config.onProgress(res.data);
                    _this.config && _this.config.onCancel && _this.config.onCancel(res.data);
                }
            })
        }
        getProgress(_this.config.key);
    };

    // 开始实时取进度(多个)
    runMuti() {
        var _this = this;
        // 完成的项
        var completeContainer = [];
        // 失败的项
        var failContainer = [];
        // 取消的项
        var cancelContainer = [];
        // 取不到进度的项
        var noProgressContainer = [];
        // 正在跑的项
        var runContainer = [];
        function getProgress(key) {
            // 转后台，前端不再实时获取进度了，后端任务还在跑
            if (_this.runInBackground) {
                return;
            }
            progressApi.getMulti({
                params:{
                    keys: key.join()
                }
            }).then(function (res) {
                // 完成的项
                var completeItems = _.where(res.data.items, {status: progressStatus['COMPLETE']});
                var completeKeys = _.pluck(completeItems,'key');
                completeContainer = completeContainer.concat(completeKeys);
                // 失败的项
                var failItems = _.where(res.data.items, {status: progressStatus['FAIL']});
                var failKeys = _.pluck(failItems,'key');
                failContainer = failContainer.concat(failKeys);
                // 取消的项
                var cancelItems = _.where(res.data.items, {status: progressStatus['CANCEL']});
                var cancelKeys = _.pluck(cancelItems,'key');
                cancelContainer = cancelContainer.concat(cancelKeys);
                // 取不到进度信息的项
                var noProgressItems = _.filter(res.data.items,function (item) {
                    return !item.hasOwnProperty('status');
                });
                var noProgressKeys = _.pluck(noProgressItems,'key');
                noProgressContainer = noProgressContainer.concat(noProgressKeys);
                // 正在跑的项
                var runningItems = _.where(res.data.items, {status: progressStatus['RUNING']});
                var runningKeys = _.pluck(runningItems,'key');

                // 判断正在跑的项是否减少了，如果减少说明有某些项的状态改变了
                var someItemsStatusChanged = false;
                var preRunItemsLength = runContainer.length;
                if(runningItems.length < preRunItemsLength){
                    someItemsStatusChanged = true;
                }
                runContainer = runningItems;
                if (runningItems.length > 0) {
                    // 还有正在跑的项
                    setTimeout(function () {
                        getProgress(runningKeys);
                    }, 2000)
                }else{
                    // 全部项都已经结束
                    _this.config && _this.config.onComplete && _this.config.onComplete({
                        complete:completeContainer,
                        fail:failContainer,
                        cancel:cancelContainer,
                        noProgress:noProgressContainer
                    });
                }
                // 进度
                _this.config && _this.config.onProgress && _this.config.onProgress({
                    run:runningItems,
                    complete:completeContainer,
                    fail:failContainer,
                    cancel:cancelContainer,
                    noProgress:noProgressContainer,
                    someItemsStatusChanged:someItemsStatusChanged
                });
            });
        }
        getProgress(_this.config.key);
    };

    // 取消后端任务（只支持single模式的实例，不需要传key）
    cancel() {
        var _this = this;
        // 原型上的cancel方法只支持single模式，即key是字符串类型的
        if(_this.config.key && typeof _this.config.key == 'string'){
            return new Promise(function (resolve,reject) {
                progressApi.cancel({
                    data:{
                        key: _this.config.key
                    }
                }).then(function (res) {
                    resolve(res.data);
                },function (err) {
                    reject(err.data);
                })
            });
        }else{
            console.error("single模式的实例才具有cancel方法，muti模式的实例请使用Progress类的静态方法")
        }
    };
    // 前端不再实时取进度，但是后端任务还在跑
    hide() {
        this.runInBackground = true;
    };
}
// 取消后端任务（需要传key）
Progress.cancel = function (key) {
    if(!key){
        console.error("key 必须传");
        return;
    }
    return new Promise(function (resolve,reject) {
        progressApi.cancel({
            data:{
                key: key
            }
        }).then(function (res) {
            resolve(res.data);
        },function (err) {
            reject(err.data);
        })
    });
};
export default Progress;

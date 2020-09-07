import COS from 'cos-js-sdk-v5/dist/cos-js-sdk-v5';
import resourceApi from 'api/resourceApi';

/**
 * config:{
 *     files[Array],
 *     type,
 *     onProgressChange[Call],
 *     onPreUploaded[Call],
 *     onSuccess,
 *     onFailed
 * }
 *
 * */

export default {
    send: function (config) {
        // 获取上传云存储必要的信息，默认使用resourcesApi里面的getCloudKeys方法
        // 用于存放文件上传进度的数组
        var filesProgress = [];
        var names = _.pluck(config.files, 'name');
        // 获取云存储的必要信息
        resourceApi.preUpload({
            data: {
                names: names,
                type: config.type
            }
        }).then(function (res) {
            var resData = res.data;
            var bucket = resData.bucket;
            var region = resData.region;
            var promises = [];
            // 循环所有需要上传的文件，将提交的结果（promise）放到promises数组中
            _.each(config.files, function (v, k) {
                filesProgress.push({
                    name: resData.items[k].name,
                    key: resData.items[k].key,
                    file: v.file,
                    bucket: bucket,
                    region: region,
                    progress: 0,
                    error: 0
                });
                var cos = new COS({
                    getAuthorization: function (options, callback) {
                        callback(resData.items[k].token);
                    }
                });
                var promise = new Promise(function (resolve, reject) {
                    // 提交到云存储
                    cos.putObject({
                        Bucket: bucket,
                        Region: region,
                        Key: resData.items[k].key,
                        Body: v.file,
                        onHashProgress: function (progressData) {
                            // console.log('校验中', JSON.stringify(progressData));
                        },
                        onProgress: function (progressData) {
                            filesProgress[k].progress = parseInt(progressData.percent * 100);
                            if (config && config.hasOwnProperty('onProgressChange')) {
                                config.onProgressChange(filesProgress);
                            }
                        },
                    }, function (err, data) {
                        if (err) {
                            reject(err);
                            filesProgress[k].error = 1;
                            if (config && config.hasOwnProperty('onProgressChange')) {
                                config.onProgressChange(filesProgress)
                            }
                        } else {
                            resolve(data);
                        }
                    });
                });
                promises.push(promise);
            });

            // 先触发一次
            config.onPreUploaded && config.onPreUploaded(filesProgress);

            // 所有的文件都提交完成
            Promise.all(promises).then(function (res) {
                if (config && config.hasOwnProperty('onSuccess')) {
                    config.onSuccess({
                        success: 1,
                        hasError: 0,
                        keys: _.pluck(resData.items, 'key'),
                        urls: _.pluck(resData.items, 'url'),
                        files_name: names
                    })
                }
            }, function (err) {
                if (config && config.hasOwnProperty('onFailed')) {
                    config.onFailed({
                        success: 0,
                        hasError: 1,
                        keys: _.pluck(resData.items, 'key')
                    })
                }
            });
        })
    }
}
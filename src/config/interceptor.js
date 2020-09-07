import handle from 'config/handle';

var loading;
export default {
    request: {
        success: function (config) {
            // post提交显示loading
            if (config.method != 'get') {
                if (!loading) {
                    loading = vm.$loading();
                }
            }
            // console.log(config)
            return config;
        },
        error: function (error) {
            // 请求错误，关闭loading
            // vm.$loading().close();
            // console.log(error.response);
            return Promise.reject(error);
        }
    },
    response: {
        success: function (response) {
            // 响应成功，关闭loading
            if (loading) {
                loading.close();
                loading = null;
            }
            // console.log(response)
            return response;
        },
        error: function (error) {
            // 响应错误也关闭loading
            if (loading) {
                loading.close();
                loading = null;
            }
            let errRes = error.response || {};
            if (errRes.status == 401) {
                vm.$router.push({name: 'login'})
            } else {
                if (errRes.data && errRes.data.message) {
                    vm.$message.error(errRes.data.message);
                } else {
                    vm.$message.error(`未知的错误 Unknown error`)
                }
            }
            return Promise.reject(error);
        }
    }
};

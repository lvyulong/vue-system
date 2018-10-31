const storeConfig = {
    state: {
        local: {},
    },
    getters: {},
    mutations: {
        setProp(state, data) {
            // data支持数组和对象两种类型参数
            if (Array.isArray(data)) {
                data.map(function (v, k) {
                    state[v.key] = v.val;

                })
            } else {
                state[data.key] = data.val;
            }

        }
    },
    actions: {}
};
export default storeConfig;
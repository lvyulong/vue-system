
const storeConfig = {
    state:{
        local:{}
    },
    getters:{

    },
    mutations:{
        setProp(state,data){
            state[data.key] = data.val;
        }
    },
    actions:{

    }
};
export default storeConfig;
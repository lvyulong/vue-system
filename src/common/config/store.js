import Vuex from 'vuex';
import Vue from "vue/types/index";
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        local:{}
    },
    mutations: {
        getCurrent(state,current){
            state.local = current;
        }
    }
});
export default store;
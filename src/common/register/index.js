import Vue from "vue";

const register = function (config) {
    for (let k in config) {
        config[k].map((val, key) => {
            Vue[k](val.name, val[k])
        })
    }
};
export default register;
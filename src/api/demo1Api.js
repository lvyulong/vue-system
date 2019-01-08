import Vue from 'vue';
const demo1Api = new Vue.Resource({
    url: 'demo1',
    actions: [
        {
            name:'simple',
            url:'simple',
            method:'GET'
        }
    ]
});

export default demo1Api;

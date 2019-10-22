import Vue from 'vue';
const userApi = new Vue.Resource({
    url: '/{{name}}/user',
    actions: [

    ]
});

export default userApi;

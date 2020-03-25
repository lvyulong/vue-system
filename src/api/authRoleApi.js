import Vue from 'vue';
export default new Vue.Resource({
    url: '/{{name}}/auth-role',
    actions: [
        {
            name:'simple',
            method:'GET',
            url:'simple'
        },
    ]
});

import Vue from 'vue';
const authRoleApi = new Vue.Resource({
    url: '/{{name}}/auth-role',
    actions: [
        {
            name:'simple',
            method:'GET',
            url:'simple'
        },
    ]
});
export default authRoleApi;

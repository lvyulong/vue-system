import Vue from 'vue';
const authApi = new Vue.Resource({
    url: '/admin/auth',
    actions: [
        {
            name:'current',
            method:'GET',
            url:'current'
        },
        {
            name:'pre',
            method:'GET',
            url:'pre'
        },
        {
            name:'login',
            method:'POST',
            url:'login'
        },
        {
            name:'logout',
            method:'POST',
            url:'logout'
        }
    ]
});
export default authApi;

import Vue from 'vue';
const authApi = new Vue.Resource({
    url: 'auth',
    actions: [
        {
            name:'current',
            method:'GET',
            url:'current'
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
        },
    ]
});
export default authApi;

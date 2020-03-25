import Vue from 'vue';
export default new Vue.Resource({
    url: '/{{name}}/auth',
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

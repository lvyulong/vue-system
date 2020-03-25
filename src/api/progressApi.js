import Vue from 'vue';
export default new Vue.Resource({
    url: '/common/progress',
    actions: [
        {
            name:'getOne',
            method:'GET',
            url:'get-one'
        },
        {
            name:'getMulti',
            method:'GET',
            url:'get-multi'
        },
        {
            name:'cancel',
            method:'POST',
            url:'cancel'
        }
    ]
});

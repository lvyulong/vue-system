import Vue from 'vue';
export default new Vue.Resource({
    url: '/{{name}}/user',
    actions: [
        {
            name:'simple',
            url:'simple',
            method:'GET',
        },
        {
            name:'getUsers',
            url:'get-users',
            method:'GET'
        },
        {
            name:'createBatch',
            url:'create-batch',
            method:'POST'
        },
        {
            name:'setResource',
            method:'POST',
            url:'set-resource'
        },
        {
            name:'getResource',
            method:'GET',
            url:'get-resource'
        },

    ]
});

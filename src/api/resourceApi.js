import Vue from 'vue';
export default new Vue.Resource({
    url: '/common/resource',
    actions: [
        {
            name:'preUpload',
            url:'pre-upload',
            method:'POST'
        }
    ]
});

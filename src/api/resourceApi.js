import Vue from 'vue';
const resourceApi = new Vue.Resource({
    url: '/common/resource',
    actions: [
        {
            name:'preUpload',
            url:'pre-upload',
            method:'POST'
        }
    ]
});
export default resourceApi;

import Vue from 'vue';
const fileApi = new Vue.Resource({
    url: '/admin/file',
    actions: [
        // 上传到腾讯云
        {
            name:'preUpload',
            method:'POST',
            url:'pre-upload'
        },
    ]
});
export default fileApi;

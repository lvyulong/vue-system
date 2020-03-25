import Vue from 'vue';
export default new Vue.Resource({
    url: '/{{name}}/file',
    actions: [
        // 上传到腾讯云
        {
            name:'preUpload',
            method:'POST',
            url:'pre-upload'
        },
    ]
});

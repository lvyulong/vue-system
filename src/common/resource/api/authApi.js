import Resource from 'app/common/resource/base';

const authApi = new Resource({
    url: 'auth',
    actions: [
        {
            name:'login',
            url:'login',
            method:'POST',
        },
        {
            name:'logout',
            url:'logout',
            method:'POST',
        },
    ]
});

export default authApi;

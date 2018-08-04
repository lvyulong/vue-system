import Resource from 'app/common/resource/base';

const fooApi = new Resource({
    url: 'foo',
    actions: [
        {
            name:'test',
            url:'test/:id',
            method:'get',
        },
        {
            name:'error',
            url:'err/:id',
            method:'post',
        },

    ]
});

export default fooApi;

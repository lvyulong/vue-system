import Resource from 'app/common/resource/base';

const fooApi = new Resource({
    url: 'foo',
    actions: [
        {
            name:'test',
            method:'get',
            url:'test/:id'
        },
        {
            name:'error',
            url:'err/:id',
            method:'post',
        },

    ]
});

export default fooApi;

import Resource from 'app/common/resource/base';

const foo = new Resource({
    name: 'foo',
    actions: [
        {name:'test/:id',method:'get'},
        {name:'err/:id',method:'post'},

    ]
});

export default foo;

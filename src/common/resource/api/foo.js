import Resource from '../base';

const foo = new Resource({
    name: 'foo',
    actions: [
        {name:'test/:id',method:'get'}
    ]
});
// console.log(foo);
export default foo;
import Resource from '../base';

const money = new Resource({
    name: 'foo',
    actions:[
        {name:'getAll',method:'GET'}
    ]
});
export default money;

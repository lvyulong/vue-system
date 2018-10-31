import Resource from 'app/common/resource/base';

//因为props表的id不能自增，php新开一个控制器重写了create方法，方便自增id
const clientPropsApi = new Resource({
    url: 'client-props',
    actions: [
        {
            name:'set',
            url:'set',
            method:'POST'
        },
        {
            name:'specialDelete',
            url:'special-delete',
            method:'POST'
        }
    ]
});

export default clientPropsApi;

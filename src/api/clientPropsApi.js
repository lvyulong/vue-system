import Resource from 'app/common/resource';

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

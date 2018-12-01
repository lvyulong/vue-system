import Resource from 'app/common/resource/base';

const demo1Api = new Resource({
    url: 'demo1',
    actions: [
        {
            name:'simple',
            url:'simple',
            method:'GET'
        }
    ]
});

export default demo1Api;

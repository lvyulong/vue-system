import Resource from 'app/common/resource/base';

const corpUserApi = new Resource({
    url: 'corp-user',
    actions: [
        {
            name:'contactSync',
            url:'contact-sync',
            method:'POST'
        }

    ]
});

export default corpUserApi;

var router = require('express').Router();

router.use(function (req, res, next) {
    console.log(`demo is using!`);
    next();
});

router.get('/', function (req, res, next) {
    res.send({
        items:[
            {id:1,name:'demo1',desc:'demo1的测试数据'}
        ],
        meta:{
            currentPage:1,
            perPage:20
        }
    })

});

router.get('/simple', function (req, res, next) {
    res.send({
        items:[
            {id:1,name:'类型1'},
            {id:2,name:'类型2'},
            {id:3,name:'类型3'},
        ]
    })

});


module.exports = router;

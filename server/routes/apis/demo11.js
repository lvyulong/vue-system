var router = require('express').Router();
var _ = require('underscore');

var array = [
    {
        id: 1,
        name: 'demo11',
        type:1,
        date:'2018-10-01',
        is_enable: 1,
        desc: '写死的测试数据，只是为了有东西显示，没有翻页信息，别当真，哈！'
    }
];

router.use(function (req, res, next) {
    console.log(`demo11 is using!`);
    next();
});

// index
router.get('/', function (req, res, next) {

    res.send({
        items: array,
        _meta: {
            currentPage: 1,
            perPage: 20,
            pageCount: 1,
            totalCount: 1
        }
    });
});

// view
router.get('/:id(\\d+)', function (req, res, next) {
    var id = req.params.id;
    var obj = _.findWhere(array,{id:Number(id)});
    res.send(obj);
});
// update
router.put('/:id(\\d+)', function (req, res, next) {
    var obj = Object.assign({},req.body);
    _.each(array,function (v,k) {
        if(v.id == req.params.id){
            v = _.extend(v,obj);
        }
    });
    var result = _.findWhere(array,{id:Number(req.params.id)});
    res.send(result);
});

// create
router.post('/', function (req, res, next) {
    var obj = Object.assign({},req.body);
    obj.id = array[array.length-1].id + 1;
    array.push(obj);
    res.send(obj);
});
module.exports = router;

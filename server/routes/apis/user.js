var router = require('express').Router();

router.use(function (req, res, next) {
    console.log(`foo is using!`);
    next();
});

router.get('/', function (req, res, next) {
    var data = {
        items: [
            {id: 1, name: '吕玉龙'}
        ],
        _meta: {
            totalCount:1,
            perPage:20,
            currentPage:1,
            pageCount:1

        }
    };
    res.send(data);
});


module.exports = router;

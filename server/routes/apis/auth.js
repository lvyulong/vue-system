var router = require('express').Router();

router.use(function (req, res, next) {
    next();
})

router.get('/current', function (req, res, next) {
    var data = {
        user: {
            name: '吕玉龙'
        }
    }
    res.send(data)
})

module.exports = router;
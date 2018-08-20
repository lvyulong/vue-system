var router = require('express').Router();

router.use(function (req, res, next) {
    next();
});

router.get('/current', function (req, res, next) {
    var data = {
        data:{
            user: {
                name: '吕玉龙'
            }
        }
    };
    res.send(data)
});
router.post('/login', function (req, res, next) {
    var data = {
        msg:'伪造的登录，成功！'
    };
    res.send(data)
});
router.post('/logout', function (req, res, next) {
    var data = {
        msg:'暂时没有做注销的操作'
    };
    res.send(data)
});
module.exports = router;
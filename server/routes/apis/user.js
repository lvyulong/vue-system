var router = require('express').Router();
var fs = require('fs');
router.use(function (req, res, next) {
    console.log(`foo is using!`);
    next();
});

router.get('/', function (req, res, next) {
    var date = new Date();
    // var avatar = fs.readFileSync('assets/image/avatar.jpg').toString('base64');
    var data = {
        items: [
            {
                id: 1,
                name: '吕玉龙',
                avatar: '../../assets/image/avatar.jpg',
                user_id: 'lvyl',
                en_name: 'Alone',
                gender: 1,
                phone: '110',
                email: 'lvy@testlv.com',
                position: '银河系主任',
                created_at: '公元前100万年',
                updated_at: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                login_count: '无限次',
            }
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

var router = require('express').Router();

router.use(function(req,res,next){
  console.log(`foo is using!`);
  next();
})

router.get('/',function(req,res,next){
  var data = {
    name: 'foo'
  }
  res.send(data);
})
router.get('/test/:id',function(req,res,next){
  var data = {
    name: 'test'
  }
  res.send(data);
  // res.status(501).send({msg:'服务器错误'})
})

router.post('/err/:id',function(req,res,next){
  console.log(req.body);

  // res.send(req.body);
  res.status(401).send({msg:'没有权限登录'})
})

module.exports = router;

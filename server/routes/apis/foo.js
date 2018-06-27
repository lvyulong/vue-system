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

module.exports = router;
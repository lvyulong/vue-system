var router = require('express').Router();

router.use(function(req,res,next){
  console.log(`bar is using!`);
  next();
})

router.get('/',function(req,res,next){
  var data = {
    name: 'bar'
  }
  res.send(data)
})

module.exports = router;
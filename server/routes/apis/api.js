var router = require('express').Router();

var apis = ['user','auth','demo'];


router.use(function(req,res,next){
  console.log(`Api is using!`);
  next();
});

for(var i=0;i<apis.length;i++){
  var path = `/${apis[i]}`;
  var route = require(`./${apis[i]}.js`);
  router.use(`/${apis[i]}`,route)
}

module.exports = router;
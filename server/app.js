
var http = require('http');

http.createServer(function(req,res){
    res.writeHead(200,{'Content-type':'application/json'});
    res.write('<div style="color:red">Node offer server！</div>');
    res.end();
}).listen(3000)
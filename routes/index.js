var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res){
  res.sendFile('index.html', {root:path.join(__dirname, '../public/myAppName')});
});

router.get('/cosejson', function(req,res){
  res.json({name:'Sima', cose:'a lot'});
});
module.exports = router;

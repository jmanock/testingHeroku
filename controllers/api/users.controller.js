var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('service/user.service');

router.post('/authenticate', authenticateUser);
router.post('/register'.registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res){
  userService.authenticate(req.body.username, req.body.password)
  .then(function(token){
    if(token){
      res.send({token:token});
    }else{
      res.sendStatus(401);
    }
  }).catch(function(err){
    res.status(400).send(err);
  });
}
function getCurrentUser(req, res){
  userService.getById(req.user.sub)
  .then(function(user){
    if(user){
      res.send(user);
    }else{
      res.sendstatus(404);
    }
  }).catch(function(err){
    res.status(400).send(err);
  });
}
function updateUser(req, res){
  var userId = req.user.sub;
  if(req.params._id !== userId){
    return res.status(401).send('You can only update your own account');
  }
  userService.update(userId, req.body)
  .then(function(){
    res.sendStatus(200);
  }).catch(function(err){
    res.status(400).send(err);
  });
}
function deleteUser(req, res){
  var userId = req.user.sub;
  if(req.params._id !== userId){
    return res.status(401).send('You can only delete your own account');
  }
  userService.delete(userId)
  .then(function(){
    res.sendStatus(200);
  }).catch(function(err){
    res.status(400).send(err);
  });
}

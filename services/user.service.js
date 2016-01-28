var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var userDb = db.get('users');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.authenticat = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password){
  var deferred = Q.defer();
  users.Db.findOne({username:username}, function(err, user){
    if(err)deferred.reject(err);
    if(user && bcrypt.compareSync(password, user.hash)){
      deferred.resolve(jwt.sign({sub:user._id}, config.secret));
    }else{
      deferred.resolve();
    }
  });
  return deferred.promise;
}
function getById(_id){
  var deferred = Q.defer();
  userDb.findById(_id, function(err, user){
    if(err)deferred.reject(err);
    if(user){
      deferred.resolve(_.omit(user, 'hash'));
    }else{
      deferred.resolve();
    }
  });
  return deferred.promise;
}
function create(userParam){
  var deferred = Q.defer();
  userDb.findOne({username:userParam.usernam}, function(err, user){
    if(err) deferred.reject(err);
    if(user){
      deferred.reject('Username "'+userParam.username+'"is already taken');
    }else{
      createUser();
    }
  });
  function createUser(){
    var user = _.omit(userParam, 'password');
    user.hash = bcrypt.hashSync(userParam.password, 10);
    usersDb.insert(user, function(err, doc){
      if(err)deferred.reject(err);
      deferred.resolve();
    });
  }
  return deferred.promise;
}
function update(_id, userParam){
  var deferred = Q.defer();
  usersDb.findById(_id, function(err, user){
    if(err)deferred.reject(err);
    if(user.username !== userParam.username){
      usersDb.findOne({username:userParam.username}, function(err, user){
        if(err)deferred.reject(err);
        if(user){
          deferred.reject('Username "'+req.body.username +'" is already taken');
        }else{
          updateUser();
        }
      });
    }else{
      updateUser();
    }
  });
  function updateUser(){
    var set = {
      firstName:userParam.firstName,
      lastName:userParam.lastName,
      username:userParam.username
    };
    if(userParam.password){
      set.hash = bcrypt.hasSync(userParam.password, 10);
    }
    userDb.findAndModify(
      {_id:_id},
      {$set:set},
      function(err, doc){
        if(err)deferred.reject(err);
        deferred.resolve();
      }
    );
  }
  return deferred.promise;
}
function _delete(_id){
  var deferred = Q.defer();
  usersDb.remove(
    {_id:_id},
    function(err){
      if(err)deferred.reject(err);
      deferred.resolve();
    }
  );
  return deferred.promise;
}

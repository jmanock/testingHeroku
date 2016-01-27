(function(){
  'use strict';
  angular
  .module('app')
  .controller('Account.IndexController', Controller);

  function Controller($window, UserService, FlashService){
    var vm = this;
    vm.user = null;
    vm.saveUser = saveUser;
    vm.deleteUser = deleteUser;

    initControlller();
    function initController(){
      UserService.GetCurrent().then(function(user){
        vm.user = user;
      });
    }
    function saveUser(){
      UserService.Update(vm.user)
      .then(function(){
        FlashService.Success('User updated');
      })
      .catch(function(err){
        FlashService.Error(error);
      });
    }
    function deleteUser(){
      UserService.Delete(vm.user._id)
      .then(function(){
        $window.location = '/login';
      })
      .catch(function(error){
        FlashService.Error(error);
      });
    }
  }
})();

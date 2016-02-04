(function() {
  'use strict';

  angular.module('registerUserModule')
  .controller('RegisterUserController', RegisterUserController);

  //** @ngInject */
  function RegisterUserController(api, $log) {
    var vm = this;
    vm.userData = {
      email: null,
      password: null,
      nick: null,
      phone: null,
      gender: null
    };
    vm.register = register;
    vm.clearRegisterForm = clearRegisterForm;
    vm.registerInfo = '';

    ///////////////////////
    function register() {
      api.user(
        {
          method: 'POST',
          data: vm.userData
        }
      )
      .then(
        function() {
          vm.clearRegisterForm();
          vm.registerInfo = 'Rejestracja ukończona pomyślnie.';
        },
        function(results) {
          $log.log('Rejestracja nie powiodła się. Error: ' + angular.toJson(results));
          vm.registerInfo = 'Rejestracja nie powiodła się.';
        }
      );
    }

    function clearRegisterForm() {
      var userDataKeys = Object.keys(vm.userData);
      var userDataLength = userDataKeys.length;

      for (var i = 0; i < userDataLength; i++) {
        vm.userData[userDataKeys[i]] = null;
      }
    }
  }
})();

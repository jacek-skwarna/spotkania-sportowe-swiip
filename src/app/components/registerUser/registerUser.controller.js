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
      gender: 'm'
    };
    vm.register = register;
    vm.clearRegisterForm = clearRegisterForm;
    vm.registerInfo = {
      status: '',
      message: ''
    };
    vm.formSubmitted = false;

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
          vm.registerInfo.message = 'Rejestracja ukończona pomyślnie.';
          vm.registerInfo.status = 'success';
        },
        function(results) {
          $log.log('Rejestracja nie powiodła się. Error: ' + angular.toJson(results));
          vm.registerInfo.message = 'Rejestracja nie powiodła się.';
          vm.registerInfo.status = 'alert';
        }
      );
    }

    function clearRegisterForm() {
      var userDataKeys = Object.keys(vm.userData);
      var userDataLength = userDataKeys.length;

      vm.formSubmitted = false;

      for (var i = 0; i < userDataLength; i++) {
        vm.userData[userDataKeys[i]] = null;
      }
    }
  }
})();

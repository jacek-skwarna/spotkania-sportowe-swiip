(function() {
  'use strict';

  angular.module('contactModule')
  .controller('ContactController', ContactController);

  /** @ngInject */
  function ContactController($log, logonService, User) {
    var vm = this;

    vm.currentUser = {};
    vm.submitForm = submitForm;
    vm.contactInfo = {
      message: '',
      status: ''
    };

    // check if user is logged in and if yes then initialize currentUser object
    logonService.isLogged()
    .then(
      function(results) {
        // user _id is expected in results
        $log.log('zalogowany, results: ' + angular.toJson(results));
        // create a new user, get it's data and save it as a currentUser
        prepareUser(results);
      },
      function(results) {
        $log.log('niezalogowany, results: ' + angular.toJson(results));
      }
    );

    function prepareUser(userId) {
      vm.currentUser = new User(userId);
      return vm.currentUser.getData();
    }

    function resetUser() {
      vm.currentUser = {};
    }

    function submitForm() {
      resetUser();
      vm.contactInfo.message = 'Formularz został wysłany';
      vm.contactInfo.status = 'success';
    }
  }
})();

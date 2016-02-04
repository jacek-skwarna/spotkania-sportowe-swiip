(function() {
  'use strict';

  angular
  .module('currentUserModule')
  .controller('CurrentUserController', CurrentUserCtrl);

  /** @ngInject */
  function CurrentUserCtrl($log, logonService, User) {
    var vm = this;

    vm.currentUser = {};

    vm.credentials = {
      email: null,
      pass: null
    };

    vm.isLoggedIn = isLoggedIn;
    vm.prepareUser = prepareUser;
    vm.resetUser = resetUser;
    vm.login = login;
    vm.logout = logout;

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

    function resetUser() {
      vm.currentUser = {};
      vm.credentials.email = null;
      vm.credentials.pass = null;
    }

    function login() {
      $log.log('w main.login, vm.provideEmail: ' + vm.credentials.email + ', vm.providePassword: ' + vm.credentials.pass);
      logonService.login(vm.credentials.email, vm.credentials.pass)
      .then(function(results) {
        // user _id is expected in results
        $log.log('w kontr, results: ' + angular.toJson(results));
        prepareUser(results);
      });
    }

    function logout() {
      vm.resetUser();
      logonService.logout();
    }

    function isLoggedIn() {
      if (vm.currentUser.hasOwnProperty('data') && vm.currentUser.data.hasOwnProperty('_id')) {
        return true;
      }

      return false;
    }

    function prepareUser(userId) {
      vm.currentUser = new User(userId);
      return vm.currentUser.getData();
    }
  }
})();

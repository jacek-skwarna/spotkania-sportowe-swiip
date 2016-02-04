(function() {
  'use strict';

  angular
  .module('registerUserModule')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
    .state('main.registerUser', {
      url: 'register',
      templateUrl: 'app/components/registerUser/registerUser.html',
      controller: 'RegisterUserController',
      controllerAs: 'registerUserCtrl'
    });
  }
})();

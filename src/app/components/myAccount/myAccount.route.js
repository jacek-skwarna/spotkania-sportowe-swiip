(function() {
  'use strict';

  angular
  .module('myAccountModule')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
    .state('main.myAccount', {
      url: 'myaccount',
      templateUrl: 'app/components/myAccount/myAccount.html',
      controller: 'MyAccountController',
      controllerAs: 'myAccountCtrl'
    });
  }
})();

(function() {
  'use strict';

  angular
  .module('contactModule')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
    .state('main.contact', {
      url: 'contact',
      templateUrl: 'app/components/contact/contact.html',
      controller: 'ContactController',
      controllerAs: 'contactCtrl'
    });
  }
})();

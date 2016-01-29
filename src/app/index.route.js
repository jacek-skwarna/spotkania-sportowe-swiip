(function() {
  'use strict';

  angular
    .module('spotkaniaSportoweSwiip')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        abstract: true,
        views: {
          '': {
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
          },
          'mainNavigation@main': {
            templateUrl: 'app/components/mainNavigation/mainNavigation.html'
          },
          'currentUserSection@main': {
            templateUrl: 'app/components/currentUser/currentUserSection.html'
          },
          'footer@main': {
            templateUrl: 'app/components/footer/footer.html'
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  }

})();

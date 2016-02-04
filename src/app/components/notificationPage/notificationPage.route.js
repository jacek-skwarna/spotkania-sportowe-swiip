(function() {
  'use strict';

  angular
  .module('notificationPageModule')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
    .state('main.notificationPage', {
      url: 'notification',
      abstract: true,
      controller: 'NotificationPageController',
      controllerAs: 'notificationPageCtrl',
      templateUrl: 'app/components/notificationPage/notificationPage.html'
    })
    .state('main.notificationPage.createMeetingAnonymous', {
      url: '/create-meeting-anonymous',
      templateUrl: 'app/components/notificationPage/subpages/createMeetingAnonymous.html'
    });
  }
})();

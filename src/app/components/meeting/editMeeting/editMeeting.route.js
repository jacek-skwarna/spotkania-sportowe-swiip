(function() {
  'use strict';

  angular
  .module('editMeetingModule')
  .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
    .state('main.editMeeting', {
      url: 'edit/meeting/:_id',
      templateUrl: 'app/components/meeting/editMeeting/editMeeting.html',
      controller: 'EditMeetingController',
      controllerAs: 'editMeetingCtrl'
    });
  }
})();

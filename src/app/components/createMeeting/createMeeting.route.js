(function() {
    'use strict';

    angular
    .module('createMeetingModule')
    .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
        .state('main.createMeeting', {
            url: 'create/meeting',
            templateUrl: 'app/components/createMeeting/createMeeting.html',
            resolve: {
              isLoggedIn: function(logonService, $state) {
                logonService.isLogged().then(
                  function(results) {
                    return results;
                  },
                  function() {
                    $state.go('main.notificationPage.createMeetingAnonymous');
                  }
                );
              }
            },
            controller: 'CreateMeetingController',
            controllerAs: 'createMeetingCtrl'
        });
    }
})();

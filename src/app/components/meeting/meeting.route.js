(function() {
	'use strict';

	angular
	.module('meetingModule')
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider) {
		$stateProvider
		.state('main.meeting', {
			url: 'meeting/:_id',
			templateUrl: 'app/components/meeting/meeting.html',
			controller: 'MeetingController',
			controllerAs: 'meetingCtrl',
      resolve: {
        isLoggedIn: function(logonService, $state, $stateParams, $log) {
          $log.log('resolve state main.meeting');
          logonService.isLogged().then(
            function(results) {
              $log.log('resolve state main.meeting, resolve');
              // for logged user display meeting details with additional features
              $state.go('main.meeting.loggedUser', {_id: $stateParams._id});
              return results;
            },
            function() {
              $log.log('resolve state main.meeting, reject');
              // for anonymous user just show the meeting details
              $state.go('main.meeting', {_id: $stateParams._id});
              return false;
            }
          );
        }
      }
		})
    .state('main.meeting.loggedUser', {
      url: '/logged',
      resolve: {
        isLoggedIn: function(logonService, $state, $stateParams, $log) {
          $log.log('resolve state main.meeting.loggedUser');
          logonService.isLogged().then(
            function(results) {
              // for logged user display meeting details with additional features
              return results;
            },
            function() {
              // for anonymous user just show the meeting details
              $state.go('main.meeting', {_id: $stateParams._id});
              return false;
            }
          );
        }
      },
      views: {
        loggedUserBox: {
          templateUrl: 'app/components/meeting/loggedUserBox.html'
        }
      }
    });
	}
})();

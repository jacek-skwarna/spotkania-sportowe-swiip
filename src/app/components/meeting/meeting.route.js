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
		});
	}
})();

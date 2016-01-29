(function() {
	'use strict';

	angular
	.module('meetingsModule')
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider) {
		$stateProvider
		.state('main.meetingsCategoriesList', {
			url: 'meetings',
			templateUrl: 'app/components/meetings/meetingsCategoriesList.html'
		})
		.state('main.meetingsInCategorySearch', {
			url: 'meetings/:category/:offset/:limit?gender&level',
			templateUrl: 'app/components/meetings/meetingsInCategorySearch.html',
			controller: 'MeetingsController',
			controllerAs: 'meetingsCtrl',
			abstract: true
		})
		.state('main.meetingsInCategorySearch.list', {
			url: '',
			views: {
				'filters': {
					templateUrl: 'app/components/meetings/meetingsFilters.html'
				},
				'list': {
					templateUrl: 'app/components/meetings/meetingsList.html'
				}
			}

		});
	}
})();
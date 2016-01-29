(function() {
	'use strict';

	angular
	.module('userModule')
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider) {
		$stateProvider
		.state('user', {
			url: '/user',
			templateUrl: 'app/components/user/user.html',
			controller: 'UserController',
			controllerAs: 'user'
		});
	}
})();
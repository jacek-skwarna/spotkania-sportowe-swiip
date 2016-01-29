(function() {
	'use strict';

	angular
	.module('homeModule')
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider) {
		$stateProvider
		.state('main.home', {
			url: 'home',
			templateUrl: 'app/components/home/home.html'
		});
	}
})();
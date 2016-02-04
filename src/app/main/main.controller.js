(function() {
	'use strict';

	angular
	.module('spotkaniaSportoweSwiip')
	.controller('MainController', MainController);

	/** @ngInject */
	function MainController($log, $state, mainNavigation) {
		var vm = this;

		vm.mainNavigation = mainNavigation.getNavigation();
	}
})();
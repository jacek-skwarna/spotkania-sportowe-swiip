(function() {
	'use strict';

	angular
	.module('mainNavigationModule')
	.service('mainNavigation', mainNavigation);

	/** @ngInject */
	function mainNavigation() {
		var options = [
			{
				name: 'Start',
				state: 'main.home'
			},
			{
				name: 'Kontakt',
				state: 'main.contact'
			},
			{
				name: 'Moje konto',
				state: 'main.myAccount'
			}
		];

		this.getNavigation = function() {
			return options;
		};
	}
})();

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
				name: 'Kategorie',
				state: 'main.categories'
			},
			{
				name: 'Kontakt',
				state: 'main.contact'
			},
			{
				name: 'Regulamin',
				state: 'main.terms'
			},
			{
				name: 'Moje konto',
				state: 'main.user'
			}
		];

		this.getNavigation = function() {
			return options;
		};
	}
})();

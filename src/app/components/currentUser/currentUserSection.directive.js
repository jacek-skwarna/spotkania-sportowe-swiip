(function(){
	'use strict';

	angular
		.module('spotkaniaSportoweSwiip')
		.directive('currentUserSection', currentUserSection);

	/** @ngInject */
	function currentUserSection() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/currentUser/currentUserSection.html'
		};

		return directive;

		function userSectionCtrl() {

		}
	}
})();
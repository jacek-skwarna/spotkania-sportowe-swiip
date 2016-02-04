(function() {
	'use strict';
	
	angular.module('categoriesModule')
	.service('categories', categories);

	/** @ngInject */
	function categories($q, api) {
		var categoriesArray = [];
		var self = this;

		self.getCategories = getCategories;

		function getCategories() {
			return $q(serveCategories);
		}

		function serveCategories(resolve, reject) {
			if (categoriesArray.length) {
				resolve(categoriesArray);
			} else {
				api.categories({method: 'GET'})
				.then(function(data) {
					categoriesArray = data.results;
					resolve(categoriesArray);
				},
				function() {
					reject(categoriesArray);
				});
			}
		}
	}
})();